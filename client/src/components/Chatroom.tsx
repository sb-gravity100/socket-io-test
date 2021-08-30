import { FC, FormEventHandler, useState } from 'react';
import { socket } from 'src/socket';
import { useDispatch, useSelector } from 'src/store';
import { FaPaperPlane } from 'react-icons/fa';
import { ChatArgswithRoom } from '../../../src/events-map';
import { addMsg } from 'src/reducer/SocketSlice';
import { TimeAgoComponent } from '../time-ago';
import { useDebounce } from 'react-use';

const ChatComponent: FC<ChatArgswithRoom> = (props) => {
   return (
      <div className="msg-panel">
         <div className="created-at">
            <TimeAgoComponent
               date={new Date(props.createdAt)}
               timeStyle="round-minute"
            />
         </div>
         <div className="username">{props.username}</div>
         <div className="payload">{props.payload}</div>
      </div>
   );
};

const AppRoom: FC = (props) => {
   const [msg, setMsg] = useState<string>('');
   const { room, username, id } = useSelector((state) => state.socket);
   const messages = useSelector((state) =>
      state.socket.messages
         ? state.socket.messages.filter((e) => e.room === room.current)
         : []
   );
   const dispatch = useDispatch();

   useDebounce(
      () => {
         const msgSpace = document.querySelector('.msg-space');
         msgSpace?.scrollTo({
            top: msgSpace.scrollHeight,
         });
      },
      100,
      [messages]
   );
   const messageHandler: FormEventHandler = function (e) {
      e.preventDefault();
      setMsg('');
      // e.persist()
      if (!msg) {
         return;
      }
      dispatch(
         addMsg({
            createdAt: new Date(),
            id: ((messages?.length || 0) + 1).toString(),
            payload: msg,
            username: username || id,
            room: room.current,
         })
      );
      socket.emit('message', msg);
   };
   return (
      <>
         <div className="chatroom">
            <div className="space">
               <div className="top-space">
                  <div className="title-area">ChatSocket</div>
                  {' - '}
                  <div className="room-title">{room.current}</div>
               </div>
               <div className="room-header">
                  <div className="user-space"></div>
               </div>
               <div className="room-space">
                  <div className="msg-space">
                     {Array.isArray(messages) &&
                        messages.map((msg) => (
                           <ChatComponent key={msg.id} {...msg} />
                        ))}
                  </div>
                  <div className="msg-form">
                     <form onSubmit={messageHandler}>
                        <input
                           type="text"
                           value={msg}
                           onChange={(e) => setMsg(e.target.value)}
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
