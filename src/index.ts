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

interface UserList {
   id: string;
   username?: string;
   joinedAt: Date;
}

interface MsgList {
   id?: string;
   msg: string;
   createdAt: Date;
}

const { SERVER_PORT, NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';
const publicFolder = path.normalize(path.join(__dirname, '../public/'));
const CWD = path.normalize(path.join(__dirname, '../'));
const debug = _dbug('socket');
const MemoryStore = _MMStore(session);
const users: UserList[] = [];
const msgs: MsgList[] = [];
const whitelist: string[] = [];
whitelist.push(execSync('gp url 3000').toString().trim());

async function boot() {
   debug('Initializing server...');
   const app = express();
   const server = http.createServer(app);
   const io = new Server(server, {
      cors: {
         origin: function (origin, cb) {
            if (whitelist.indexOf(origin || '') !== -1) {
               cb(null, true);
            } else {
               cb(new Error('Not allowed by CORS'));
            }
         },
      },
   });
   await new Promise((resolve: any) => server.listen(SERVER_PORT, resolve));
   debug('Server listening at %s', SERVER_PORT);

   io.on('connection', socket => {
      const user = {
         id: socket.id,
         joinedAt: new Date(),
      };
      users.push(user);
      io.emit('usersList', users);
      socket.broadcast.emit('userJoin', socket.id);
      debug('Connected: %s', socket.id);

      socket.on('chat', (msg, id) => {
         msgs.push({
            msg,
            id,
            createdAt: new Date(),
         });
         socket.broadcast.emit('receiveMsg', msg, id);
      });

      socket.on('fetchMsg', () => {
         // _.chain(msgs)
         //    .orderBy('createdAt', 'desc')
         //    .each(msgs => {
         //       if (new Date(msgs.createdAt) < new Date(user.joinedAt)) {
         //          socket.local.emit('receiveMsg', msgs.msg, msgs.id, true);
         //       }
         //    });
         const newMsg = [...msgs];
         newMsg
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .forEach(msg => {
               if (new Date(msg.createdAt) < new Date(user.joinedAt)) {
                  socket
                     .in(socket.id)
                     .emit('receiveMsg', msg.msg, msg.id, true);
               }
            });
      });

      socket.on('disconnect', () => {
         socket.emit('userExit', socket.id);
         const idIndex = users.findIndex(user => socket.id === user.id);
         users.splice(idIndex, 1);
         io.emit('usersList', users);

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
