import React, { MouseEventHandler, useState } from 'react';
import { socket } from './socket';
import { useDispatch, useSelector } from './store';
import styles from './style.module.scss';

const App: React.FC = () => {
   const [username, setUsername] = useState<{
      value?: string;
      disable?: boolean;
   }>({
      disable: false,
   });
   const socketID = useSelector(state => state.socket.id);
   const dispatch = useDispatch();
   const usernameHandler: MouseEventHandler<HTMLInputElement> = e => {
      setUsername(p => ({
         ...p,
         disable: true,
      }));
      socket.emit('SET:username', username);
   };
   return (
      <div>
         <div className={styles.fixed_group}>
            <h5>Current ID: {socketID}</h5>
            {username.disable && <h5>Username: {username.value}</h5>}
         </div>
         <h1>Hello World</h1>
         <div className={styles.setUsernameForm}>
            <form>
               <input
                  autoComplete="off"
                  type="text"
                  placeholder="Anonymous"
                  name="username"
                  disabled={username.disable}
                  onChange={e =>
                     setUsername(p => ({
                        ...p,
                        value: e.target.value.trim(),
                     }))
                  }
               />
               <input
                  disabled={username.disable}
                  type="button"
                  value="Set"
                  onClick={usernameHandler}
               />
            </form>
         </div>
      </div>
   );
};

export default App;
