import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store';
import './index.scss';
import { Provider } from 'react-redux';
import socket from './socket';
import { joinRoom, logOut } from './slices/UserSlice';

socket.on('connect', () => {
   store.dispatch(joinRoom('public'));
});

socket.on('connect_error', () => {
   store.dispatch(logOut());
});

ReactDOM.render(
   <React.StrictMode>
      <Provider store={store}>
         <App />
      </Provider>
   </React.StrictMode>,
   document.querySelector('#root')
);
