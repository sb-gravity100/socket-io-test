import { FC } from 'react';
import { Container, Tab } from 'react-bootstrap';

const Sidebar: FC = (props) => {
   return (
      <div className="d-flex w-25 h-100">
         <Tab.Container></Tab.Container>
      </div>
   );
};

const Dashboard: FC = (props) => {
   return (
      <>
         <Sidebar />
      </>
   );
};

export default Dashboard;
