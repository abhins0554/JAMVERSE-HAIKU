'use strict';
if (process.env.IS_DEBUGGING) console.log(__filename);

const router = require('express').Router();
const followersController = require('./followers.controller');

class Routes {
    constructor() {
        this.myRoutes = router;
        this.core();
    }

    core() {
        // Adding all the routes here
        this.myRoutes.post('/follow', followersController.follow);
        this.myRoutes.post('/unfollow', followersController.unFollow);
        this.myRoutes.get('/followersandfollowinglist', followersController.getAllFollowersAndFollowing);
    }

    getRouters() {
        return this.myRoutes;
    }
}

module.exports = Routes;