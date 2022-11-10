const SocketIO = require('socket.io');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');
const Room = require('./schemas/room');


module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, { path: '/socket.io' });
    app.set('io', io);
    const room = io.of('/room');
    const chat = io.of('/chat');
    
    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
    chat.use(wrap(cookieParser(process.env.COOKIE_SECRET)));
    chat.use(wrap(sessionMiddleware));

    room.on('connection', (socket) => {
        console.log('room 네임스페이스에 접속');
        socket.on('disconnect', () => {
            console.log('room 네임스페이스 접속 해제');
        });
    });

    chat.on('connection', (socket) => {
        try{
            console.log('chat 네임스페이스에 접속');
            const req = socket.request;
            const { headers: { referer } } = req;
            const { rooms } = chat.adapter;
            const roomId = referer
                .split('/')[referer.split('/').length - 1]
                .replace(/\?.+/, '');
            socket.join(roomId);
            socket.to(roomId).emit('join', {
                user: 'system',
                chat: `${req.session.passport.user}님이 입장하셨습니다.`,
            });
            const $members = rooms.get(roomId);
            
            
            socket.on('disconnect', () => {
                console.log('chat 네임스페이스 접속 해제');
                socket.leave(roomId);
                const member = rooms.get(roomId);
                if (member === undefined) {
                    const signedCookie = req.signedCookies['connect.sid'];
                    const connectSID = cookie.sign(signedCookie, process.env.COOKIE_SECRET);
                    axios.delete(`http://localhost:8008/room/${roomId}`, {
                        header: {
                            Cookie: `connect.sid=s%3A${connectSID}`,
                        },
                    })
                        .then(() => {
                            console.log('방 제거 요청 성공');
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                } else {
                    sendMemberLength($members, roomId);
                    socket.to(roomId).emit('exit', {
                        user: 'system',
                        chat: `${req.session.passport.user}님이 퇴장하셨습니다.`,
                    });
                }
                sendMemberLength($members, roomId);
                    socket.to(roomId).emit('exit', {
                        user: 'system',
                        chat: `${req.session.passport.user}님이 퇴장하셨습니다.`,
                    });
            });
            sendMemberLength($members, roomId);
        }catch (err) {
            console.error(err);
        }
        
    });


    let sendMemberLength = async (members, roomId) => {
        if (!(members === undefined)){
            io.of('/room').emit('members', {
                size: members.size,
                id: roomId,
            });
            await axios.patch(`http://localhost:8080/update/chat/${roomId}`, { size: members.size });
        } else{
            io.of('/room').emit('members', {
                size: 0,
                id: roomId,
            });
        }
    }
};

