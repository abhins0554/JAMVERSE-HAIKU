'use strict';
if (process.env.IS_DEBUGGING) console.log(__filename);

const router = require('express').Router();



const AuthRoutes = require('./Auth/auth.routes');
const AdminRouter = require('./Admin/admin.routes');
const PostRoutes = require('./Post/post.routes');
const SettingRoutes = require('./Setting/setting.routes');
const StoriesRoutes = require('./Stories/stories.routes')
const FollowersRoutes = require('./Followers/followers.routes')
const ProfileRoutes = require('./Profile/profile.routes')
const NotificationRoutes = require('./Notification/notification.routes')
const ReportRoutes = require('./ReportingAndPolicy/reporting.route');
// const TestRoutes = require('./test/test.routes')


const AuthMiddleware = require("../middleware/jwt.middleware");

const postGroupSchema = require("../schema/postGroup.schema");

class Modules {
    constructor() {
        this.modules = router;
        this.core();
    }

    core() {
        // Adding all the routes here

        this.modules.get("/", (req, res) => {
            return res.status(500).send(``);
        })

        this.modules.get('/blogs', async (req, res) => {
            try {
                let { skip = 0, limit = 10 } = req.query;
                let result = await postGroupSchema.aggregate(
                    [
                        {
                            '$match': {
                                '$and': [
                                    {
                                        'second_line_details.created_by': {
                                            '$exists': true
                                        }
                                    }, {
                                        'third_line_details.created_by': {
                                            '$exists': true
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            '$lookup': {
                                'from': 'users',
                                'localField': 'created_by',
                                'foreignField': '_id',
                                'as': 'first_user'
                            }
                        }, {
                            '$lookup': {
                                'from': 'users',
                                'localField': 'second_line_details.created_by',
                                'foreignField': '_id',
                                'as': 'second_user'
                            }
                        }, {
                            '$lookup': {
                                'from': 'users',
                                'localField': 'third_line_details.created_by',
                                'foreignField': '_id',
                                'as': 'third_user'
                            }
                        }, {
                            '$unwind': '$first_user'
                        }, {
                            '$unwind': '$second_user'
                        }, {
                            '$unwind': '$third_user'
                        }, {
                            '$sort': {
                                'createdAt': -1
                            }
                        }, {
                            '$project': {
                                '_id': 1,
                                'first_line_text': 1,
                                'title': 1,
                                'color': 1,
                                'second_line_details.second_line_text': 1,
                                'third_line_details.third_line_text': 1,
                                'first_user._id': 1,
                                'first_user.full_name': 1,
                                'first_user.personalImage': 1,
                                'second_user._id': 1,
                                'second_user.full_name': 1,
                                'second_user.personalImage': 1,
                                'third_user._id': 1,
                                'third_user.full_name': 1,
                                'third_user.personalImage': 1,
                                'like_count': {
                                    '$size': '$likes'
                                },
                                'comment_count': {
                                    '$size': '$comment'
                                }
                            }
                        },
                        { "$limit": +skip +  +limit },
                        { "$skip": +skip }
                    ]
                )
                return res.status(200).json({ result });
            } catch (error) {
                return res.status(400).json({ error });
            }
        })

        this.modules.use('/auth', new AuthRoutes().getRouters());
        this.modules.use('/admin', new AdminRouter().getRouters());

        // this.modules.use('/resume', new TestRoutes().getRouters());

        this.modules.use(AuthMiddleware.authenticate);

        this.modules.use('/post', new PostRoutes().getRouters());

        this.modules.use('/setting', new SettingRoutes().getRouters());

        this.modules.use('/stories', new StoriesRoutes().getRouters());

        this.modules.use('/followers', new FollowersRoutes().getRouters());

        this.modules.use('/profile', new ProfileRoutes().getRouters());

        this.modules.use('/notification', new NotificationRoutes().getRouters());

        this.modules.use('/report', new ReportRoutes().getRouters());


        this.modules.get('*', function (req, res) {
            res.json({
                code: 400,
                data: null,
                message: 'Not Found.',
                error: null
            });
        });
    }

    getRouters() {
        return this.modules;
    }
}

module.exports = Modules;
