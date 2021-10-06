import React from 'react';
import { Link } from 'react-router-dom';
import ReactTimeAgo from './TimeAgo';

type UserPaneProps = {
   username: string;
   lastOnline: Date | number;
   isOnline: boolean;
   id: string;
};

const UserPane: React.FC<UserPaneProps> = (props) => {
   return (
      <Link to={`/${props.id}`} className="user-pane">
         <div className="username">{props.username}</div>
         {props.isOnline ? (
            <div className="status text-success">Online</div>
         ) : (
            <ReactTimeAgo
               formatStyle="twitter-minute"
               date={props.lastOnline}
               className="text-secondary status"
            />
         )}
      </Link>
   );
};

export default UserPane;
