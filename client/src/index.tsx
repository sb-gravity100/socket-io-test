import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import { logIn, setKey } from './slices/UserSlice';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { BrowserRouter } from 'react-router-dom';
import './index.scss';

TimeAgo.addDefaultLocale(en);

const id = localStorage.getItem('local-id');
const username = localStorage.getItem('local-username');

if (id) {
   store.dispatch(setKey('userID', JSON.parse(id)));
   store.dispatch(setKey('username', JSON.parse(username || '')));
   store.dispatch(logIn());
}

ReactDOM.render(
   // <React.StrictMode>
   <BrowserRouter>
      <Provider store={store}>
         <App />
      </Provider>
   </BrowserRouter>,
   // </React.StrictMode>
   document.querySelector('#root')
);
