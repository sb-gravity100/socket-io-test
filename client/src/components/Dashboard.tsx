import _times from 'lodash/times';
import { nanoid } from 'nanoid';
import { FC, useEffect, useMemo, useState } from 'react';
import { Redirect } from 'react-router';
import { FaUserPlus, FaFolderPlus } from 'react-icons/fa';
import { useRandomUsername } from 'src/hooks';
import { useSelector } from 'src/store';
import UserPane from './sub/UserPane';

const Sidebar: FC = (props) => {
   const generateNames = useRandomUsername();
   const MOCK_USERS = useMemo(
      () =>
         _times(20, () => {
            const bool = Math.random() < 0.5;
            return {
               username: generateNames(),
               isOnline: bool,
               lastOnline: bool
                  ? new Date()
                  : new Date(Date.now() - Date.now() * Math.random() * 0.0002),
               id: nanoid(),
            };
         }),
      []
   );
   // console.log(MOCK_USERS);
   return (
      <div className="sidebar">
         <div className="head">
            <div className="logo fs-3 font-secondary">
               Message <span className="text-secondary">App</span> Name
            </div>
            <div className="control-buttons">
               <div>
                  <div>Users</div>
                  <button>
                     <FaUserPlus />
                  </button>
               </div>
               <div>
                  <div>Room</div>
                  <button>
                     <FaFolderPlus />
                  </button>
               </div>
            </div>
         </div>
         <div className="pane">
            {MOCK_USERS.map((e, i) => (
               <UserPane key={i} {...e} />
            ))}
         </div>
      </div>
   );
};

const Dashboard: FC = (props) => {
   const { isLoggedIn } = useSelector((state) => state.user);

   useEffect(() => {
      document.title = 'App';
   }, []);

   if (!isLoggedIn) {
      return <Redirect to="/" exact />;
   }

   return (
      <div className="app">
         <Sidebar />
      </div>
   );
};

export default Dashboard;
