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
// import _ from 'lodash';
import { exec, execSync } from 'child_process';
import { SocketEvents } from './events-map';
const { SERVER_PORT, NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';
const publicFolder = path.normalize(path.join(__dirname, '../public/'));
const CWD = path.normalize(path.join(__dirname, '../'));
const debug = _dbug('socket');
const MemoryStore = _MMStore(session);
async function boot() {
   debug('Initializing server...');
   const app = express();
   const server = http.createServer(app);
   const io = new Server<SocketEvents>(server, {
      cors: {
         origin: [execSync('gp url 3000').toString().trim()],
      },
   });
   await new Promise((resolve: any) => server.listen(SERVER_PORT, resolve));
   debug('Server listening at %s', SERVER_PORT);

   io.on('connection', socket => {
      const user = {
         username: '',
         id: socket.id,
      };
      debug('Connected: %s', socket.id);

      socket.on('SET:username', username => {
         user.username = username;
      });
      socket.on('disconnect', () => {
         debug('Disconnected: %s', socket.id);
      });
   });

   return { app, server, io };
}

boot()
   .then(({ app }) => {
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
   .catch(debug);
