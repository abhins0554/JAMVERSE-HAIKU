const { default: mongoose } = require("mongoose");
const storySchema = require("../../schema/story.schema");
const userSchema = require("../../schema/users.schema");


let _model;

class storiesModel {
  async addStory(mediaLink, fileName, user_id, dateTime) {
    return storySchema.create({ mediaLink, fileName, user_id: mongoose.Types.ObjectId(user_id), dateTime });
  }

  async addedStoriesView(storyId, userId) {
    return storySchema.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(storyId) }, { $push: { view: userId } })
  }

  async getUserFollowing(user_id) {
    return userSchema.findById({ _id: mongoose.Types.ObjectId(user_id) }, { following: 1 });
  }

  async findFriendStories(following_ids, skip, limit) {
    following_ids = following_ids.map((i) => mongoose.Types.ObjectId(i));
    let query = [{ $match: { user_id: { $in: following_ids } } },
    { "$addFields": { "userId": { "$toObjectId": "$user_id" } } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userData"
      }
    },
    { $unwind: "$userData" },
    { $project: { _id: 1, mediaLink: 1, dateTime: 1, "userData.full_name": 1, view: 1, "userData.personalImage": 1 } },
    ];
    //! if (limit) query.push({ "$limit": skip + limit })
    //! if (skip) query.push({ "$skip": skip })
    return storySchema.aggregate(query);
  }

  async getUserById(users_id) {
    return userSchema.find({ _id: { $in: users_id } }, { full_name: 1, personalImage: 1 });
  }

  async checkNSFW(files, _id) {

    let predictions = [
      {
        "className": "Porn",
        "probability": 0.0656119108200073
      },
      {
        "className": "Sexy",
        "probability": 0.06644541025161743
      },
      {
        "className": "Hentai",
        "probability": 0.036029793322086334
      },
      {
        "className": "Neutral",
        "probability": 0.029253272339701653
      },
      {
        "className": "Drawing",
        "probability": 0.0026595296803861856
      }
    ]

    if (process.env.IS_SERVER == "true") {

      const jpeg = require('jpeg-js');
      const tf = require('@tensorflow/tfjs-node');

      const convert = async (img) => {
        // Decoded image in UInt8 Byte array
        const image = await jpeg.decode(img, true)

        const numChannels = 3
        const numPixels = image.width * image.height
        const values = new Int32Array(numPixels * numChannels)

        for (let i = 0; i < numPixels; i++)
          for (let c = 0; c < numChannels; ++c)
            values[i * numChannels + c] = image.data[i * 4 + c]

        return tf.tensor3d(values, [image.height, image.width, numChannels], 'int32')
      }

      const image = await convert(files[0].buffer)
      predictions = await _model.classify(image)
      image.dispose()

    }

    return predictions;
  }
}

const loadmodel = async () => {
  if (process.env.IS_SERVER == "true") {
    const nsfw = require('nsfwjs');
    _model = await nsfw.load();
  }
}

if (process.env.IS_SERVER == "true") loadmodel().then(() => {console.log("Model Loaded");})

module.exports = new storiesModel;
