import _times from 'lodash/times';
import { FC, useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import { useRandomUsername } from 'src/hooks';
import { useSelector } from 'src/store';

const Sidebar: FC = (props) => {
   const generateNames = useRandomUsername();
   const MOCK_USERS = _times(10, () => ({
      username: generateNames(),
      isOnline: Math.random() < 0.5,
      lastOnline: Date.now() - Date.now() * Math.random() * 0.2,
   }));
   console.log(MOCK_USERS);
   return (
      <div className="sidebar">
         <div className="logo font-secondary fs-3">
            <span>
               Message <span className="text-secondary">App</span> Name
            </span>
         </div>
         <div className="pane"></div>
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
