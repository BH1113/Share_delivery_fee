const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'nick',
        passwordField: 'password',
    }, async (nick, password, done) => {
        try{
            const exUesr = await User.findOne({ where: { nick } });
            if (exUesr) {
                const result = await bcrypt.compare(password, exUesr.password);
                if (result) {
                    done(null, exUesr);
                } else{
                    done(null, false, { message: '아이디 혹은 비밀번호를 확인하세요.' });
                }
            } else {
                done(null, false, { message: '아이디 혹은 비밀번호를 확인하세요.' });
            }
        } catch(error) {
            console.error(error);
            done(error);
        }
    }));
};