'use strict';
if (process.env.IS_DEBUGGING) console.log(__filename);

const util = require('util');
const exec = util.promisify(require('child_process').exec);

// unhandledRejection catch
require('express-async-errors');
require('dotenv').config()

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const open = require('open');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./utils/swagger/swagger_output')
const path = require('path');

const admin = require("firebase-admin");
const serviceAccount = require("./utils/firebase_config.json");

// const swaggerDocumentV3 = require('./utils/swagger/v3/swagger-json');

// const MySqlSingelton = require('./database/MySqlConnection');
const Logger = require('./logger/Logger').logger;
const fs = require('fs');
const fileStreamRotator = require('file-stream-rotator')
const logDir = __dirname + '/logger/responseLog';

const RoutesV3 = require('./routes/modules');
const errorHandler = require('./middleware/error');
const bodyParser = require('body-parser');

const cors = require("cors");



// Stream information for log name and frequency
let stream = fileStreamRotator.getStream({
    filename: path.join(logDir, '%DATE%-response.log'),
    frequency: 'daily',
    verbose: false,
    datePattern: 'YYYY-MM-DD',
    max_logs: "10d",
    size: "100M"
});

//For exception handling for runtime
process
    .on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection:', reason, p);
        Logger.error(`---unhandledRejection---${reason}---Unhandled Rejection at Promise--${p}---`);
    })
    .on('warning', (reason, p) => {
        Logger.error(`---warning---${reason}---warning message--${p}---`);
    })
    .on('uncaughtException', err => {
        console.log('Uncaught Exception:', err);
        Logger.error(`---uncaughtException---${err}---Uncaught Exception thrown---`);
        process.exit(1);
    });

class App {
    constructor() {
        // getting from process.env object, specified in .env file
        this.port = process.env.PORT;
        // express app initialization
        this.app = express();
        this.mongoConnection();
    }

    /**
     * core method
     * contains the basic logic of the perticular class
     * As per SOLID principle
     */
    core() {
        this.addRoutesAndMiddleWares(this.app);
        this.listenToPort(this.app, this.port);
    }

    addRoutesAndMiddleWares(app) {
        // app.use((req, res, next) => {
        //     const end = res.end;
        //     const onceUnhandledRejection = reason => errorHandler(reason, req, res);
        //     process.once('unhandledRejection', onceUnhandledRejection);
        //     res.end = (chunk, encoding) => {
        //         process.removeListener('unhandledRejection', onceUnhandledRejection);
        //         res.end = end;
        //         res.end(chunk, encoding);
        //     };
        //     next();
        // });

        // initializing body parser (bundled with express framework)
        // for reading req body
        app.use(express.json({ limit: '50mb' }), express.urlencoded({
            limit: '50mb',
            urlencoded: false,
            extended: true
        }));
        app.use(bodyParser.urlencoded({
            extended: true,
            limit: "2mb"
        }));
        app.use(bodyParser.json());
        app.use(cors());

        if (app.get('env') !== 'test') {
            // Logger - Logging request in console
            app.use(morgan('dev'));

            // app.use(morgan({
            //     format: "[:date] :method :url :status :response-time ms",
            //     stream: fs.createWriteStream('./access.log', { flags: 'a' })
            // }));
            app.use(morgan(':method :url :status :res[content-length] :response-time ms', {
                stream: stream
            }))
        }
        // Added security headers
        app.use(helmet());

        // handling DDOS attacks by stopeing req after specified time with specific req calls
        // app.use(new rateLimit({ windowMs: parseInt(process.env.RATE_LIMIT_DURATION) * 60 * 1000, max: parseInt(process.env.RATE_LIMIT_REQUEST_ALLOWED) }));

        // compressing res / req
        app.use(compression());

        // session management via cookies and in app storage
        app.use(cookieParser());
        app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: true
            }
        }));
        //Set response header
        app.use(function (req, res, next) {
            res.set({
                'compress': true,
                'Conenction': 'keep-alive',
                'Keep-Alive': 'timeout=300'
            });
            // const ipAddress = req.header('x-forwarded-for') ||  			
            // 			req.socket.remoteAddress;

            // Logger.info(`Ip Address Logs ${req.originalUrl} ${ipAddress}`);
            next();
        });

        // registering routes
        // adding swagger for the above routes
        // app.use('/api/v3/explorer', swaggerUi.serve, (...args) => swaggerUi.setup(swaggerDocumentV3)(...args));
        if (process.env.IS_SERVER != "true") app.use('/api/explore', swaggerUi.serve, swaggerUi.setup(swaggerFile))

        app.get("/hello", (req, res) => res.send("hello") );
        
        app.use('/api', new RoutesV3().getRouters());

        app.get('/', (req, res) => res.status(500).send())

        // default route handler
        // app.get('/', (req, res) => { res.redirect('/api/v3/explorer'); });


        app.use(errorHandler);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }

    mongoConnection() {
        const MongoDB = require('./database/MongoDBConnection');
        MongoDB.connect();
    }

    listenToPort(app, port) {
        // listen to certain port specified in .env file
        app.listen(port, () => console.log(`== Application started at ${port} ==`));
        // opening swagger UI on node server restart
        // open(`http://localhost:${port}/api/v1/explorer`);
    }
}

module.exports = App;
