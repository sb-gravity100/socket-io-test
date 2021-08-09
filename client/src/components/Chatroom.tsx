import { FC, useState } from 'react';
import { socket } from 'src/socket';

const AppRoom: FC = props => {
   return (
      <>
         <div className="chatroom">
            <div className="space">
               <div className="room-header">
                  <div className="top-space"></div>
                  <div className="user-space"></div>
               </div>
               <div className="room-space">
                  <div className="top-space"></div>
                  <div className="msg-space"></div>
               </div>
            </div>
         </div>
      </>
   );
};

export default AppRoom;
