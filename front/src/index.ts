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

socket.on('connect', () => {
   console.log('Successfully connected!: %s', socket.id);
});

socket.on('usersList', users => {
   userRow.innerHTML = '';
   users.forEach(id => {
      const userElem = document.createElement('div');
      userElem.innerHTML = `${id}`;
      userRow.appendChild(userElem);
   });
});

socket.on('receiveMsg', (msg, id) => {
   const newMsg = document.createElement('div');
   newMsg.innerHTML = `
  <div>${id}</div>
  <div>${msg}</div>
  `;
   msgRow.appendChild(newMsg);
});
