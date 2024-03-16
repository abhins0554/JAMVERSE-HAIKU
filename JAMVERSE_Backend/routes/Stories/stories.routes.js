'use strict';
if (process.env.IS_DEBUGGING) console.log(__filename);

const router = require('express').Router();
const storiesController = require('./stories.controller');

const loadImageToBuffer = require('../../middleware/fileupload.middleware');

class Routes {
    constructor() {
        this.myRoutes = router;
        this.core();
    }

    core() {
        // Adding all the routes here
        this.myRoutes.post('/add-story', loadImageToBuffer.array("storyImage"), storiesController.addStory);
        this.myRoutes.post('/add-story-view', storiesController.addStoryView);
        this.myRoutes.get("/get-all-stories", storiesController.getStories);
    }

    getRouters() {
        return this.myRoutes;
    }
}

module.exports = Routes;