'use strict';
if (process.env.IS_DEBUGGING) console.log(__filename);

const router = require('express').Router();
const settingController = require('./setting.controller');

class Routes {
    constructor() {
        this.myRoutes = router;
        this.core();
    }

    core() {
        // Adding all the routes here
        this.myRoutes.post('/change_password', settingController.changePassword);
        this.myRoutes.get("/get-me", settingController.getMe);
        this.myRoutes.get("/check-notification", settingController.checkNotificationStatus);
        this.myRoutes.post("/update-notification", settingController.updatedNotification);
    }

    getRouters() {
        return this.myRoutes;
    }
}

module.exports = Routes;