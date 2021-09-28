import React from 'react';
import { Alert, AlertProps } from 'react-bootstrap';

const SmolAlert: React.FC<AlertProps> = function SmolAlert(props) {
   return (
      <Alert className="py-1 my-2" {...props}>
         {props.children}
      </Alert>
   );
};

export default SmolAlert;
