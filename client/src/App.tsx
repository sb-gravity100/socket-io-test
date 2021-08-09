/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { FormEventHandler, useEffect } from 'react';
import { useLocalStorage, useSessionStorage } from 'react-use';
import Header from './components/Header';
import { updateState } from './reducer/SocketSlice';
import { socket } from './socket';
import { useDispatch, useSelector } from './store';
import styles from './style.module.scss';

interface UserSession {
   value?: string;
   disable?: boolean;
   expires?: Date;
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
                  value: e.target.value.trim(),
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
   const [username, setUsername] = useSessionStorage<UserSession>('user', {
      disable: false,
      error: [],
   });
   useEffect(() => {
      const now = new Date();
      if (
         username?.expires &&
         new Date(username.expires).getTime() < now.getTime()
      ) {
         setUsername({
            disable: false,
            error: ['Username timeouted!'],
         });
      } else {
         if (username?.value) {
            socket.emit('SET:username', username.value);
         }
      }
   }, [setUsername, username?.expires]);
   const socketID = useSelector(state => state.socket.id);
   const dispatch = useDispatch();
   const usernameHandler: FormEventHandler = e => {
      e.preventDefault();
      e.stopPropagation();
      if (username?.value) {
         const now = new Date();
         setUsername({
            ...username,
            disable: true,
            expires: new Date(now.getTime() + 1000 * 60 * 60),
         });
         socket.emit('SET:username', username?.value);
         dispatch(
            updateState({
               key: 'username',
               value: username.value,
            })
         );
      } else {
         if (!username?.error?.find(e => e.match(/please supply a name/i))) {
            setUsername({
               ...username,
               disable: false,
               error: username?.error
                  ? [...username.error, 'Please supply a name.']
                  : ['Please supply a name.'],
            });
         }
      }
   };
   return (
      <div>
         <div className={styles.fixed_group}>
            <h5>Current ID: {socketID}</h5>
            {username?.disable && <h5>Username: {username.value}</h5>}
         </div>
         <Header />
         <main>
            {!username?.disable && (
               <UsernameForm
                  username={username}
                  setUsername={setUsername}
                  usernameHandler={usernameHandler}
               />
            )}
         </main>
      </div>
   );
};

export default App;
