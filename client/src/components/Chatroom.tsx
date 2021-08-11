import { FC, FormEventHandler, useState } from 'react';
import { socket } from 'src/socket';
import { useDispatch, useSelector } from 'src/store';
import { FaPaperPlane } from 'react-icons/fa';
import { ChatArgswithRoom } from '../../../src/events-map';
import { addMsg } from 'src/reducer/SocketSlice';

const ChatComponent: FC<Partial<ChatArgswithRoom>> = props => {
   return (
      <div className="msg-panel">
         <div className="created-at">{props.createdAt?.toString()}</div>
         <div className="username">{props.username}</div>
         <div className="payload">{props.payload}</div>
      </div>
   );
};

const AppRoom: FC = props => {
   const [msg, setMsg] = useState<string>('');
   const { room, username, id } = useSelector(state => state.socket);
   const messages = useSelector(state =>
      state.socket.messages
         ? state.socket.messages.filter(e => e.room === room.current)
         : []
   );
   console.log(Array.isArray(messages));
   const dispatch = useDispatch();
   const messageHandler: FormEventHandler = function (e) {
      e.preventDefault();
      // e.persist()
      if (!msg) {
         return;
      }
      socket.emit('message', msg, () => {
         setMsg('');
         dispatch(
            addMsg({
               createdAt: new Date(),
               id: ((messages?.length || 0) + 1).toString(),
               payload: msg,
               username: username || id,
               room: room.current,
            })
         );
      });
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
                        messages.map(msg => (
                           <ChatComponent key={msg.id} {...msg} />
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
