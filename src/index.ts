import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import 'express-async-errors';
import http from 'http';
import path from 'path';
import _dbug from 'debug';
import logger from 'morgan';
import session from 'express-session';
import cuid from 'cuid';
import _MMStore from 'memorystore';
import { Server } from 'socket.io';
import * as fs from 'fs/promises';
import { SocketEvents } from './events-map';
import _ from 'lodash';
import { execSync } from 'child_process';
import {
   adjectives,
   colors,
   names,
   uniqueNamesGenerator,
} from 'unique-names-generator';
import { randomInt } from 'crypto';
import { db } from './db';
import ApiRoute from './routes/api';

const { SERVER_PORT, NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';
const publicFolder = path.normalize(path.join(__dirname, '../public/'));
const CWD = path.normalize(path.join(__dirname, '../'));
const debug = _dbug('socket');
const MemoryStore = _MMStore(session);

// function multiplyNames(arr: string[]) {
//    return _.chain(arr)
//       .map(e => [e, _.camelCase(e), _.kebabCase(e), _.snakeCase(e)])
//       .flattenDeep()
//       .value();
// }

async function boot() {
   await db.read();
   db.data = { users: [], messages: [] };
   debug('Initializing server...');
   // const usernames = (await fs.readFile(path.join(CWD, 'usernames.txt')))
   //    .toString('utf-8')
   //    .split(/\n/i);

   function getUserbyID(id: string) {
      const user = db.chain().get('users').find({ id });
      return user;
   }
   function uniqueUsername() {
      return (
         'Anonymous-' +
         uniqueNamesGenerator({
            dictionaries: [colors, adjectives, names],
            length: randomInt(2, 3),
            style: 'capital',
            separator: Math.random() < 0.5 ? '' : '_',
         })
      );
   }

   const app = express();
   const serverUrl = execSync('gp url 3000').toString().trim();
   const server = http.createServer(app);
   // console.log(usernames);
   const io = new Server<SocketEvents>(server, {
      cors: {
         origin: [serverUrl, 'https://admin.socket.io'],
      },
   });

   const cleanDb = async () => {
      const all = Array.from(await io.allSockets());
      db.chain()
         .get('users')
         .remove(v => !all.includes(v.id));
      await db.write();
   };

   await new Promise((resolve: any) => server.listen(SERVER_PORT, resolve));
   debug('Server listening at %s', SERVER_PORT);
   io.of('/').adapter.on('join-room', (room, id) => {
      debug('%s joined room: %s', id, room);
   });

   io.on('connection', async socket => {
      try {
         await cleanDb();
         db.chain()
            .get('users')
            .push({
               id: socket.id,
               username: uniqueUsername(),
               room: {
                  current: socket.id,
               },
            })
            .value();
         await cleanDb();
         const user = db.chain().get('users').find({ id: socket.id }).value();
         socket.emit('GET:user', user);
         debug('Connected: %s', socket.id);

         socket.on('SET:username', async (username, cb) => {
            if (cb) cb();
            const user = getUserbyID(socket.id);
            const room = user.value().room.current;
            const name = user.value().username;
            if (name === username) {
               return;
            }
            user.set('username', username).value();
            await cleanDb();
            socket.broadcast.to(room).emit('chat', {
               username: `${room} bot`,
               payload: `${
                  name || 'Anonymous'
               } set his username to ${username}!`,
               createdAt: new Date(),
               id: cuid(),
            });
            debug('Set username `%s` for: %s', username, user.value().id);
         });
         socket.on('SET:room', async (id, cb) => {
            socket.join(id);
            const _user = getUserbyID(socket.id);
            const username = _user.value()?.username || uniqueUsername();
            if (_user.value()) {
               if (cb) cb();
               _user
                  .set('room', {
                     previous: _user.value().room.current,
                     current: id,
                  })
                  .value();
               socket.broadcast.to(id).emit('chat', {
                  username: `${id} bot`,
                  payload: `${username || 'Anonymous'} just joined the room!`,
                  createdAt: new Date(),
                  id: cuid(),
                  room: id,
               });
               await cleanDb();
            }
         });

         socket.on('message', async (msg, cb) => {
            const user = getUserbyID(socket.id);
            const room = user.value().room;
            const username = user.value().username;
            if (cb) cb();
            if (typeof msg === 'string') {
               msg = {
                  id: cuid(),
                  username: username,
                  payload: msg,
                  createdAt: new Date(),
                  room: room.current,
               };
            }
            db.chain()
               .get('messages')
               .push({ ...msg, room: room.current })
               .value();
            await cleanDb();
            socket.broadcast.to(room.current).emit('chat', msg);
            // debug('%s: %s', user.value().username, msg.payload);
         });

         socket.on('disconnect', async () => {
            db.chain().get('users').remove({ id: socket.id }).value();
            await cleanDb();
            debug('Disconnected: %s', socket.id);
         });
      } catch (e) {
         console.log(e);
      }
   });

   return { app, server, io, db };
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
      // app.get('/', (req, res) => {
      //    res.send('Hello World');
      // });

      app.use('/api', ApiRoute);
   })
   .catch(console.log);
