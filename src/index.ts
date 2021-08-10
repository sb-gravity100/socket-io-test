import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import path from 'path';
import _dbug from 'debug';
import logger from 'morgan';
import session from 'express-session';
import cuid from 'cuid';
import _MMStore from 'memorystore';
import { Server } from 'socket.io';
import { execSync } from 'child_process';
import { SocketEvents } from './events-map';
import _ from 'lodash';
import { JSONFile, Low } from 'lowdb';

interface IUserStore {
   id: string;
   username?: string;
   room?: {
      current?: string;
      previous?: string;
   };
}
interface Database {
   users: IUserStore[];
}

const { SERVER_PORT, NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';
const publicFolder = path.normalize(path.join(__dirname, '../public/'));
const CWD = path.normalize(path.join(__dirname, '../'));
const debug = _dbug('socket');
const MemoryStore = _MMStore(session);
const DbAdapter = new JSONFile<Database>(path.join(CWD, 'db.json'));
const db = new Low(DbAdapter);
const dbChain = () => _.chain(db.data);
const dbRefresh = async () => {
   await db.write();
};
async function boot() {
   debug('Initializing server...');
   const app = express();
   await db.read();
   const serverUrl = execSync('gp url 3000').toString().trim();
   const server = http.createServer(app);
   const io = new Server<SocketEvents>(server, {
      cors: {
         origin: [serverUrl, 'https://admin.socket.io'],
      },
   });
   await new Promise((resolve: any) => server.listen(SERVER_PORT, resolve));
   debug('Server listening at %s', SERVER_PORT);

   io.on('connection', async socket => {
      const all = Array.from(await io.allSockets());
      dbChain()
         .get('users')
         .remove(v => !all.includes(v.id))
         .value();
      await dbRefresh();
      const user: IUserStore = {
         id: socket.id,
      };
      dbChain().get('users').push(user).value();
      await dbRefresh();
      debug('Connected: %s', socket.id);

      socket.on('SET:username', async username => {
         user.username = username;
         dbChain()
            .get('users')
            .find({ id: socket.id })
            .set('username', username)
            .value();
         await dbRefresh();
      });
      socket.on('SET:room', async (id, cb) => {
         socket.join(id);
         const _user = dbChain().get('users').find({ id: socket.id });
         if (!_user.isEmpty()) {
            _user.set('room', {
               previous: _user.value().room.current,
               current: id,
            });
            console.log(db.data.users);
            await dbRefresh();
            debug('%s joined room: %s', user.username || socket.id);
            if (cb) cb();
         }
      });
      socket.on('disconnect', async () => {
         dbChain().get('users').remove({ id: socket.id }).value();
         await dbRefresh();
         debug('Disconnected: %s', socket.id);
      });
   });

   return { app, server, io };
}

boot()
   .then(({ app, io }) => {
      app.use(
         logger(isDev ? 'dev' : 'common', {
            stream: {
               write: msg => debug(msg.trimEnd()),
            },
            skip: req => {
               if (req.url.match('/socket.io')) {
                  return true;
               }
               return false;
            },
         })
      );
      app.use(
         session({
            secret: 'socket-test',
            resave: true,
            saveUninitialized: true,
            genid: () => cuid(),
            cookie: {
               httpOnly: false,
               path: '/',
               sameSite: true,
               maxAge: 1000 * 60 * 60,
            },
            store: new MemoryStore({
               checkPeriod: 1000 * 60 * 60 * 2,
            }),
         })
      );
      app.use(express.static(publicFolder));
      app.get('/', (req, res) => {
         res.send('Hello World');
      });
   })
   .catch(console.log);
