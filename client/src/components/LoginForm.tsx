/* eslint-disable react/jsx-no-undef */
import { FormEventHandler, MouseEventHandler, useEffect, useRef } from 'react';
import { useLocalStorage } from 'react-use';
import { useRandomUsername } from 'src/hooks';
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

   const handleRandomUsernameClick: MouseEventHandler<HTMLButtonElement> = (
      e
   ) => {
      e.preventDefault();
      if (idRef.current) {
         idRef.current.value = generateUsername();
      }
   };

   if (isLoggedIn) {
      return <Redirect to="/app" exact />;
   }

   return (
      <form onSubmit={handleSubmit}>
         <div className="main-input">
            <div>
               Create your <span className="">Account.</span>
            </div>
            <input
               type="text"
               ref={idRef as any}
               placeholder={generateUsername()}
               required
            />
         </div>
         <div className="buttons">
            <button type="submit" className="btn-primary">
               Login
            </button>
            <button
               className="btn-outline-secondary"
               type="button"
               onClick={handleRandomUsernameClick}
            >
               Generate random name!
            </button>
         </div>
      </form>
   );
};

export default LoginForm;
