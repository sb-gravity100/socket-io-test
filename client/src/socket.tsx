import io, { Socket as ioSocket } from 'socket.io-client';
import { useState, useEffect, useContext, createContext, FC } from 'react';
import { SocketEvents } from './types';

export type Socket = ioSocket<SocketEvents, SocketEvents>;

const SocketContext = createContext<Socket>(undefined as any);

export function useSocket() {
   return useContext(SocketContext);
}

export const SocketProvider: FC<{
   id: string;
   namespace?: string;
   username?: string;
}> = (props) => {
   const [socket, setSocket] = useState<Socket>();

   useEffect(() => {
      const options: any = {
         query: {
            id: props.id,
            username: props.username,
         },
      };
      const newSocket = props.namespace
         ? io(`/${props.namespace}`, options)
         : io(options);

      setSocket(newSocket);
      return () => {
         socket?.close();
      };
   }, [props.id]);

   return (
      <SocketContext.Provider value={socket as any}>
         {props.children}
      </SocketContext.Provider>
   );
};
