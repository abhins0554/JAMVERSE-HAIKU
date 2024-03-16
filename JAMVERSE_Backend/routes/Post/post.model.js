const mongoose = require('mongoose');
const postSchema = require("../../schema/post.schema");
const userSchema = require("../../schema/users.schema");
const postGroupSchema = require("../../schema/postGroup.schema");
const notificationSchema = require("../../schema/notification.schema");
const moment = require('moment/moment');

class postModel {
  async createPost(font_size, color, alignment, letter_spacing, font_family, bg_type, bg_info, text, type, createdBy) {
    const post = new postSchema({
      font_size: font_size,
      color: color,
      alignment: alignment,
      letter_spacing: letter_spacing,
      font_family: font_family,
      background: {
        bg_type: bg_type,
        bg_info: bg_info
      },
      text: text,
      createdBy: createdBy,
      p_type: type
    });
    return await post.save();
  }

  async getUserFollowing(user_id) {
    return userSchema.findById({ _id: mongoose.Types.ObjectId(user_id) }, { following: 1 });
  }

  async findFriendPost(following_ids, skip, limit) {
    following_ids = following_ids.map(i => mongoose.Types.ObjectId(i));
    let query = [{ $match: { createdBy: { $in: following_ids }, p_type: "3-line-single" } },
    { "$addFields": { "userId": { "$toObjectId": "$createdBy" } } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userData"
      }
    },
    { $unwind: "$userData" },
    { $sort: { createdAt: -1 } },
    { $project: { _id: 1, "userData.full_name": 1, view: 1, "userData.personalImage": 1, "userData._id": 1, font_size: 1, color: 1, alignment: 1, letter_spacing: 1, font_family: 1, background: 1, text: 1, createdAt: 1, p_type: 1, likes: 1, comments: 1 } },
    ];
    if (limit) query.push({ "$limit": Number(skip) + Number(limit) })
    if (skip) query.push({ "$skip": Number(skip) })
    return postSchema.aggregate(query);
  }

  async likeUnlike(post_id, type, user_id, post_type) {
    if (post_type == "group") {
      if (type == "like") {
        return postGroupSchema.updateOne({ _id: post_id }, { $push: { likes: user_id } });
      }
      else {
        return postGroupSchema.updateOne({ _id: post_id }, { $pull: { likes: user_id } });
      }
    }
    if (type == "like") {
      return postSchema.updateOne({ _id: post_id }, { $push: { likes: user_id } });
    }
    else {
      return postSchema.updateOne({ _id: post_id }, { $pull: { likes: user_id } });
    }
  }

  async addComment(post_id, text, user_id) {
    return postSchema.updateOne({ _id: post_id }, { $push: { comments: { text, user_id } } });
  }

  async savePost(post_id, type, user_id) {
    if (type == "save") {
      return userSchema.updateOne({ _id: user_id }, { $push: { saved_post: post_id } });
    }
    else {
      return userSchema.updateOne({ _id: user_id }, { $pull: { saved_post: post_id } });
    }
  }

  async createGroupPost({ user_id, text, font_family, bg_info, color, title }) {
    const post = new postGroupSchema({
      created_by: user_id,
      mediaLink: bg_info,
      font_family,
      first_line_text: text,
      color: color,
      title: title
    });
    return await post.save();
  }

  async createGroupPostSecondLine({ user_id, line, text, post_id }) {
    let oldJamDataFind = await postGroupSchema.findOne({ _id: post_id });
    if (user_id === oldJamDataFind.created_by.toString()) return "block";
    if (oldJamDataFind.second_line_details.created_by && oldJamDataFind.second_line_details.second_line_text) {
      // copy to new element
      const post = new postGroupSchema({
        created_by: oldJamDataFind.created_by,
        mediaLink: oldJamDataFind.mediaLink,
        font_family: oldJamDataFind.font_family,
        first_line_text: oldJamDataFind.first_line_text,
        "second_line_details.created_by": user_id,
        "second_line_details.second_line_text": text
      })
      return await post.save();
    }
    else {
      oldJamDataFind.second_line_details.created_by = user_id;
      oldJamDataFind.second_line_details.second_line_text = text;
      return await oldJamDataFind.save();
    }
  }

  async createGroupPostThirdLine({ user_id, line, text, post_id }) {
    let oldJamDataFind = await postGroupSchema.findOne({ _id: post_id });
    if (user_id === oldJamDataFind.created_by.toString()) return "block";
    if (user_id === oldJamDataFind.second_line_details.created_by.toString()) return "block";
    if (oldJamDataFind.third_line_details.created_by && oldJamDataFind.third_line_details.third_line_text) {
      // copy to new element
      const post = new postGroupSchema({
        created_by: oldJamDataFind.created_by,
        mediaLink: oldJamDataFind.mediaLink,
        font_family: oldJamDataFind.font_family,
        first_line_text: oldJamDataFind.first_line_text,
        "second_line_details.created_by": oldJamDataFind.second_line_details.created_by,
        "second_line_details.second_line_text": oldJamDataFind.second_line_details.second_line_text,
        "third_line_details.created_by": user_id,
        "third_line_details.third_line_text": text
      })
      return await post.save();
    }
    else {
      oldJamDataFind.third_line_details.created_by = user_id;
      oldJamDataFind.third_line_details.third_line_text = text;
      return await oldJamDataFind.save();
    }
  }

  async findPostGroupSemiCompleted({ _id, skip, limit }) {
    _id = mongoose.Types.ObjectId(_id);

    return await postGroupSchema.aggregate([
      {
        $match: {
          $and: [
            { created_by: { $ne: _id } },
            { "second_line_details.created_by": { $ne: _id } },
            { "third_line_details.created_by": { $ne: _id } },
            { skips: { $ne: _id } },
            {
              $or: [
                {
                  $and: [
                    { "second_line_details.created_by": { $exists: false } },
                    { "third_line_details.created_by": { $exists: false } },
                  ]
                },
                {
                  $and: [
                    { "second_line_details.created_by": { $exists: true } },
                    { "third_line_details.created_by": { $exists: false } },
                  ]
                },
              ]
            },
          ]
        }
      },
      { "$limit": skip + limit },
      { "$skip": skip }
    ])
  }

  async findPostGroupSemiCompletedNew({ _id, skip, limit }) {
    _id = mongoose.Types.ObjectId(_id);
    return await postGroupSchema.aggregate([
      {
        $match: {
          $and: [
            { created_by: { $ne: _id } },
            { "second_line_details.created_by": { $ne: _id } },
            { "third_line_details.created_by": { $ne: _id } },
            { skips: { $ne: _id } },
            {
              $or: [
                {
                  $and: [
                    { "second_line_details.created_by": { $exists: false } },
                    { "third_line_details.created_by": { $exists: false } },
                  ]
                },
                {
                  $and: [
                    { "second_line_details.created_by": { $exists: true } },
                    { "third_line_details.created_by": { $exists: false } },
                  ]
                },
              ]
            },
          ]
        }
      },
      {
        '$lookup': {
          'from': 'users',
            'localField': 'created_by',
              'foreignField': '_id',
                'as': 'first_user'
        }
      }, {
        '$lookup': {
          'from': 'users',
            'localField': 'second_line_details.created_by',
              'foreignField': '_id',
                'as': 'second_user'
        }
      }, {
        '$lookup': {
          'from': 'users',
            'localField': 'third_line_details.created_by',
              'foreignField': '_id',
                'as': 'third_user'
        }
      },
      {
        "$project": {
          '_id': 1,
          'first_line_text': 1,
          'title': 1,
          'color': 1,
          'second_line_details.second_line_text': 1,
          'third_line_details.third_line_text': 1,
          'first_user._id': 1,
          'first_user.full_name': 1,
          'first_user.personalImage': 1,
          'second_user._id': 1,
          'second_user.full_name': 1,
          'second_user.personalImage': 1,
          'third_user._id': 1,
          'third_user.full_name': 1,
          'third_user.personalImage': 1,
        }
      },
      { "$limit": skip + limit },
      { "$skip": skip }
    ])
  }

  async findPostGroupCompleted({ skip, limit, post_id }) {
    if (post_id) return await postGroupSchema.aggregate([
      {
        $match: {
          $and: [
            { "second_line_details.created_by": { $exists: true } },
            { "third_line_details.created_by": { $exists: true } },
          ],
          _id: mongoose.Types.ObjectId(post_id),
        }
      },
      { $sort: { createdAt: -1 } },
    ])
    else return await postGroupSchema.aggregate([
      {
        $match: {
          $and: [
            { "second_line_details.created_by": { $exists: true } },
            { "third_line_details.created_by": { $exists: true } },
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      { "$limit": skip + limit },
      { "$skip": skip }
    ])
  }

  async findPostGroupCompletedNew({ skip, limit, post_id, _id }) {
    if (post_id) return await postGroupSchema.aggregate(
      [
        {
          '$match': {
            '$and': [
              {
                'second_line_details.created_by': {
                  '$exists': true
                }
              }, {
                'third_line_details.created_by': {
                  '$exists': true
                }
              }
            ],
            _id: mongoose.Types.ObjectId(post_id),
          }
        },
        {
          '$lookup': {
            'from': 'users',
            'localField': 'created_by',
            'foreignField': '_id',
            'as': 'first_user'
          }
        }, {
          '$lookup': {
            'from': 'users',
            'localField': 'second_line_details.created_by',
            'foreignField': '_id',
            'as': 'second_user'
          }
        }, {
          '$lookup': {
            'from': 'users',
            'localField': 'third_line_details.created_by',
            'foreignField': '_id',
            'as': 'third_user'
          }
        }, {
          '$unwind': '$first_user'
        }, {
          '$unwind': '$second_user'
        }, {
          '$unwind': '$third_user'
        }, {
          '$sort': {
            'createdAt': -1
          }
        }, {
          '$project': {
            '_id': 1,
            'first_line_text': 1,
            'title': 1,
            'color': 1,
            'second_line_details.second_line_text': 1,
            'third_line_details.third_line_text': 1,
            'first_user._id': 1,
            'first_user.full_name': 1,
            'first_user.personalImage': 1,
            'second_user._id': 1,
            'second_user.full_name': 1,
            'second_user.personalImage': 1,
            'third_user._id': 1,
            'third_user.full_name': 1,
            'third_user.personalImage': 1,
            'is_liked': {
              '$in': [
                mongoose.Types.ObjectId(_id), '$likes'
              ]
            },
            'like_count': {
              '$size': '$likes'
            },
            'comment_count': {
              '$size': '$comment'
            }
          }
        },
        { "$limit": skip + limit },
        { "$skip": skip }
      ]
    )
    return await postGroupSchema.aggregate(
      [
        {
          '$match': {
            '$and': [
              {
                'second_line_details.created_by': {
                  '$exists': true
                }
              }, {
                'third_line_details.created_by': {
                  '$exists': true
                }
              }
            ]
          }
        },
        {
          '$lookup': {
            'from': 'users',
            'localField': 'created_by',
            'foreignField': '_id',
            'as': 'first_user'
          }
        }, {
          '$lookup': {
            'from': 'users',
            'localField': 'second_line_details.created_by',
            'foreignField': '_id',
            'as': 'second_user'
          }
        }, {
          '$lookup': {
            'from': 'users',
            'localField': 'third_line_details.created_by',
            'foreignField': '_id',
            'as': 'third_user'
          }
        }, {
          '$unwind': '$first_user'
        }, {
          '$unwind': '$second_user'
        }, {
          '$unwind': '$third_user'
        }, {
          '$sort': {
            'createdAt': -1
          }
        }, {
          '$project': {
            '_id': 1,
            'first_line_text': 1,
            'title': 1,
            'color': 1,
            'second_line_details.second_line_text': 1,
            'third_line_details.third_line_text': 1,
            'first_user._id': 1,
            'first_user.full_name': 1,
            'first_user.personalImage': 1,
            'second_user._id': 1,
            'second_user.full_name': 1,
            'second_user.personalImage': 1,
            'third_user._id': 1,
            'third_user.full_name': 1,
            'third_user.personalImage': 1,
            'is_liked': {
              '$in': [
                mongoose.Types.ObjectId(_id), '$likes'
              ]
            },
            'like_count': {
              '$size': '$likes'
            },
            'comment_count': {
              '$size': '$comment'
            }
          }
        },
        { "$limit": skip + limit },
        { "$skip": skip }
      ]
    )
  }

  async findUserDetails({ _id }) {
    _id = mongoose.Types.ObjectId(_id);
    return userSchema.findOne({ _id }, { full_name: 1, personalImage: 1, _id: 1, user_name: 1 });
  }

  async skipsGroupPost(post_id, user_id) {
    return postGroupSchema.updateOne({ _id: post_id }, { $push: { skips: user_id } });
  }

  async findGroupPostById(post_id) {
    post_id = mongoose.Types.ObjectId(post_id);
    return postGroupSchema.find({ _id: post_id }, { likes: 1 });
  }

  async getCompletePostByUserId({ _id, skip, limit }) {
    _id = mongoose.Types.ObjectId(_id);
    return await postGroupSchema.aggregate([
      {
        $match: {
          $and: [
            { "second_line_details.created_by": { $exists: true } },
            { "third_line_details.created_by": { $exists: true } },
          ],
          $or: [
            { "created_by": _id },
            { "second_line_details.created_by": _id },
            { "third_line_details.created_by": _id }
          ]
        },
      },
      { $sort: { createdAt: -1 } },
      { "$limit": skip + limit },
      { "$skip": skip }
    ])
  }

  async getCompletePostByUserIdNew({ _id, skip, limit, user_id_filter }) {
    _id = mongoose.Types.ObjectId(_id);
    return await postGroupSchema.aggregate(
      [
        {
          '$match': {
            '$and': [
              {
                'second_line_details.created_by': {
                  '$exists': true
                }
              }, {
                'third_line_details.created_by': {
                  '$exists': true
                }
              }
            ],
            '$or': [
              { "created_by": _id },
              { "second_line_details.created_by": _id },
              { "third_line_details.created_by": _id }
            ]
          }
        },
        {
          '$lookup': {
            'from': 'users',
            'localField': 'created_by',
            'foreignField': '_id',
            'as': 'first_user'
          }
        }, {
          '$lookup': {
            'from': 'users',
            'localField': 'second_line_details.created_by',
            'foreignField': '_id',
            'as': 'second_user'
          }
        }, {
          '$lookup': {
            'from': 'users',
            'localField': 'third_line_details.created_by',
            'foreignField': '_id',
            'as': 'third_user'
          }
        }, {
          '$unwind': '$first_user'
        }, {
          '$unwind': '$second_user'
        }, {
          '$unwind': '$third_user'
        }, {
          '$sort': {
            'createdAt': -1
          }
        }, {
          '$project': {
            '_id': 1,
            'first_line_text': 1,
            'title': 1,
            'color': 1,
            'second_line_details.second_line_text': 1,
            'third_line_details.third_line_text': 1,
            'first_user._id': 1,
            'first_user.full_name': 1,
            'first_user.personalImage': 1,
            'second_user._id': 1,
            'second_user.full_name': 1,
            'second_user.personalImage': 1,
            'third_user._id': 1,
            'third_user.full_name': 1,
            'third_user.personalImage': 1,
            'is_liked': {
              '$in': [
                mongoose.Types.ObjectId(user_id_filter), '$likes'
              ]
            },
            'like_count': {
              '$size': '$likes'
            },
            'comment_count': {
              '$size': '$comment'
            }
          }
        },
        { "$limit": skip + limit },
        { "$skip": skip }
      ]
    )
  }

  async getCompletePostByPostId(_id) {
    _id = mongoose.Types.ObjectId(_id);
    return await postGroupSchema.findOne({ _id }, { "created_by": 1, "second_line_details.created_by": 1, "third_line_details.created_by": 1, "first_line": "$first_line_text", "second_line": "$second_line_details.second_line_text", "third_line": "$third_line_details.third_line_text" });
  }

  async getUserNotificationToken({ _ids }) {
    return userSchema.find({ _id: { $in: _ids } }, { token: 1 })
  }

  async createNotificationData({ post_id, to_user_id, title, body, from_user_id }) {
    await new notificationSchema({ post_id, to_user_id, title, body, dateTime: moment().format('YYYY-MM-DD HH:MM:Ss A'), type: 'comment', from_user_id }).save()
  }

  async getPostCommentById(_id) {
    return await postGroupSchema.findOne({ _id }, { "comment": 1 });
  }

}

module.exports = new postModel;