/* eslint-disable react/jsx-no-undef */
import { FormEventHandler, useEffect, useRef } from 'react';
import { useLocalStorage } from 'react-use';
import { Form, Button } from 'react-bootstrap';
import { useRandomUsername } from 'src/hooks';
import SmolAlert from './SmolAlert';
import { useDispatch } from 'src/store';
import { logIn, setKey } from 'src/slices/UserSlice';
import { nanoid } from '@reduxjs/toolkit';

const LoginForm: React.FC<any> = () => {
   const [id, setID] = useLocalStorage<string | undefined>('local-id');
   const [username, setUsername] = useLocalStorage<string | undefined>(
      'local-username'
   );
   const dispatch = useDispatch();
   const idRef = useRef<HTMLInputElement>();
   const generateUsername = useRandomUsername();

   useEffect(() => {
      if (id) {
         dispatch(
            setKey({
               key: 'userID',
               value: id,
            })
         );
         dispatch(
            setKey({
               key: 'username',
               value: username,
            })
         );
         // dispatch(logIn());
      }
   }, [id, username]);

   const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
      e.preventDefault();
      setUsername(idRef.current?.value);
      setID(nanoid());

      // dispatch(logIn());
   };

   const handleRandomUsernameClick = () => {
      if (idRef.current) {
         idRef.current.value = generateUsername();
      }
   };
   return (
      <Form onSubmit={handleSubmit} className="w-100">
         <Form.Group className="mb-2">
            <Form.Label>
               Create your <span className="fw-bold">Stand!</span>
            </Form.Label>
            <Form.Control
               type="text"
               ref={idRef as any}
               placeholder={generateUsername()}
               required
            />
         </Form.Group>
         <Button type="submit" className="me-2">
            Login
         </Button>
         <Button
            onClick={handleRandomUsernameClick}
            variant="outline-secondary"
         >
            Generate random name!
         </Button>
      </Form>
   );
};

export default LoginForm;
