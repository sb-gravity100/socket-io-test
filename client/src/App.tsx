import { FC } from 'react';
import { Stack, Row } from 'react-bootstrap';
import LoginForm from './components/LoginForm';
import LoginHeader from './components/LoginHeader';
import { useSelector } from './store';

const App: FC = () => {
   const { isLoggedIn } = useSelector((state) => state.user);
   return (
      <Stack gap={5} className="h-100 justify-content-center mx-5">
         <Row>
            <LoginHeader />
         </Row>
         <Row>
            <LoginForm />
         </Row>
      </Stack>
   );
};

export default App;
