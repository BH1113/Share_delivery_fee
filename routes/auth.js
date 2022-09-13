const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User, Food }  = require('../models');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { nick, password } = req.body;
    try{
        const exUser = await User.findOne({ where: {nick} });
        if (exUser) {
            return res.redirect('/join/?error=아이디 혹은 비밀번호를 확인하세요.');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            nick,
            password: hash,
        });
        const $userId = await User.findOne({ where: { nick }});
        await Food.create({
            userId: $userId.id,
        });
        return res.redirect('/login');
    } catch(error) {
        console.error(error);
        return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/login/?error=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            req.session.userid = req.body.nick;
            return res.redirect('/main');
        });
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/main');
});

module.exports = router;