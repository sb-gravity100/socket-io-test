import _times from 'lodash/times';
import { nanoid } from 'nanoid';
import { FC, useEffect, useMemo, useState } from 'react';
import { Redirect } from 'react-router';
import { FaUserPlus, FaFolderPlus } from 'react-icons/fa';
import { useRandomUsername } from 'src/hooks';
import { useDispatch, useSelector } from 'src/store';
import UserPane from './sub/UserPane';
import { toggleTab } from 'src/slices/UserSlice';

const Sidebar: FC = (props) => {
   const generateNames = useRandomUsername();
   const { tab } = useSelector((state) => state.user);
   const dispatch = useDispatch();
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
               <div className={tab === 'USERS' ? 'current' : undefined}>
                  <div onClick={() => tab !== 'USERS' && toggleTab('USERS')}>
                     Users
                  </div>
                  <button>
                     <FaUserPlus />
                  </button>
               </div>
               <div className={tab === 'ROOMS' ? 'current' : undefined}>
                  <div onClick={() => tab !== 'ROOMS' && toggleTab('ROOMS')}>
                     Room
                  </div>
                  <button>
                     <FaFolderPlus />
                  </button>
               </div>
            </div>
         </div>
         {tab === 'USERS' ? (
            <div className="pane users">
               {MOCK_USERS.map((e, i) => (
                  <UserPane key={i} {...e} />
               ))}
            </div>
         ) : (
            <div className="pane rooms"></div>
         )}
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
