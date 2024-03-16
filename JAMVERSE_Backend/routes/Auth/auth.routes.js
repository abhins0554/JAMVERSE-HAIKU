'use strict';
if (process.env.IS_DEBUGGING) console.log(__filename);

const router = require('express').Router();
const authController = require('./auth.controller');

const fileUpload = require("../../middleware/fileupload.middleware");

const admin = require("firebase-admin");

const authenticateFirebaseToken = async(req, res, next) => {
    try {
        const token = req.body.googleToken;
        if (token == null) {
            res.sendStatus(401);
            res.end();
            return;
        }

        admin
            .auth()
            .verifyIdToken(token.toString())
            .then((decodedIdToken) => {
                req.tokenObject = decodedIdToken?.uid;
                req.decoded = decodedIdToken;
                next();
            })
            .catch((error) => {
                res.sendStatus(403);
                res.end();
                return;
            });
    } catch (err) {
        res.sendStatus(500);
    }
}

class Routes {
    constructor() {
        this.myRoutes = router;
        this.core();
    }

    core() {
        // Adding all the routes here
        this.myRoutes.post('/login', authController.loginUser);
        this.myRoutes.post('/login-google', authenticateFirebaseToken, authController.loginUserGoogle);
        this.myRoutes.post('/signup', fileUpload.any('files'), authController.signInUser);
        this.myRoutes.post('/signup-google', authenticateFirebaseToken, authController.signInUserGoogle);
        this.myRoutes.get('/forgot-password', authController.forgotPassword);
        this.myRoutes.get('/validate-otp-password', authController.validateOtpPassword);
    }

    getRouters() {
        return this.myRoutes;
    }
}

module.exports = Routes;