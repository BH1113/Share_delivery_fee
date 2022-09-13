const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');
const { User, sequelize } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/', (req, res, next) => {
    res.render('intro');
});

router.get('/chat', isLoggedIn, (req, res, next) => {
    res.render('chat');
});

router.get('/main', (req, res, next) =>{
    res.render('main');
});

router.get('/createRoom', isLoggedIn, (req, res, next) => {
    res.render('createRoom');
});

router.get('/login', isNotLoggedIn, (req, res, next) => {
    res.render('login');
});

router.get('/join', isNotLoggedIn, (req, res, next) => {
    res.render('join');
});

router.post('/joinCheck', async (req, res, next) => {
    const { nick } = req.body;
    try{
        const user = await User.findOne({ 
            where: { nick }
        });
        
        if(user) {
            return res.send('error');
        } else{
            return res.send('success');
        }
    } catch(error) {
        console.error(error);
        return next(error);
    }
});

router.post('/createRoom', isLoggedIn, async (req, res, next) => {
    try{
        const newRoom = await Room.create({
            title: req.body.title,
            max: req.body.max,
            members: 1,
            food: req.body.food,
            owner: req.user.nick,
        });
        const io = req.app.get('io');
        io.of('/room').emit('newRoom', newRoom);
        res.redirect(`/room/${newRoom._id}`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/main/:id', async (req, res, next) => {
    try{
        const rooms = await Room.find({ food: req.params.id });
        res.render('room', { rooms, food: req.params.id });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/room/:id', isLoggedIn, async (req, res, next) => {
    try{
        const room = await Room.findOne({ _id: req.params.id });
        const io = req.app.get('io');
        if (!room) {
            return res.redirect(`/main/${room.food}/?error=존재하지 않는 방입니다.`);
        }
        const roomId = await req.params.id;
        const { rooms } = io.of('/chat').adapter;
        const member = rooms.get(roomId);
        if (rooms.has(roomId)) {
            if (room.max <= member.size){
                return res.redirect(`/main/${room.food}/?error=허용 초과 인원인 방입니다.`);
            }
        }
        const chats = await Chat.find({ room: room._id }).sort('createdAt');
        return res.render('chat', {
            room,
            title: room.title,
            chats,
            user: req.user.nick,
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});


router.delete('/room/:id',  async (req, res, next) => {
    try{
        await Room.remove({ _id: req.params.id });
        res.send('ok');
        setTimeout(() => {
            req.app.get('io').of('/room').emit('removeRoom', req.params.id);
        }, 2000);
    }catch (error) {
        console.error(error);
        next(error);
    }
});

try {
    fs.readdirSync('uploads');
}catch (err) {
    console.error('uploads 폴더가 없으므로 생성하겠습니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, res, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/post/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `${req.file.filename}`});
});

const upload2 = multer();
router.post('/room/:id/chat', isLoggedIn, upload2.none(),async (req, res, next) =>{
    try{
        console.log(req.body.img_url);
        const chat = await Chat.create({
           room: req.params.id,
           user: req.user.nick,
           chat: req.body.chat,
           gif: req.body.gif,
        });
        req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
        res.send('ok');
    }catch (error) {
        console.error(error);
        next(error);
    }
});



module.exports = router;