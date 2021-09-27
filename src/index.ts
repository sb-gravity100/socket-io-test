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
   NumberDictionary,
} from 'unique-names-generator';
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
   // db.data = { users: [], messages: [] };
   debug('Initializing server...');
   // const usernames = (await fs.readFile(path.join(CWD, 'usernames.txt')))
   //    .toString('utf-8')
   //    .split(/\n/i);

   function getUserbyID(id: string) {
      const user = db.chain().get('users').find({ id });
      return user;
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
         .remove((v) => !all.includes(v.id));
      await db.write();
   };

   await new Promise((resolve: any) => server.listen(SERVER_PORT, resolve));
   debug('Server listening at %s', SERVER_PORT);
   io.of('/').adapter.on('join-room', (room, id) => {
      debug('%s joined room: %s', id, room);
   });

   io.on('connection', async (socket) => {
      try {
         await cleanDb();
         db.chain()
            .get('users')
            .push({
               id: socket.id,
               room: {
                  current: socket.id,
               },
            })
            .value();
         await cleanDb();
         const user = db.chain().get('users').find({ id: socket.id }).value();
         debug('Connected: %s', socket.id);

         socket.on('disconnect', async () => {
            const users = db.chain().get('users');
            const user = users.find({ id: socket.id }).value();
            socket.broadcast.to(user?.room?.current).emit('chat', {
               username: `${user?.room?.current} bot`,
               payload: `[${user?.id || 'Anonymous'}] just left the room!`,
               createdAt: new Date(),
               id: cuid(),
               room: user?.room?.current,
            });
            users.remove({ id: socket.id }).value();
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
               write: (msg) => debug(msg.trimEnd()),
            },
            skip: (req) => {
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
