import { FC, useRef } from 'react';
import { Container } from 'react-bootstrap';
import LoginForm from './components/LoginForm';

const App: FC = () => {
   return (
      <Container className="align-items-center h-100 d-flex">
         <LoginForm />
      </Container>
   );
};

export default App;
