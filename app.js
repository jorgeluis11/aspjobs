const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes = require('./routes/index');
const users = require('./routes/users');
const jobs = require('./routes/jobs');
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/aspjobs');

let app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

class Server {

    constructor() {
        this.config();
        this.routeConfig();
        this.errorConfig();
    }

    config() {
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(cookieParser());
        app.use(require('node-sass-middleware')({
            src: path.join(__dirname, 'public'),
            dest: path.join(__dirname, 'public'),
            indentedSyntax: true,
            sourceMap: true
        }));
        app.use(express.static(path.join(__dirname, 'public')));
    }

    routeConfig() {
        app.use('/', routes);
        app.use('/users', users);
        app.use('/job', jobs);

        app.use((req, res, next) => {
            let err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
    }

    errorConfig() {
        if (app.get('env') === 'development') {
            app.use((err, req, res, next) => {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        app.use((err, req, res, next) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    }

    static bootstrap() {
        return new Server();
    }
}

Server.bootstrap();

module.exports = app;
