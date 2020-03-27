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
        res.status(200).json({ users: data });
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
    const log = new Log({
        userId: req.body.userId,
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date || new Date()
    });
    log.save((err, data) => {
        if (err) throw new Error(err.message);
        res.status(201).json(data);
    });
});

/**
 * GET - get all logs
 * GET users's exercise log: GET /api/exercise/log?{userId}[&from][&to][&limit]
 * { } = required, [ ] = optional
 * from, to = dates (yyyy-mm-dd); limit = number
 */
routes.get('/log', (req, res) => {
    if (req.query.userId === undefined) throw new Error('userId required!');

    // filters
    const query = {
        userId: req.query.userId
    };

    if (req.query.from !== undefined || req.query.to !== undefined) {
        query.date = {};

        if (req.query.from !== undefined) {
            let from = new Date(req.query.from);
            console.log(from);
            query.date.$gte = from;
        }

        if (req.query.to !== undefined) {
            let to = new Date(req.query.to);
            console.log(to);
            query.date.$lte = to;
        }
    }

    console.log(query);

    if (req.query.limit !== undefined) {
        let limit = parseInt(req.query.limit);
        Log.find(query, (err, data) => {
            if (err) throw new Error(err.message);
            res.status(200).json(data);
        }).limit(limit);
    } else {
        Log.find(query, (err, data) => {
            if (err) throw new Error(err.message);
            res.status(200).json(data);
        });
    }
});

module.exports = routes;
