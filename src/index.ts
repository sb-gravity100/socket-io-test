require('dotenv').config();
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
import Datastore from 'nedb-promises';

interface IUserStore {
   socketId: string;
   username?: string;
   _id?: string;
}

const { SERVER_PORT, NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';
const publicFolder = path.normalize(path.join(__dirname, '../public/'));
const CWD = path.normalize(path.join(__dirname, '../'));
const debug = _dbug('socket');
const MemoryStore = _MMStore(session);
const DB = Datastore.create({
   autoload: true,
   filename: path.join(CWD, 'data.db'),
});
async function boot() {
   debug('Initializing server...');
   const app = express();
   const serverUrl = execSync('gp url 3000').toString().trim();
   const server = http.createServer(app);
   const io = new Server<SocketEvents>(server, {
      cors: {
         origin: [serverUrl, 'https://admin.socket.io'],
      },
   });
   // await DB.load();
   await DB.remove(
      {},
      {
         multi: true,
      }
   );
   DB.ensureIndex({
      fieldName: 'socketId',
      unique: true,
   });
   await new Promise((resolve: any) => server.listen(SERVER_PORT, resolve));
   debug('Server listening at %s', SERVER_PORT);

   io.on('connection', socket => {
      socket.join('public');
      const user: IUserStore = {
         socketId: socket.id,
         username: '',
      };
      DB.insert(user)
         .then(_user => {
            user._id = _user._id;
            debug('Connected: %s', socket.id);
         })
         .catch(() => {});

      socket.on('SET:username', username => {
         user.username = username;
         DB.update({ socketId: socket.id }, { username: username }).then(() => {
            // debug('SET username %s for: %s', username, socket.id);
         });
      });
      socket.on('disconnect', async () => {
         const s = await DB.remove({ _id: user._id }, {});
         debug('Disconnected: %s', socket.id);
         debug('Removed %s users!', s);
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
