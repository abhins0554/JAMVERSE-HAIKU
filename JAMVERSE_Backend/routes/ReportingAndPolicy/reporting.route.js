'use strict';
if (process.env.IS_DEBUGGING) console.log(__filename);

const router = require('express').Router();
const reportingController = require('./reporting.controller');

class Routes {
    constructor() {
        this.myRoutes = router;
        this.core();
    }

    core() {
        // Adding all the routes here
        this.myRoutes.post('/add-report', reportingController.addReport);
        this.myRoutes.post('/request-info', reportingController.requestInformation);
    }

    getRouters() {
        return this.myRoutes;
    }
}

module.exports = Routes;