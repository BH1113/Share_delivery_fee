const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const axios = require('axios');

const Chat = require('../schemas/chat');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();


router.post('/chat/:id/img', isLoggedIn, upload.single('img'), async (req, res, next) => {
    try {
        console.log(req.file)
        const chat = await Chat.create({
            room: req.params.id,
            user: req.user.nick,
            gif: req.file.filename,
        });
        req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
        res.send('ok');
    } catch(error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;