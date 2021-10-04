import { FC, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';
import { SocketProvider } from './socket';
import { useSelector } from './store';

const Login: FC = () => (
   <Container className="d-flex flex-column h-100 justify-content-center">
      <div
         style={{ top: 0, right: 0 }}
         className="d-flex gap-2 justify-content-between position-absolute p-3"
      >
         <Button variant="light">Docs</Button>
         <Button variant="light">Devs</Button>
         <Button variant="light">Contact Us</Button>
      </div>
      <div
         style={{ bottom: 0, right: 0 }}
         className="position-absolute text-secondary fs-6 p-3"
      >
         All Rights Reserved &trade;
      </div>
      <div className="fw-bold display-1 text-light">
         Messaging <span className="text-secondary">App</span> Name
      </div>
      <LoginForm />
   </Container>
);

const App: FC = () => {
   const { isLoggedIn, userID, username } = useSelector((state) => state.user);

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
