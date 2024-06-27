// public/scripts.js
const socket = io();

document.getElementById('create-room').addEventListener('click', () => {
  const roomName = document.getElementById('new-room').value;
  if (roomName) {
    socket.emit('createRoom', roomName);
    document.getElementById('new-room').value = '';
  }
});

document.getElementById('send-message').addEventListener('click', () => {
  const message = document.getElementById('message-input').value;
  const username = document.getElementById('username').value;
  if (message && username) {
    socket.emit('sendMessage', { message, username });
    document.getElementById('message-input').value = '';
  }
});

socket.on('roomList', (rooms) => {
  const roomList = document.getElementById('room-list');
  roomList.innerHTML = '';
  rooms.forEach(room => {
    const li = document.createElement('li');
    li.textContent = room;
    li.addEventListener('click', () => {
      const username = document.getElementById('username').value;
      if (username) {
        socket.emit('joinRoom', room, username);
      } else {
        alert('Please enter a username');
      }
    });
    roomList.appendChild(li);
  });
});

socket.on('message', (data) => {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.innerHTML = `<span class="username">${data.username}</span>: ${data.message} <span class="timestamp">${data.timestamp}</span>`;
  document.getElementById('messages').appendChild(messageDiv);

  // Smooth scroll to the bottom of the messages container
  const messagesContainer = document.getElementById('messages');
  messagesContainer.scrollTo({
    top: messagesContainer.scrollHeight,
    behavior: 'smooth'  // Use smooth scrolling behavior
  });
});
