const userSchema = require("../../schema/users.schema");
const followers = require('../../constants/followers')
const mongoose = require('mongoose');
class followerstModel {

  async userfindByIdAndUpdateQuery(userId, filter) {
    let data = {}
    await userSchema.findByIdAndUpdate(userId, filter, { new: true })
      .then((result) => {
        data = { result: true, value: result }
      })
      .catch((error) => {
        data = { result: false, error: error.message }
      });
    return data
  }
  async userFindOneQuery(filter) {
    let data = {}
    await userSchema.findOne(filter)
      .then((result) => {
        data = { result: true, value: result }
      })
      .catch((error) => {
        data = { result: false, error: error.message }
      });
    return data
  }
  async userFindQuery(filter, projection, options) {
    let data = {}
    await userSchema.find(filter, projection, options)
      .then((result) => {
        data = { result: true, value: result }
      })
      .catch((error) => {
        data = { result: false, error: error.message }
      });
    return data
  }
  async add_remove_Follower(follower, following, type) {
    let [isFollowingFilter, isFollowerFilter] = [{}, {}]
    if (type == followers.TYPE_FOLLOW) {
      isFollowingFilter = { $push: { following: following } }
      isFollowerFilter = { $push: { followers: follower } }
    }
    if (type == followers.TYPE_UNFOLLOW) {
      isFollowingFilter = { $pull: { following: following } }
      isFollowerFilter = { $pull: { followers: follower } }
    }
    const _following = async () => {
      let data = await this.userfindByIdAndUpdateQuery(follower, isFollowingFilter)
      if (data.result) {
        return { result: true, value: data.value }
      }
      else {
        return { result: false, error: data.error }
      }
    };
    const _follower = async () => {
      let data = await this.userfindByIdAndUpdateQuery(following, isFollowerFilter)
      if (data.result) {
        return { result: true, value: data.value }
      }
      else {
        return { result: false, error: data.error }
      }
    };

    let isFollowing = await _following()
    let isFollower = await _follower()

    if (isFollowing && isFollower && isFollowing.result && isFollower.result) {
      return { result: true, value: 'Success' }
    }
    else {
      return { result: false, error: "Internal Server Error" }
    }
  }
  async isUserAllowedToFollowOrUnFollow(follower, following, type) {
    const _following = async () => {
      let filter = { _id: follower, following: { _id: following } }
      let data = await this.userFindOneQuery(filter)
      if (data && data.result) {
        if (data.value) {
          return { result: true, value: false }
        }
        else {
          return { result: true, value: true }
        }
      }
      else {
        return { result: false, error: data.error }
      }
    };
    const _follower = async () => {
      let filter = { _id: following, followers: { _id:follower } }
      let data = await this.userFindOneQuery(filter)
      if (data && data.result) {
        if (data.value) {
          return { result: true, value: false }
        }
        else {
          return { result: true, value: true }
        }
      }
      else {
        return { result: false, error: data.error }
      }
    };

    let isFollowing = await _following()
    let isFollower = await _follower()
    if (isFollowing && isFollower && isFollowing.result && isFollower.result) {
      if (type == followers.TYPE_FOLLOW) {
        if (isFollowing.value && isFollower.value) {
          return { result: true, value: true }
        }
        else {
          return { result: true, value: false }
        }
      }
      if (type == followers.TYPE_UNFOLLOW) {
        if (isFollowing.value && isFollower.value) {
          return { result: true, value: false }
        }
        else {
          return { result: true, value: true }
        }
      }
    }
    else {
      return { result: false, error: "Internal Server Error" }
    }
  }

  async get_all_followers_and_following(userId) {
    let filter = {_id: userId, isBlocked: false, isDeleted: false}
    let projection = {followers: true, following: true}
    
    try{
      let data = await userSchema.find(filter, projection)
      .populate({ path: 'followers', select: 'full_name personalImage' })
      .populate({ path: 'following', select: 'full_name personalImage' })
      .exec()
      return {result: true, value: data }
    }
    catch(error){
      return {result: false, value: error.message }
    }
  }
}

module.exports = new followerstModel;