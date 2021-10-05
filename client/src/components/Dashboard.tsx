import { FC, useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import { useSelector } from 'src/store';

const Sidebar: FC = (props) => {
   return <div className=""></div>;
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
      <div className="">
         <Sidebar />
      </div>
   );
};

export default Dashboard;
