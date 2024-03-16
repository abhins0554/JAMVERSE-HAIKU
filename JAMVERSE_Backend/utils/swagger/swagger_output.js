const swaggerPath = require("./swagger_path");

const swaggerData = {
    "swagger": "2.0",
    "info": {
        "version": "3.0.1",
        "title": "Api Documentation ",
        "description": "Detailed V3 Api documentaion",
        "license": {
            "name": "MIT",
            "url": "https://opensource.org/licenses/MIT"
        },
        "contact": {
            "email": ""
        }
    },
    "host": process.env.APP_URL,
    "basePath": "/api",
    "schemes": [
        "http",
        "https"
    ],
    "paths": swaggerPath,
    "tags": [{ "name": "Open" }, { "name": "Auth" }, { "name": "Post" }, { "name": "Setting" }, { "name": "Stories" }],
    "securityDefinitions": {
        "authenticate": {
            "type": "apiKey",
            "in": "header",
            "name": "Authorization",
            "description": "Please provide the valid access token, if you dont have please login and get the token as response!"
        }
    }
}


module.exports = swaggerData;
