import React from 'react';
import { useSelector } from './store';
import styles from './style.module.scss';

const App: React.FC = () => {
   const socketID = useSelector(state => state.socket.id);
   return (
      <div>
         <h5 className={styles.socket_id}>Current ID: {socketID}</h5>
         <h1>Hello World</h1>
         <div className={styles.setUsernameForm}>
            <form>
               <input type="text" placeholder="Anonymous" name="username" />
               <input type="submit" value="Set" />
            </form>
         </div>
      </div>
   );
};

export default App;
