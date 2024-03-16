'use strict';
if (process.env.IS_DEBUGGING) console.log(__filename);

const router = require('express').Router();
const notificationController = require('./notification.controller');

class Routes {
    constructor() {
        this.myRoutes = router;
        this.core();
    }

    core() {
        // Adding all the routes here
        this.myRoutes.post('/send-notification',  notificationController.sendNotification);
        this.myRoutes.post('/update-token',  notificationController.updateToken);
        this.myRoutes.get('/get-notification',  notificationController.getNotification);
    }

    getRouters() {
        return this.myRoutes;
    }
}

module.exports = Routes;