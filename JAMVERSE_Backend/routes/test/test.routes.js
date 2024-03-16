'use strict';
if (process.env.IS_DEBUGGING) console.log(__filename);

const router = require('express').Router();
const storiesController = require('./test.controller');


class Routes {
    constructor() {
        this.myRoutes = router;
        this.core();
    }

    core() {
        // Adding all the routes here
        this.myRoutes.get("/resume", storiesController.getParser);
    }

    getRouters() {
        return this.myRoutes;
    }
}

module.exports = Routes;