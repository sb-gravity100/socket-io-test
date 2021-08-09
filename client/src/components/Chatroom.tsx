import { FC } from 'react';

const AppRoom: FC = props => {
   return (
      <>
         <div className="chatroom">
            <div className="room-header"></div>
            <div className="room-space">
               <div className="top-space"></div>
               <div className="msg-space"></div>
            </div>
         </div>
      </>
   );
};
