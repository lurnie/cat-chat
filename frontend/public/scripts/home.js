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
            console.log(url)
            body.style['background-image'] = `url(${url})`;
        })
    }
})

input.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
        button.click();
    }
})


socket.on('message', (message) => {
    const messageElement = document.createElement('li');
    messageElement.innerHTML = message;
    messages.appendChild(messageElement);
    messageElement.scrollIntoView();
})

button.addEventListener('click', () => {
    let text = input.value;
    let nickname = nicknameInput.value;

    input.value = '';
    socket.emit('message', text, nickname);
})
