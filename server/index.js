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

    socket.on('message', (text, nickname) => {
        nickname = nickname.replaceAll('<', '&lt').replaceAll('>', '&gt');
        text = text.replaceAll('<', '&lt').replaceAll('>', '&gt');
        console.log(`${nickname}: ${text}`);
        io.emit('message', `${nickname}: ${text}`)
    })

})


server.listen(port, () => {
    console.log(`Running on http://localhost:${port}`)
});