import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import { socket } from './socket';
import { setID } from './reducer/SocketSlice';

socket.on('connect', () => {
   store.dispatch(setID(socket.id));
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
