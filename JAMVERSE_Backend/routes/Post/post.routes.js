'use strict';
if (process.env.IS_DEBUGGING) console.log(__filename);

const router = require('express').Router();
const postController = require('./post.controller');

class Routes {
    constructor() {
        this.myRoutes = router;
        this.core();
    }

    core() {
        // Adding all the routes here
        this.myRoutes.post('/create_post', postController.createPost);
        this.myRoutes.get('/get_post', postController.getPost);
        this.myRoutes.post('/add-like-unlike', postController.likeUnlike);
        this.myRoutes.post('/add-comment', postController.addComment);
        this.myRoutes.post('/save-post', postController.savePost);
        this.myRoutes.post("/create_post_group", postController.createPostGroup);
        this.myRoutes.get("/find_post_group-semi-completed", postController.findPostGroupSemiCompleted);
        this.myRoutes.get("/find_post_group-semi-completed-new", postController.findPostGroupSemiCompletedNew);
        this.myRoutes.get("/find_post_group-completed", postController.findPostGroupCompleted);
        this.myRoutes.get("/find_post_group-completed-new", postController.findPostGroupCompletedNew);
        this.myRoutes.get("/group-post-skip", postController.groupPostSkip);
        this.myRoutes.get("/get-image", postController.getImage);
        this.myRoutes.get("/get-likes-post-group", postController.getLikeOnPostByIdGroup);
        this.myRoutes.get("/get-group-post-created-by-me", postController.getGroupPostCreatedByMe);
        this.myRoutes.get("/get-group-post-created-by-me-new", postController.getGroupPostCreatedByMeNew);
        this.myRoutes.get("/get-group-post-comment-by-id", postController.getGroupPostCommentById);
    }

    getRouters() {
        return this.myRoutes;
    }
}

module.exports = Routes;