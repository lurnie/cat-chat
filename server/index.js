let users = new Map();

const express = require('express');
const app = express();
const port = 3000;
const server = require('http').createServer(app);

const {Server} = require('socket.io');
const io = new Server(server);

const { readFile } = require('fs');

const path = '../frontend/';

app.use(express.static(path + 'public'));

async function returnPage(request, response, next, page) {
    readFile(path + page, 'utf-8', (err, html) => {

        if (err) {
            //next(err); maybe I will use next instead?
            console.log(`500 Internal Server Error - failed to retrieve ${path+page} `)
            response.status(500).send('500 Internal Server Error - page could not be retrieved');
        } else {
            response.send(html);
        }

    })
}

app.get('/', (request, response, next ) => {returnPage(request, response, next, 'home.html')})


io.on('connection', (socket) => {
    console.log('A user connected.');
    io.emit('connection');

    socket.on('message', (text) => {
        let nickname = users.get(socket.id);
        text = text.replaceAll('<', '&lt').replaceAll('>', '&gt');
        console.log(`${nickname}: ${text}`);
        io.emit('message', `${nickname}: ${text}`)
    });

    socket.on('nickname-change', (nickname) => {
        nickname = nickname.replaceAll('<', '&lt').replaceAll('>', '&gt');

        let oldNickname;
        if (users.has(socket.id)) {oldNickname = users.get(socket.id);}
        if (nickname === oldNickname) {return;}

        console.log(`${oldNickname} changed nickname to ${nickname}`)

        users.set(socket.id, nickname);
    });

    socket.on('disconnect', () => {
        let nickname = users.get(socket.id);

        console.log(`${nickname} disconnected.`)
        io.emit('user-disconnection', nickname);
    });
});






server.listen(port, () => {
    console.log(`Running on http://localhost:${port}`)
});