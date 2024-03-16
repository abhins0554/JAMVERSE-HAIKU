const fs = require("fs")
const fileUpload = require("../../utils/helpers/fileUpload");
const StoriesModel = require("./stories.model");

class storiesController {
    async addStory(req, res,) {
        try {
            let files = req.files;
            let nsfwResponse = await StoriesModel.checkNSFW(files, req.decoded._id);
            nsfwResponse = nsfwResponse.map(i => (i.className == "Porn" && i.probability > 0.3) || (i.className == "Hentai" && i.probability > 0.3));
            if (nsfwResponse.includes(true)) return res.json({code: 401, message: "Photo may conatin nuditity", data: null, error: null});
            const dateTime = Date.now();
            let fileResponse = [];
            await fileUpload.upload(files, `${req.decoded._id}_${dateTime}_`, 'jamjimprod/stories');
            let fileUrl = `https://jamjimprod.s3.us-east-1.amazonaws.com/stories/${req.decoded._id}_${dateTime}_${files[0].originalname}`;
            await StoriesModel.addStory(fileUrl, `${req.decoded._id}_${dateTime}_${files[0].originalname}`, `${req.decoded._id}`, dateTime);
            return res.json({code: 200, message: "Story added Successfully", data: fileUrl});
        }
        catch (error) {
            console.log(error)
            return res.json({code: 401, message: "Story upload failed", data: null, error: error.message});
        }
    }

    async addStoryView(req, res) {
        try {
            const {story_id} = req.body;
            const {_id: user_id} = req.decoded;
            await StoriesModel.addedStoriesView(story_id, user_id);
            return res.json({code : 200, message: "successful"})
        }   
        catch (error) {
            return res.json({code: 401, message: "Story upload failed", data: null, error: error.message});
        }
    }

    async getStories (req, res) {
        try {
            const {_id: user_id} = req.decoded;
            let {skip = 0, limit = 20} = req.query;
            const userFollowing = await StoriesModel.getUserFollowing(user_id);
            const findStories = await StoriesModel.findFriendStories(userFollowing.following, Number(skip), Number(limit));

            const finalData = findStories.map(async (item) =>{
                let userViews = await StoriesModel.getUserById(item.view);
                item.view = userViews;
                return item;
            })
            const friendStory = await Promise.all(finalData);

            const selfStories = await StoriesModel.findFriendStories([user_id]);
            return res.status(200).json({code: 200, data: {friendStories: friendStory, selfStories}});
        }
        catch (e) {
            console.log(e)
            return res.status(500).json({message: "Error Occured", error: e.message});
        }
    }
}

module.exports = new storiesController;