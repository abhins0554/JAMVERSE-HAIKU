const followersModel = require("./followers.model");
const userModel = require("../Auth/auth.model");
const { CloudHSM } = require("aws-sdk");
const followers = require('../../constants/followers')

class followersController {
    async follow(req, res) {
        try {
            const {_id: follower} = req.decoded;
            const { following } = req.body
            const followerValdation = new Promise((resolve, reject) => {
                userModel.validateUser(follower)
                .then((result) => {
                    resolve(result)
                })
                .catch((error) => {
                    reject(error)
                });
            });

            const followingValdation = new Promise((resolve, reject) => {
                userModel.validateUser(following)
                .then((result) => {
                    resolve(result)
                })
                .catch((error) => {
                    reject(error)
                });
            });

            Promise.all([followingValdation, followerValdation])
            .then(async(values) => {
                let isAllowed = await followersModel.isUserAllowedToFollowOrUnFollow(follower, following, followers.TYPE_FOLLOW)
                if(isAllowed.result){
                    if(isAllowed.value){
                        let follow = await followersModel.add_remove_Follower(follower, following, followers.TYPE_FOLLOW)
                        if (follow.result){
                            return res.status(200).send({ message: "Success" });
                        }
                        else{
                            return res.status(500).send({ error: "Internal Server Error" })
                        }
                    }
                    else{
                        return res.status(400).send({ error: "Already following." })
                    }
                }
                else{
                    return res.status(500).send({ error: "Internal Server Error" })
                }
            })
            .catch ((error) => {
                return res.status(400).send({ error: "User doesn't exist.", message: error.message })
            })
        }
        catch (err) {
            return res.status(400).send({ error: "Error", message: err.message })
        }
    }

    async unFollow(req, res) {
        try {
            const {_id: follower} = req.decoded;
            const { following } = req.body
            const followerValdation = new Promise((resolve, reject) => {
                userModel.validateUser(follower)
                .then((result) => {
                    resolve(result)
                })
                .catch((error) => {
                    reject(error)
                });
            });

            const followingValdation = new Promise((resolve, reject) => {
                userModel.validateUser(following)
                .then((result) => {
                    resolve(result)
                })
                .catch((error) => {
                    reject(error)
                });
            });

            Promise.all([followingValdation, followerValdation])
            .then(async(values) => {
                let isAllowed = await followersModel.isUserAllowedToFollowOrUnFollow(follower, following, followers.TYPE_UNFOLLOW)
                if(isAllowed.result){
                    if(isAllowed.value){
                        let unfollow = await followersModel.add_remove_Follower(follower, following, followers.TYPE_UNFOLLOW)
                        if (unfollow.result){
                            return res.status(200).send({ message: "Success" });
                        }
                        else{
                            return res.status(500).send({ error: "Internal Server Error" })
                        }
                    }
                    else{
                        return res.status(400).send({ error: "Not following." })
                    }
                }
                else{
                    return res.status(500).send({ error: "Internal Server Error" })
                }
            })
            .catch ((error) => {
                return res.status(400).send({ error: "User doesn't exist.", message: error.message })
            })
        }
        catch (err) {
            return res.status(400).send({ error: "Error", message: err.message })
        }
    }

    async getAllFollowersAndFollowing(req, res) {
        try {
            const {_id: userId} = req.decoded;
            let data = await followersModel.get_all_followers_and_following(userId)
            if(data && data.result){
                return res.status(200).send({ message: "Success", data: data.value });
            }
            else{
                return res.status(400).send({ message: "sg", data: data.value });
            }
        }
        catch (err) {
            return res.status(400).send({ error: "Error", message: err.message })
        }
    }
}

module.exports = new followersController;