/* eslint-disable react/jsx-no-undef */
import { FormEventHandler, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useRandomUsername } from 'src/hooks';
import SmolAlert from './SmolAlert';

const LoginForm: React.FC<any> = () => {
   const idRef = useRef<HTMLInputElement>();
   const generateUsername = useRandomUsername();

   const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
      e.preventDefault();
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
