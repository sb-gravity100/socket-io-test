import { useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { randomUsername } from 'src/funcs';

const LoginForm: React.FC<any> = () => {
   const idRef = useRef<HTMLInputElement>();

   const handleRandomUsernameClick = () => {
      if (idRef.current) {
         idRef.current.value = randomUsername();
      }
   };
   return (
      <Form className="w-100">
         <Form.Group className="mb-2">
            <Form.Label>
               Start a <span className="fw-bold">Persona</span>
            </Form.Label>
            <Form.Control
               type="text"
               ref={idRef as any}
               placeholder={randomUsername()}
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
