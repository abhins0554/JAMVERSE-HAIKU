const securityObject = [
    {
        authenticate: [],
    },
];

const responseObject = {
    200: { description: 'Success response with data' },
    400: { description: 'Bad Request with error data' },
    401: { description: 'Unauthorized' },
    404: { description: 'Not found with error data' },
    500: { description: 'Server is down' },
};


const path = {
    "/": {
        "get": {
            "tags": ['Open'],
            "description": "",
            "parameters": [],
            "responses": responseObject
        }
    },
    "/*": {
        "get": {
            "tags": ['Open'],
            "description": "",
            "parameters": [],
            "responses": responseObject
        }
    },
    "/auth/login": {
        "post": {
            "tags": ['Auth'],
            "description": "",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "email": {
                                "type": "string",
                                "example": "abhi@mail.com"
                            },
                            "password": {
                                "type": "string",
                                "example": "123456"
                            },
                            "ip": {
                                "type": "string",
                                "example": "49.36.16.0"
                            }
                        }
                    }
                }
            ],
            "responses": responseObject
        }
    },
    "/auth/signup": {
        "post": {
            "tags": ['Auth'],
            "description": "",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "email": {
                                "example": "any"
                            },
                            "password": {
                                "example": "any"
                            },
                            "full_name": {
                                "example": "any"
                            },
                            "user_name": {
                                "example": "any"
                            },
                            "mobile": {
                                "example": "any"
                            },
                            "login_type": {
                                "example": "any"
                            },
                            "ip": {
                                "example": "any"
                            }
                        }
                    }
                }
            ],
            "responses": responseObject
        }
    },
    "/auth/forgot-password": {
        "get": {
            "tags": ['Auth'],
            "description": "",
            "parameters": [{
                in: "query",
                name: "email",
                example: "abhins.0554@gmail.com"
            }],
            "responses": responseObject
        }
    },
    "/auth/validate-otp-password": {
        "get": {
            "tags": ['Auth'],
            "description": "",
            "parameters": [{
                in: "query",
                name: "email",
                example: "abhins.0554@gmail.com"
            },
            {
                in: "query",
                name: "otp",
                example: "abhins.0554@gmail.com"
            },
            {
                in: "query",
                name: "password",
                example: "123456"
            }],
            "responses": responseObject
        }
    },
    "/post/create_post": {
        "post": {
            "tags": ['Post'],
            "description": "",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "font_size": {
                                "example": "any"
                            },
                            "color": {
                                "example": "any"
                            },
                            "alignment": {
                                "example": "any"
                            },
                            "letter_spacing": {
                                "example": "any"
                            },
                            "font_family": {
                                "example": "any"
                            },
                            "bg_type": {
                                "example": "any"
                            },
                            "bg_info": {
                                "example": "any"
                            },
                            "text": {
                                "example": "any"
                            }
                        }
                    }
                }
            ],
            "responses": responseObject,
            "security": securityObject
        }
    },
    "/post/create_post_group": {
        "post": {
            "tags": ['Post'],
            "description": "",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "line": {
                                "example": 1
                            },
                            "text": {
                                "example": "A darker night"
                            },
                            "post_id": {
                                "example": "63c45f2d46cdeabe307b0358"
                            },
                            "font_family": {
                                "example": "Robot"
                            },
                            "color": {
                                "example": "#FFFFFF"
                            },
                            "bg_info": {
                                "example": "https://imgv3.fotor.com/images/blog-richtext-image/part-blurry-image.jpg"
                            }
                        }
                    }
                }
            ],
            "responses": responseObject,
            "security": securityObject
        }
    },
    "/post/find_post_group-semi-completed": {
        "get": {
            "tags": ['Post'],
            "description": "",
            "parameters": [
                {
                    "name": "page",
                    "in": "query",
                    "type": "string"
                }
            ],
            "responses": responseObject,
            "security": securityObject
        }
    },
    "/post/group-post-skip": {
        "get": {
            "tags": ['Post'],
            "description": "",
            "parameters": [
                {
                    "name": "_id",
                    "in": "query",
                    "type": "string"
                }
            ],
            "responses": responseObject,
            "security": securityObject
        }
    },
    "/post/get-image": {
        "get": {
            "tags": ['Post'],
            "description": "",
            "parameters": [
            ],
            "responses": responseObject,
            "security": securityObject
        }
    },
    "/post/get-likes-post-group": {
        "get": {
            "tags": ['Post'],
            "description": "",
            "parameters": [
                {
                    "name": "_id",
                    "in": "query",
                    "type": "string"
                }
            ],
            "responses": responseObject,
            "security": securityObject
        }
    },
    "/post/find_post_group-completed": {
        "get": {
            "tags": ['Post'],
            "description": "",
            "parameters": [
                {
                    "name": "skip",
                    "in": "query",
                    "type": "string"
                },
                {
                    "name": "limit",
                    "in": "query",
                    "type": "string"
                }
            ],
            "responses": responseObject,
            "security": securityObject
        }
    },
    "/post/get_post": {
        "get": {
            "tags": ['Post'],
            "description": "",
            "parameters": [
                {
                    "name": "skip",
                    "in": "query",
                    "type": "string"
                },
                {
                    "name": "limit",
                    "in": "query",
                    "type": "string"
                }
            ],
            "responses": responseObject,
            "security": securityObject
        }
    },
    "/post/add-like-unlike": {
        "post": {
            "tags": ['Post'],
            "description": "",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "post_id": {
                                "example": "63c45f2d46cdeabe307b0358"
                            },
                            "type": {
                                "example": "like"
                            },
                            "post_type": {
                                "example": "group"
                            }
                        }
                    }
                }
            ],
            "responses": responseObject,
            "security": securityObject
        }
    },
    "/post/add-comment": {
        "post": {
            "tags": ['Post'],
            "description": "",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "post_id": {
                                "example": "any"
                            },
                            "text": {
                                "example": "any"
                            }
                        }
                    }
                }
            ],
            "responses": responseObject,
            "security": securityObject
        }
    },
    "/post/save-post": {
        "post": {
            "tags": ['Post'],
            "description": "",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "post_id": {
                                "example": "any"
                            },
                            "type": {
                                "example": "any"
                            }
                        }
                    }
                }
            ],
            "responses": responseObject,
            "security": securityObject
        }
    },
    "/post/get-group-post-created-by-me": {
        "get": {
            "tags": ['Post'],
            "description": "",
            "parameters": [
            ],
            "responses": responseObject,
            "security": securityObject
        }
    },
    "/post/get-group-post-comment-by-id": {
        "get": {
            "tags": ['Post'],
            "description": "",
            "parameters": [
                {
                    "name": "_id",
                    "in": "query",
                    "type": "string"
                },
            ],
            "responses": responseObject,
            "security": securityObject
        }
    },
    "/setting/change_password": {
        "post": {
            "tags": ['Setting'],
            "description": "",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "password": {
                                "example": "any"
                            },
                            "new_password": {
                                "example": "any"
                            }
                        }
                    }
                }
            ],
            "responses": responseObject,
            "security": securityObject
        }
    },
    "/setting/get-me": {
        "get": {
            "tags": ['Setting'],
            "description": "",
            "parameters": [
            ],
            "responses": responseObject,
            "security": securityObject
        }
    },
    "/stories/add-story": {
        "post": {
            "tags": ['Stories'],
            "description": "",
            "parameters": [],
            "responses": responseObject,
            "security": securityObject
        }
    },
    "/stories/add-story-view": {
        "post": {
            "tags": ['Stories'],
            "description": "",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "story_id": {
                                "example": "any"
                            }
                        }
                    }
                }
            ],
            "responses": responseObject,
            "security": securityObject
        }
    },
    "/stories/get-all-stories": {
        "get": {
            "tags": ['Stories'],
            "description": "",
            "parameters": [
                {
                    "name": "skip",
                    "in": "query",
                    "type": "number",
                    "example": 0
                },
                {
                    "name": "limit",
                    "in": "query",
                    "type": "number",
                    "example": 10
                }
            ],
            "responses": responseObject,
            "security": securityObject
        }
    },


    "/followers/follow": {
        "post": {
            "tags": ['Follow'],
            "description": "",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "following": {
                                "type": "string",
                                "example": "638dd3264adc71bb27b0a735"
                            }
                        }
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "OK"
                },
                "400": {
                    "description": "Bad Request"
                },
                "500": {
                    "description": "Internal Server Error"
                }
            },
            "security": securityObject
        }
    },
    "/followers/unfollow": {
        "post": {
            "tags": ['Follow'],
            "description": "",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "following": {
                                "type": "string",
                                "example": "638dd3264adc71bb27b0a735"
                            }
                        }
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "OK"
                },
                "400": {
                    "description": "Bad Request"
                },
                "500": {
                    "description": "Internal Server Error"
                }
            },
            "security": securityObject
        }
    },
    "/followers/followersandfollowinglist": {
        "get": {
            "tags": ['Follow'],
            "description": "",
            "parameters": [],
            "responses": {
                "200": {
                    "description": "OK"
                },
                "400": {
                    "description": "Bad Request"
                }
            },
            "security": securityObject
        }
    },
    "/profile/update-profile-image": {
        "post": {
            "tags": ['Profile'],
            "description": "",
            "parameters": [],
            "responses": {
                "200": {
                    "description": "OK"
                },
                "401": {
                    "description": "Unauthorized"
                }
            },
            "security": securityObject
        }
    },
    "/profile/update-profile-detail": {
        "post": {
            "tags": ['Profile'],
            "description": "",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "about": {
                                "example": "any"
                            },
                            "full_name": {
                                "example": "any"
                            }
                        }
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "OK"
                },
                "401": {
                    "description": "Unauthorized"
                }
            },
            "security": securityObject
        }
    },
    "/profile/search-users": {
        "get": {
            "tags": ['Profile'],
            "description": "",
            "parameters": [
                {
                    "name": "search",
                    "in": "query",
                    "type": "string"
                },
                {
                    "name": "skip",
                    "in": "query",
                    "type": "string"
                },
                {
                    "name": "limit",
                    "in": "query",
                    "type": "string"
                }
            ],
            "responses": {
                "200": {
                    "description": "OK"
                },
                "401": {
                    "description": "Unauthorized"
                }
            },
            "security": securityObject
        }
    },
    "/profile/search-users-profile-by-id": {
        "get": {
            "tags": ['Profile'],
            "description": "",
            "parameters": [
                {
                    "name": "_id",
                    "in": "query",
                    "type": "string"
                }
            ],
            "responses": {
                "200": {
                    "description": "OK"
                },
                "401": {
                    "description": "Unauthorized"
                }
            },
            "security": securityObject
        }
    },
    "/profile/get-user-saved-post": {
        "get": {
            "tags": ['Profile'],
            "description": "",
            "parameters": [],
            "responses": {
                "200": {
                    "description": "OK"
                },
                "401": {
                    "description": "Unauthorized"
                }
            },
            "security": securityObject
        }
    },
    "/profile/get-user-suggestion": {
        "get": {
            "tags": ['Profile'],
            "description": "",
            "parameters": [
                {
                    "name": "skip",
                    "in": "query",
                    "type": "number"
                },
                {
                    "name": "limit",
                    "in": "query",
                    "type": "number"
                }
            ],
            "responses": {
                "200": {
                    "description": "OK"
                },
                "401": {
                    "description": "Unauthorized"
                }
            },
            "security": securityObject
        }
    },
    "/profile/add-comment-post": {
        "post": {
            "tags": ['Profile'],
            "description": "",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "text": {
                                "example": "any"
                            },
                            "comment_id": {
                                "example": "any"
                            },
                            "post_id": {
                                "example": "any"
                            }
                        }
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "OK"
                },
                "401": {
                    "description": "Unauthorized"
                }
            },
            "security": securityObject
        }
    },
    "/notification/send-notification": {
        "post": {
            "tags": ["Notification"],
            "description": "",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "title": {
                                "example": "any"
                            },
                            "description": {
                                "example": "any"
                            },
                            "image": {
                                "example": "any"
                            },
                            "tokensArray": {
                                "example": "any"
                            },
                        }
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "OK"
                },
                "401": {
                    "description": "Unauthorized"
                }
            },
            "security": securityObject
        }
    },
    "/notification/update-token": {
        "post": {
            "tags": ["Notification"],
            "description": "",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "token": {
                                "example": "any"
                            }
                        }
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "OK"
                },
                "401": {
                    "description": "Unauthorized"
                }
            },
            "security": securityObject
        }
    },
    "/notification/get-notification": {
        "get": {
            "tags": ["Notification"],
            "description": "",
            "parameters": [

            ],
            "responses": {
                "200": {
                    "description": "OK"
                },
                "401": {
                    "description": "Unauthorized"
                }
            },
            "security": securityObject
        }
    },


    "/report/add-report": {
        "post": {
            "tags": ["Report"],
            "description": "",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "post_id": {
                                "example": "any"
                            },
                            "name": {
                                "example": "any"
                            },
                            "id": {
                                "example": "any"
                            }
                        }
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "OK"
                }
            },
            "security": securityObject
        }
    },
    "/report/request-info": {
        "post": {
            "tags": ["Report"],
            "description": "",
            "parameters": [],
            "responses": {
                "200": {
                    "description": "OK"
                }
            },
            "security": securityObject
        }
    }
};


module.exports = path;