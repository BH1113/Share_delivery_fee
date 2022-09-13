const express = require('express');
const path = require('path');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');

const { User, Food } = require('../models');
const Room = require('../schemas/room');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.patch('/:id', isLoggedIn, async function(req, res, next) {
    try{
        const $food = await Room.findOne({ _id: req.params.id }); 
        const $userId = await User.findOne({ where: {nick: req.session.passport.user} });
        if ($food.food == 'chicken' ){
            const result = await Food.increment({
                chicken: 1,
            }, { where: { userId: $userId.id } });
        }else if($food.food == 'pigfoot') {
            const result = await Food.increment({
                pigfoot: 1,
            }, { where: { userId: $userId.id } });
        }else if($food.food == 'chFood') {
            const result = await Food.increment({
                chFood: 1,
            }, { where: { userId: $userId.id } });
        }else if($food.food == 'korean') {
            const result = await Food.increment({
                korean: 1,
            }, { where: { userId: $userId.id } });
        }else if($food.food == 'pizza') {
            const result = await Food.increment({
                pizza: 1,
            }, { where: { userId: $userId.id } });
        }else if($food.food == 'nightFood') {
            const result = await Food.increment({
                nightFood: 1,
            }, { where: { userId: $userId.id } });
        }else if($food.food == 'bunsik') {
            const result = await Food.increment({
                bunsik: 1,
            }, { where: { userId: $userId.id } });
        }else if($food.food == 'cafe') {
            const result = await Food.increment({
                cafe: 1,
            }, { where: { userId: $userId.id } });
        }else if($food.food == 'asian') {
            const result = await Food.increment({
                asian: 1,
            }, { where: { userId: $userId.id } });
        }else if($food.food == 'donggas') {
            const result = await Food.increment({
                donggas: 1,
            }, { where: { userId: $userId.id } });
        }else if($food.food == 'dosilak') {
            const result = await Food.increment({
                dosilak: 1,
            }, { where: { userId: $userId.id } });
        }else if($food.food == 'bugger') {
            const result = await Food.increment({
                bugger: 1,
            }, { where: { userId: $userId.id } });
        }
    } catch(err){
        console.log(err);
        next(err);
    }
});
router.patch('/chat/:id', async function(req, res, next) {
    try{
        const { size } = req.body;
        await Room.updateOne({ _id: req.params.id }, { $set: { members: size }});
    } catch(err){
        console.log(err);
        next(err);
    }
});


module.exports = router;
