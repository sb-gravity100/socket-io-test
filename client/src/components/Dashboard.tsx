import { FC, useState } from 'react';
import {
   Container,
   Nav,
   NavItem,
   NavLink,
   Tab,
   TabContainer,
   TabContent,
   TabPane,
   Button,
} from 'react-bootstrap';

const USERS_TAB = 'users',
   ROOMS_TAB = 'rooms';

const Sidebar: FC = (props) => {
   const [activeKey, onSelect] = useState<string>(USERS_TAB);
   return (
      <div className="d-flex flex-column w-25">
         <TabContainer defaultActiveKey={activeKey} onSelect={onSelect as any}>
            <Nav variant="tabs" className="justify-content-between text-center">
               <NavItem className="flex-grow-1">
                  <NavLink
                     className="rounded-0"
                     eventKey={USERS_TAB}
                     as={Button}
                  >
                     Users
                  </NavLink>
               </NavItem>
               <NavItem className="flex-grow-1">
                  <NavLink className="rounded-0" eventKey={ROOMS_TAB}>
                     Rooms
                  </NavLink>
               </NavItem>
            </Nav>
            <TabContent>
               <TabPane eventKey={USERS_TAB}></TabPane>
               <TabPane eventKey={ROOMS_TAB}></TabPane>
            </TabContent>
         </TabContainer>
      </div>
   );
};

const Dashboard: FC = (props) => {
   document.title = 'App';
   return (
      <div className="h-100 bg-light w-100">
         <Sidebar />
      </div>
   );
};

export default Dashboard;
