/* eslint-disable react/jsx-no-undef */
import { FormEventHandler, useEffect, useRef } from 'react';
import { useLocalStorage } from 'react-use';
import { Form, Button } from 'react-bootstrap';
import { useRandomUsername } from 'src/hooks';
import SmolAlert from './SmolAlert';
import { useDispatch, useSelector } from 'src/store';
import { logIn, setKey } from 'src/slices/UserSlice';
import { nanoid } from '@reduxjs/toolkit';
import { Redirect } from 'react-router';

const LoginForm: React.FC<any> = () => {
   const [id, setID] = useLocalStorage<string | undefined>('local-id');
   const [username, setUsername] = useLocalStorage<string | undefined>(
      'local-username'
   );
   const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
   const dispatch = useDispatch();
   const idRef = useRef<HTMLInputElement>();
   const generateUsername = useRandomUsername();

   document.title = 'Login';

   useEffect(() => {
      if (id) {
         dispatch(setKey('userID', id));
         dispatch(setKey('username', username));
      }
   }, [id, username]);

   const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
      e.preventDefault();
      setUsername(idRef.current?.value);
      setID(nanoid());

      dispatch(logIn());
   };

   const handleRandomUsernameClick = () => {
      if (idRef.current) {
         idRef.current.value = generateUsername();
      }
   };

   if (isLoggedIn) {
      return <Redirect to="/app" exact />;
   }

   return (
      <Form onSubmit={handleSubmit} className="w-100 text-light">
         <Form.Group className="mb-2">
            <Form.Label>
               Create your <span className="fw-bold">Account.</span>
            </Form.Label>
            <Form.Control
               type="text"
               ref={idRef as any}
               placeholder={generateUsername()}
               required
            />
         </Form.Group>
         <Button variant="secondary" type="submit" className="me-2">
            Login
         </Button>
         <Button onClick={handleRandomUsernameClick} variant="outline-primary">
            Generate random name!
         </Button>
      </Form>
   );
};

export default LoginForm;
