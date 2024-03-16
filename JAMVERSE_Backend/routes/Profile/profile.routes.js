'use strict';
if (process.env.IS_DEBUGGING) console.log(__filename);

const router = require('express').Router();
const profileController = require('./profile.controller');

const loadImageToBuffer = require('../../middleware/fileupload.middleware');

class Routes {
    constructor() {
        this.myRoutes = router;
        this.core();
    }

    core() {
        // Adding all the routes here
        this.myRoutes.post('/update-profile-image', loadImageToBuffer.array("profileImage"),  profileController.updateProfile);
        this.myRoutes.post('/update-profile-detail',  profileController.updateAbout);
        this.myRoutes.get("/search-users", profileController.searchUsers);
        this.myRoutes.get("/search-users-profile-by-id", profileController.searchUsersProfileById);
        this.myRoutes.get("/get-user-saved-post", profileController.getUserSavedPost);
        this.myRoutes.get("/get-user-suggestion", profileController.getUserSuggestion);
        this.myRoutes.post("/add-comment-post", profileController.addCommentToPost);
    }

    getRouters() {
        return this.myRoutes;
    }
}

module.exports = Routes;