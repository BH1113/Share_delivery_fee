const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.nick);
    });
    
    passport.deserializeUser((nick, done) => {
        User.findOne({ where: { nick }})
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local();
};