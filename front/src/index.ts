import io from 'socket.io-client';
import './index.scss';

const socket = io();
const navBar = document.querySelector('.navbar');
const main = document.querySelector('.main');
const msgRow = document.createElement('div');
const userRow = document.createElement('div');
msgRow.className = 'msg-row';
userRow.className = 'user-row';

if (main && navBar) {
   main.appendChild(msgRow);
   navBar.appendChild(userRow);
}

function addMsg(msg, id, prep?: boolean) {
   const newMsg = document.createElement('div');
   newMsg.innerHTML = `
  <div>${id}</div>
  <div>${msg}</div>
  `;
   if (prep) {
      msgRow.prepend(newMsg);
   }
   msgRow.appendChild(newMsg);
}

socket.on('connect', () => {
   console.log('Successfully connected!: %s', socket.id);
   socket.emit('chat', `${socket.id} has joined!`, 'Bot');
   addMsg(`${socket.id} has joined!`, 'Bot');
   socket.emit('fetchMsg');
});

socket.on('usersList', users => {
   userRow.innerHTML = '';
   users.forEach(user => {
      const userElem = document.createElement('div');
      userElem.innerHTML = `${user.username || user.id}`;
      userRow.appendChild(userElem);
   });
});

socket.on('receiveMsg', addMsg);
