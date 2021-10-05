import React from 'react';
import ReactTimeAgo from './sub/TimeAgo';

type UserPaneProps = {
   username: string;
   lastOnline: Date;
   isOnline: boolean;
};

const UserPane: React.FC<UserPaneProps> = (props) => {
   return (
      <div className="user-pane">
         <div className="username">{props.username}</div>
         {props.isOnline ? (
            <div className="status"></div>
         ) : (
            <ReactTimeAgo style="twitter-minute" date={props.lastOnline} />
         )}
      </div>
   );
};

export default UserPane;
