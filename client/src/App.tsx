import { FC, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';
import { SocketProvider } from './socket';
import { useSelector } from './store';

const Login: FC = () => (
   <div className="area-login-page">
      <div className="page-buttons">
         <button>Docs</button>
         <button>Devs</button>
         <button>Contact Us</button>
      </div>
      <div className="main">
         <div className="logo fs-6 font-secondary letter-1">
            Messaging <span className="highlight">App</span> Name
         </div>
         <LoginForm />
      </div>
      <div className="fs-1">All Rights Reserved &trade;</div>
   </div>
);

const App: FC = () => {
   const { userID, username } = useSelector((state) => state.user);

   return (
      <Switch>
         <Route path="/" exact component={Login} />
         <Route
            path="/app"
            render={() => (
               <SocketProvider id={userID} username={username}>
                  <Dashboard />
               </SocketProvider>
            )}
         />
      </Switch>
   );
};

export default App;
