import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import { socket } from './socket';
import { changeRoom, setID, updateState } from './reducer/SocketSlice';

socket.on('connect', () => {
   store.dispatch(setID(socket.id));
   socket.emit('SET:room', 'public', () => {
      store.dispatch(changeRoom('public'));
   });
   // setInterval(() => {
   //    socket.emit('ping', 1);
   // }, 1000);
});

socket.on('GET:user', user => {
   const socketStore = store.getState().socket;
   let key: keyof typeof user;
   for (key in user) {
      store.dispatch(
         updateState({
            key,
            value: user[key],
         })
      );
   }
});

ReactDOM.render(
   <React.StrictMode>
      <Provider store={store}>
         <App />
      </Provider>
   </React.StrictMode>,
   document.getElementById('root')
);
