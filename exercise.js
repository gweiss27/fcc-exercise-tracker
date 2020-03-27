const routes = require('express').Router();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// user schema

const userSchema = new Schema({
    username: { type: String, required: true, unique: true }
});

const User = mongoose.model('User', userSchema);

// log schema

const logSchema = new Schema({
    userId: { type: Object, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, required: true }
});

const Log = mongoose.model('Log', logSchema);

/**
 * GET - healthcheck
 */
routes.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' });
});

/**
 * GET - get all users
 */
routes.get('/users', (req, res) => {
    User.find((err, data) => {
        if (err) throw new Error(err.message);
        let users = [];
        data.map(user => {
            users.push({ _id: user._id, username: user.username });
        });
        res.status(200).json(users);
    });
});

/**
 * POST - create a user
 */
routes.post('/new-user', (req, res) => {
    let user = new User({
        username: req.body.username
    });
    user.save((err, data) => {
        if (err) throw new Error(err.message);
        res.status(201).json({ _id: data._id, username: req.body.username });
    });
});

/**
 * POST - add a new exercise entry
 */
routes.post('/add', (req, res) => {
    User.findById(req.body.userId, (err, user) => {
        if (err) throw new Error(err.message);
        const log = new Log({
            userId: req.body.userId,
            description: req.body.description,
            duration: req.body.duration,
            date: req.body.date || new Date()
        });
        log.save((err, data) => {
            if (err) throw new Error(err.message);
            res.json({
                _id: user._id,
                username: user.username,
                description: data.description,
                duration: data.duration,
                date: data.date.toDateString()
            });
        });
    });
});

/**
 * GET - get all logs
 * GET users's exercise log: GET /api/exercise/log?{userId}[&from][&to][&limit]
 * { } = required, [ ] = optional
 * from, to = dates (yyyy-mm-dd); limit = number
 */
routes.get('/log', (req, res, next) => {
    if (req.query.userId === undefined) throw new Error('userId required!');

    User.findById(req.query.userId, (err, user) => {
        if (err) return next(err);

        // Validate userID:
        if (!user) {
            let err = new Error('unknown userId...');
            err.status = 400;
            return next(err);
        }

        // filters
        const query = {
            userId: req.query.userId
        };

        if (req.query.from !== undefined || req.query.to !== undefined) {
            query.date = {};

            if (req.query.from !== undefined) {
                query.date.$gte = new Date(req.query.from);
            }

            if (req.query.to !== undefined) {
                query.date.$lte = new Date(req.query.to);
            }
        }

        let logArray = [];
        const user_with_log = {
            _id: user._id,
            username: user.username,
            count: 0,
            log: []
        };

        let limit = parseInt(req.query.limit) || 0;
        Log.find(query, (err, data) => {
            if (err) throw new Error(err.message);
            data.map(log => {
                logArray.push({
                    description: log.description,
                    duration: log.duration,
                    date: log.date
                });
            });
            user_with_log.count = logArray.length;
            user_with_log.log = logArray;
            res.json(user_with_log);
        }).limit(limit);
    });
});

module.exports = routes;
