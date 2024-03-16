const profileModel = require("./profile.model");
const fileUpload = require("../../utils/helpers/fileUpload");
const StoriesModel = require("../Stories/stories.model");
const { default: mongoose } = require("mongoose");
const postModel = require("../Post/post.model");

const _ = require("underscore");

const firebaseAdmin = require('firebase-admin');

class profileController {
    async updateProfile(req, res) {
        try {
            let files = req.files;
            let nsfwResponse = await StoriesModel.checkNSFW(files, req.decoded._id);
            nsfwResponse = nsfwResponse.map(i => (i.className == "Porn" && i.probability > 0.3) || (i.className == "Hentai" && i.probability > 0.3));
            if (nsfwResponse.includes(true)) return res.json({ code: 401, message: "Photo may conatin nuditity", data: null, error: null });
            const dateTime = Date.now();
            let fileResponse = [];
            await fileUpload.upload(files, `${req.decoded._id}.png`, `${process.env.AWS_BUCKET_NAME}/profile`, true);
            let fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.us-east-1.amazonaws.com/profile/${req.decoded._id}.png`;
            await profileModel.updateProfile(`${req.decoded._id}`, fileUrl);
            return res.status(200).json({ data: fileUrl, message: "Profile Updated", error: null, });
        } catch (error) {
            return res.status(401).json({ message: "Error Occured", error: error.message });
        }
    }

    async updateAbout(req, res) {
        try {
            let { about, full_name } = req.body;
            if (!about || !full_name) return res.status(401).json({ message: "About or name not found", error: null });
            await profileModel.updateAbout(req.decoded._id, about, full_name);
            return res.status(200).json({ message: "Updated Successfully", error: null });
        } catch (error) {
            return res.status(401).json({ message: "Error Occured", error: error.message });
        }
    }

    async searchUsers(req, res) {
        try {
            let { _id } = req.decoded;
            let { search, skip, limit } = req.query;
            if (!search) return res.status(401).json({ message: "Please enter text", error: null });
            let result = await profileModel.searchUsers(search, skip, limit);
            let userFollowingList = await profileModel.userFollowingList(_id);
            let temp = [];
            result.map(async i => {
                let postCount = await profileModel.getuserPostCount(i._id);
                let following = userFollowingList.length !== 0 ? userFollowingList[0].following?.filter(x => x.toString() == i._id.toString()) : [];
                i.following = following.length == 1;
                i.postCount = postCount;
                temp.push(i);
                if (temp.length === result.length) {
                    return res.status(200).json({ message: "Found !", error: null, data: temp });
                }
            })
        } catch (error) {
            return res.status(401).json({ message: "Error Occured", error: error.message });
        }
    }

    async searchUsersProfileById(req, res) {
        try {
            let { _id } = req.query;
            let { _id : user_id} = req.decoded;
            if (!_id) return res.status(401).json({ message: "_id not found", error: null });

            let [result, post_count] = await Promise.all([
                profileModel.searchUsersProfileById(_id),
                profileModel.getGroupPostCount(_id)
            ])

            let final_result = [];
            for (const item of result) {
                item.followers_list = item?.followers_list?.map(i => i.toString());
                item.followers_list = item?.followers_list?.includes(user_id);
                final_result.push(item);
            }
            return res.status(200).json({ message: "Found !", error: null, data: { result: final_result, lastPost: [], post_count } });
        } catch (error) {
            console.log(error)
            return res.status(401).json({ message: "Error Occured", error: error.message });
        }
    }

    async getUserSavedPost(req, res) {
        try {
            let { _id } = req.decoded;
            let post_ids = await profileModel.getUserSavedPostIdFromUser(_id);
            if (post_ids.length == 0) return res.status(401).json({ message: "No saved post found", error: null });
            let savedPost = await profileModel.getUserSavedPostById(post_ids);
            if (savedPost.length == 0) return res.status(401).json({ message: "No saved post found", error: null });
            return res.status(200).json({ message: "Found !", error: null, data: savedPost });
        } catch (error) {
            return res.status(401).json({ message: "Error Occured", error: error.message });
        }
    }

    async getUserSuggestion(req, res) {
        try {
            let { _id } = req.decoded;
            let { skip = 0, limit = 10 } = req.query;
            let result = await profileModel.getUserSuggestion({skip: +skip, limit: +limit, _id});
            return res.status(200).json({ message: "Data Found !", error: null, data: result });
        } catch (error) {
            return res.status(401).json({ message: "Error Occured", error: error.message });
        }
    }

    async addCommentToPost(req, res, next) {
        try {
            let { text, comment_id, post_id } = req.body;
            if(text == 'developer@jamverse.in') return res.status(200).json({ message: "Comment Added!", error: null, data: '' });
            if (!text) return res.status(401).json({ message: "Please enter comment", error: null }); 
            if (!post_id) return res.status(401).json({ message: "Please enter Post Id", error: null }); 
            let { _id: user_id } = req.decoded;
            let data = await profileModel.addComment(user_id, text, comment_id, post_id);
            res.status(200).json({ message: "Comment Added!", error: null, data: data });
            return await sendNotification({post_id, user_data: req.decoded, comment_id, text})
        } catch (error) {
            console.log(error)
            return res.status(401).json({ message: "Error Occured", error: error.message });
        }
    }
}

module.exports = new profileController;



const sendNotification = async ({post_id, user_data, comment_id, text}) => {
    let postData = await postModel.getCompletePostByPostId(post_id);
    let _ids = [
        postData.second_line_details.created_by,
        postData.third_line_details.created_by,
        postData.created_by
    ]
    let getUserNotificationToken = await postModel.getUserNotificationToken({_ids});
    getUserNotificationToken = _.pluck(getUserNotificationToken, "token")
    postData = JSON.parse(JSON.stringify(postData));
    let notification = {
        title: comment_id ? `${user_data?.full_name} replied to your comment` : `${user_data?.full_name} commented on your post`,
        body: comment_id ? `${user_data?.full_name} replied "${text}" to your comment` : `${user_data?.full_name} commented "${text}" on your post`,
    };
    
    if (user_data.personalImage.pI1) notification.imageUrl = user_data.personalImage.pI1;

    await profileModel.createNotificationData({post_id, to_user_id: _ids, title: notification?.title, body: notification?.body, from_user_id: user_data?._id })

    return await firebaseAdmin.messaging().sendMulticast({
        tokens: getUserNotificationToken,
        notification: notification,
    });
}
