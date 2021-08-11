/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { FormEventHandler, useEffect } from 'react';
import { useLocalStorage, useSessionStorage } from 'react-use';
import AppRoom from './components/Chatroom';
import Header from './components/Header';
import { updateState } from './reducer/SocketSlice';
import { socket } from './socket';
import { useDispatch, useSelector } from './store';
import styles from './style.module.scss';

interface UserSession {
   value?: string;
   error?: string[];
}

interface UsernameFormProps {
   usernameHandler: FormEventHandler;
   username: UserSession;
   setUsername(value: UserSession): void;
}

const UsernameForm: React.FC<UsernameFormProps> = ({
   usernameHandler,
   username,
   setUsername,
}) => (
   <div className={styles.setUsernameForm}>
      <form onSubmit={usernameHandler}>
         <input
            autoComplete="off"
            type="text"
            placeholder="Anonymous"
            name="username"
            value={username?.value}
            onChange={e =>
               setUsername({
                  ...username,
                  value: e.target.value,
                  error: undefined,
               })
            }
         />
         <input type="submit" value="Set" />
         {username?.error?.map((err, i) => (
            <div key={i} className={styles.form_error}>
               {err}
            </div>
         ))}
      </form>
   </div>
);

const App: React.FC = () => {
   const { id: socketID, username: socketUsername } = useSelector(
      state => state.socket
   );
   const [username, setUsername] = useSessionStorage<UserSession>('user', {
      error: [],
      value: socketUsername || '',
   });
   useEffect(() => {
      if (username?.value) {
         socket.emit('SET:username', username.value.trim(), () =>
            dispatch(
               updateState({
                  key: 'username',
                  value: username.value?.trim(),
               })
            )
         );
      }
   }, []);
   const dispatch = useDispatch();
   const usernameHandler: FormEventHandler = e => {
      e.preventDefault();
      e.stopPropagation();
      if (username?.value) {
         const now = new Date();
         setUsername({
            ...username,
         });
         socket.emit('SET:username', username?.value.trim(), () =>
            dispatch(
               updateState({
                  key: 'username',
                  value: username.value?.trim(),
               })
            )
         );
      } else {
         if (!username?.error?.find(e => e.match(/please supply a name/i))) {
            setUsername({
               ...username,
               error: username?.error
                  ? [...username.error, 'Please supply a name.']
                  : ['Please supply a name.'],
            });
         }
      }
   };
   return (
      <>
         <div className={styles.fixed_group}>
            {socketID && <h5>Current ID: {socketID}</h5>}
            <h5>
               Username:{' '}
               {socketUsername ? socketUsername : username?.value?.trim()}
            </h5>
         </div>
         <Header />
         <main>
            <UsernameForm
               username={username}
               setUsername={setUsername}
               usernameHandler={usernameHandler}
            />
            <AppRoom />
         </main>
      </>
   );
};

export default App;
