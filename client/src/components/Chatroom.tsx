import { FC, FormEventHandler, useState } from 'react';
import { socket } from 'src/socket';
import { useSelector } from 'src/store';
import { FaPaperPlane } from 'react-icons/fa';

const AppRoom: FC = props => {
   const [msg, setMsg] = useState<string>('');
   const [msgRow, setMsgRow] = useState<string[]>([]);
   const { room, username } = useSelector(state => state.socket);
   const messageHandler: FormEventHandler = function (e) {
      e.preventDefault();
      // e.persist()
      console.log(msg);
      setMsg('');
   };
   return (
      <>
         <div className="chatroom">
            <div className="space">
               <div className="top-space">
                  <div className="title-area">ChatSocket</div>
                  <div className="room-title"></div>
               </div>
               <div className="room-header">
                  <div className="user-space"></div>
               </div>
               <div className="room-space">
                  <div className="msg-space">
                     {msgRow.map(e => (
                        <div className="msg-panel">{e}</div>
                     ))}
                  </div>
                  <div className="msg-form">
                     <form onSubmit={messageHandler}>
                        <input
                           type="text"
                           value={msg}
                           onChange={e => setMsg(e.target.value)}
                        />
                        <button type="submit" title="Send">
                           <FaPaperPlane />
                        </button>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default AppRoom;
