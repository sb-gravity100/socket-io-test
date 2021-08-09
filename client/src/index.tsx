import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import { socket } from './socket';
import { changeRoom, setID } from './reducer/SocketSlice';

socket.on('connect', () => {
   store.dispatch(setID(socket.id));
   socket.emit('SET:room', 'public', () => {
      store.dispatch(changeRoom('public'));
   });
   setInterval(() => {
      socket.emit('ping', 2);
      const username: { value?: string } = JSON.parse(
         sessionStorage.getItem('user') || '{}'
      );
      if (username?.value) socket.emit('SET:username', username.value);
   }, 2500);
});

ReactDOM.render(
   <React.StrictMode>
      <Provider store={store}>
         <App />
      </Provider>
   </React.StrictMode>,
   document.getElementById('root')
);
