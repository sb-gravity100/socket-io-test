import { FC, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';
import { useSelector } from './store';

const App: FC = () => {
   const { isLoggedIn } = useSelector((state) => state.user);

   useEffect(() => {
      if (isLoggedIn) {
         document.title = 'Message Dashboard';
      } else {
         document.title = 'Messaging App';
      }
   }, [isLoggedIn]);

   return isLoggedIn ? (
      <Dashboard />
   ) : (
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
};

export default App;
