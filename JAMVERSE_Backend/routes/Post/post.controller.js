const postModel = require("./post.model");
const constImage = require("../../constants/imageData.json");

const mongoose = require('mongoose');
const _ = require("underscore");
const firebaseAdmin = require('firebase-admin');
class postController {
    async createPost(req, res) {
        try {
            let { _id } = req.decoded;
            if (req.body.email === "developer@jamverse.in") return res.status(200).send({ message: "Success" });
            const { font_size, color, alignment, letter_spacing, font_family, bg_type, bg_info, text, type } = req.body

            await postModel.createPost(font_size, color, alignment, letter_spacing, font_family, bg_type, bg_info, text, type, _id)

            return res.status(200).send({ message: "Success" });
        }
        catch (err) {
            console.log(err);
            return res.status(400).send({ error: "Error", message: err.message })
        }
    }

    async getPost(req, res) {
        try {
            const { skip = 0, limit = 50 } = req.query;
            const { _id: user_id } = req.decoded;
            const userFollowing = await postModel.getUserFollowing(user_id);
            let findPost = await postModel.findFriendPost([...userFollowing?.following, ...[user_id]], skip, limit);
            findPost = findPost.map(i => {
                let likes = i?.likes?.map(i => i.toString()) ?? [];
                i.likeCount = i.likes.length;
                if (likes?.includes(user_id)) {
                    i.likes = true;
                }
                else {
                    i.likes = false;
                }
                return i;
            })
            return res.status(200).json({ code: 200, data: findPost });
        }
        catch (e) {
            return res.status(500).json({ message: "Error Occured", error: e.message });
        }
    }

    async likeUnlike(req, res) {
        let { post_id, type = "like", post_type = "group" } = req.body;
        const { _id: user_id } = req.decoded;
        try {
            let result = await postModel.likeUnlike(post_id, type, user_id, post_type);

            // else {
            //     if (type == "like") {

            //     }
            //     else {

            //     }
            // }
            res.status(200).json({ message: "done" });
            if (post_type == "group") {
                if (type == "like") {
                    return await sendNotification({ "type": "group", post_id, user_data: req.decoded })
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Some Error Occurred" });
        }
    }

    async addComment(req, res) {
        let { post_id, text } = req.body;
        const { _id: user_id } = req.decoded;
        try {
            let result = await postModel.addComment(post_id, text, user_id);
            return res.status(200).json({ message: "done" });
        } catch (error) {
            return res.status(401).json({ message: "Some Error Occurred" });
        }
    }

    async savePost(req, res) {
        let { post_id, type } = req.body;
        const { _id: user_id } = req.decoded;
        try {
            await postModel.savePost(post_id, type, user_id);
            return res.status(200).json({ message: "done" });
        } catch (error) {
            return res.status(401).json({ message: "Some Error Occurred", error: error.message });
        }
    }

    async createPostGroup(req, res) {
        try {
            if (req.body.text === "developer@jamverse.in") return res.status(200).json({ message: "done", data: "response" });
            let { line, text, post_id, font_family, bg_info, color, title } = req.body;
            const { _id: user_id } = req.decoded;
            if (!line) return res.status(400).json({ message: "line is required", error: null });
            if (!text) return res.status(400).json({ message: "text is required", error: null });
            if ((line === 2 || line === 3) && !post_id) return res.status(400).json({ message: "Post id is required", error: null });
            if ((line === 1) && !font_family) return res.status(400).json({ message: "Font Family is required", error: null });
            if ((line === 1) && !bg_info) return res.status(400).json({ message: "BG Info is required", error: null });

            let response;
            switch (line) {
                case 1:
                    response = await postModel.createGroupPost({ user_id, line, text, font_family, bg_info, color, title });
                    break;
                case 2:
                    response = await postModel.createGroupPostSecondLine({ user_id, line, text, post_id });
                    break;
                case 3:
                    response = await postModel.createGroupPostThirdLine({ user_id, line, text, post_id });
                    break;
                default:
                    return res.status(500).json({ message: "Server Error" });
                    break;
            }

            switch (response) {
                case "block":
                    return res.status(401).json({ message: "Invalid Access", data: response });
                    break;

                default:
                    return res.status(200).json({ message: "done", data: response });
                    break;
            }
        } catch (error) {
            return res.status(401).json({ message: "Some Error Occurred", error: error.message });
        }
    }

    async findPostGroupSemiCompleted(req, res) {
        try {
            let { _id } = req.decoded;
            let { page: skip, limit = 1 } = req.query;
            skip = Number(skip);
            limit = Number(limit);
            let [response] = await postModel.findPostGroupSemiCompleted({ _id, skip, limit });
            if (response?.created_by) response.created_by = await postModel.findUserDetails({ _id: response?.created_by });
            if (response?.second_line_details?.created_by) response.second_line_details.created_by = await postModel.findUserDetails({ _id: response?.second_line_details?.created_by });
            return res.status(200).json({ message: "done", data: response ?? {} });
        } catch (error) {
            return res.status(401).json({ message: "Some Error Occurred", error: error.message });
        }
    }

    async findPostGroupSemiCompletedNew(req, res) {
        try {
            let { _id } = req.decoded;
            let { skip, limit = 1 } = req.query;
            skip = Number(skip);
            limit = Number(limit);
            let response = await postModel.findPostGroupSemiCompletedNew({ _id, skip, limit });
            return res.status(200).json({ message: "done", data: response });
        } catch (error) {
            return res.status(401).json({ message: "Some Error Occurred", error: error.message });
        }
    }

    async findPostGroupCompleted(req, res) {
        try {
            let { _id, } = req.decoded;
            let { skip = 0, limit = 50, post_id } = req.query;
            skip = Number(skip);
            limit = Number(limit);
            let response = await postModel.findPostGroupCompleted({ _id, skip, limit, post_id });
            let result = [];
            for (const item of response) {
                item.likeCount = item?.likes?.length ?? 0;
                let likes = item.likes?.map(i => i.toString()) ?? [];
                if (likes?.includes(_id)) {
                    item.likes = true;
                }
                else {
                    item.likes = false;
                }
                item.created_by = await postModel.findUserDetails({ _id: item?.created_by });
                if (item.second_line_details.created_by) item.second_line_details.created_by = await postModel.findUserDetails({ _id: item?.second_line_details?.created_by });
                if (item.third_line_details.created_by) item.third_line_details.created_by = await postModel.findUserDetails({ _id: item?.third_line_details?.created_by });
                result.push(item);
            }
            return res.status(200).json({ message: "done", result });
        } catch (error) {
            return res.status(401).json({ message: "Some Error Occurred", error: error.message });
        }
    }

    async findPostGroupCompletedNew(req, res) {
        try {
            let { _id, } = req.decoded;
            let { skip = 0, limit = 50, post_id } = req.query;
            skip = Number(skip);
            limit = Number(limit);
            let response = await postModel.findPostGroupCompletedNew({ _id, skip, limit, post_id });
            return res.status(200).json({ message: "done", data: response, data_length: response.length });
        } catch (error) {
            return res.status(401).json({ message: "Some Error Occurred", error: error.message });
        }
    }

    async groupPostSkip(req, res) {
        try {
            let { _id } = req.decoded;
            let { _id: post_id } = req.query;
            await postModel.skipsGroupPost(post_id, _id);
            return res.status(200).json({ message: "done", });
        } catch (error) {
            return res.status(401).json({ message: "Some Error Occurred", error: error.message });
        }
    }

    async getImage(req, res) {
        try {
            return res.status(200).json({ data: constImage.imageArray });
        } catch (error) {
            return res.status(401).json({ message: "Some Error Occurred", error: error.message });
        }
    }

    async getLikeOnPostByIdGroup(req, res) {
        try {
            let { _id: post_id } = req.query;
            let [post_data] = await postModel.findGroupPostById(post_id);
            if (!post_data) return res.status(200).json({ data: [], message: "No post found" });
            let result = [];
            for (let ids of post_data.likes) {
                result.push(await postModel.findUserDetails({ _id: ids }));
            }
            post_data.likes = result;
            return res.status(200).json({ data: post_data, message: "Data found" });
        } catch (error) {
            return res.status(401).json({ message: "Some Error Occurred", error: error.message });
        }
    }

    async getGroupPostCreatedByMe(req, res) {
        try {
            let { _id } = req.decoded;
            // _id = "64b60044be51bf1648d51a23";
            let { skip = 0, limit = 10, user_id } = req.query;
            if (user_id && user_id !== "null") _id = user_id;
            limit = 25;
            let response = await postModel.getCompletePostByUserId({ _id, skip: +skip, limit: +limit });
            let result = [];
            for (const item of response) {
                item.likeCount = item?.likes?.length ?? 0;
                let likes = item.likes?.map(i => i.toString()) ?? [];
                if (likes?.includes(_id)) {
                    item.likes = true;
                }
                else {
                    item.likes = false;
                }
                item.created_by = await postModel.findUserDetails({ _id: item?.created_by });
                if (item.second_line_details.created_by) item.second_line_details.created_by = await postModel.findUserDetails({ _id: item?.second_line_details?.created_by });
                if (item.third_line_details.created_by) item.third_line_details.created_by = await postModel.findUserDetails({ _id: item?.third_line_details?.created_by });
                result.push(item);
            }
            return res.status(200).json({ message: "Data Found", error: null, result });
        } catch (error) {
            return res.status(401).json({ message: "Some Error Occurred", error: error.message });
        }
    }

    async getGroupPostCreatedByMeNew(req, res) {
        try {
            let { _id } = req.decoded;
            let { _id: user_id_filter } = req.decoded;
            // _id = "64b60044be51bf1648d51a23";
            let { skip = 0, limit = 10, user_id } = req.query;
            if (user_id && user_id !== "null") _id = user_id;
            limit = 50;
            let response = await postModel.getCompletePostByUserIdNew({ _id, skip: +skip, limit: +limit, user_id_filter });
            return res.status(200).json({ message: "Data Found", error: null, data: response });
        } catch (error) {
            return res.status(401).json({ message: "Some Error Occurred", error: error.message });
        }
    }

    async getGroupPostCommentById(req, res, next) {
        try {
            let { _id } = req.query;
            let postData = await postModel.getPostCommentById(_id);

            for (let comment of postData.comment) {
                comment.initial_user_id = await postModel.findUserDetails({ _id: comment?.initial_user_id });
                for (let reply of comment.reply) {
                    reply.reply_user_id = await postModel.findUserDetails({ _id: reply?.reply_user_id });
                }
            }
            return res.status(200).json({ message: "Data Found", error: null, data: postData });
        } catch (error) {
            return res.status(401).json({ message: "Some Error Occurred", error: error.message });
        }
    }

}

module.exports = new postController;


const sendNotification = async ({ type, post_id, user_data }) => {
    let postData = await postModel.getCompletePostByPostId(post_id);
    let _ids = [
        postData.second_line_details.created_by,
        postData.third_line_details.created_by,
        postData.created_by
    ]
    let getUserNotificationToken = await postModel.getUserNotificationToken({ _ids });
    getUserNotificationToken = _.pluck(getUserNotificationToken, "token")
    postData = JSON.parse(JSON.stringify(postData));
    let notification = {
        title: `${user_data?.full_name} like your post`,
        body: `${user_data?.full_name} like "${postData.first_line} ${postData.second_line} ${postData.third_line}"`,
    };

    if (user_data.personalImage.pI1) notification.imageUrl = user_data.personalImage.pI1;

    await postModel.createNotificationData({ post_id, to_user_id: _ids, title: notification?.title, body: notification?.body, from_user_id: user_data?._id })

    // return await firebaseAdmin.messaging().sendMulticast({
    //     tokens: getUserNotificationToken,
    //     notification: notification,
    // });
}