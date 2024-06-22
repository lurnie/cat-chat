const socket = io();

const button = document.querySelector('#send-message');
const input = document.querySelector('#message-input');
const messages = document.querySelector('#messages');
const nicknameInput = document.querySelector('#nickname-input');''

const body = document.querySelector('body');

fetch('https://api.sefinek.net/api/v2/random/animal/cat').then((res) => {
    if (res.ok) {
        res.json().then(jsonData => {
            let url = jsonData.message;
            body.style['background-image'] = `url(${url})`;
        })
    }
})

socket.emit('nickname-change', nicknameInput.value);

input.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
        button.click();
    }
})

nicknameInput.addEventListener('focusout', () => {
    socket.emit('nickname-change', nicknameInput.value);
})

function addMessage(message) {
    const messageElement = document.createElement('span');
    messageElement.innerHTML = message;
    messages.appendChild(messageElement);
    messageElement.scrollIntoView();
}


socket.on('message', (message) => {
    addMessage(message);
})

socket.on('connection', () => {
    addMessage('New user connected.');
})


socket.on('user-disconnection', (username) => {
    addMessage(`${username} disconnected.`);
})

button.addEventListener('click', () => {
    let text = input.value;

    input.value = '';
    socket.emit('message', text);
})
