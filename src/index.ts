import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import 'express-async-errors';
import http from 'http';
import path from 'path';
import _dbug from 'debug';
import logger from 'morgan';
import session from 'express-session';
// import cuid from 'cuid';
import _MMStore from 'memorystore';
import { Server } from 'socket.io';
// import * as fs from 'fs/promises';
import { SocketEvents } from './types';
import _ from 'lodash';
import { execSync } from 'child_process';
import * as db from './db';
import ApiRoute from './routes/api';
import cors from 'cors';

const { SERVER_PORT, NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';
const publicFolder = path.normalize(path.join(__dirname, '../public/'));
const CWD = path.normalize(path.join(__dirname, '../'));
const debug = _dbug('socket');
const MemoryStore = _MMStore(session);

async function boot() {
   debug('Initializing server...');

   const app = express();
   // const serverUrl = execSync('gp url 3000').toString().trim();
   const server = http.createServer(app);

   const io = new Server<SocketEvents>(server, {
      cors: {
         origin: '*',
      },
   });

   await new Promise<void>((resolve) => server.listen(SERVER_PORT, resolve));
   debug('Server listening at %s', SERVER_PORT);

   io.on('connection', async (socket) => {
      let user: any;
      debug('Connected: %s', socket.handshake.query.username);
      await db.socket.update(
         { _id: socket.handshake.query.id },
         {
            $set: {
               socket_id: socket.id,
               username: socket.handshake.query.username,
               online: true,
            },
         },
         {
            upsert: true,
         }
      );

      // socket.on()

      socket.on('disconnect', async () => {
         debug('Disconnected: %s', socket.handshake.query.username);
         await db.socket.update(
            { _id: socket.handshake.query.id },
            {
               $set: {
                  socket_id: null,
                  online: false,
               },
            }
         );
      });
   });

   return { app, server, io };
}

boot()
   .then(({ app, io }) => {
      app.use(cors());
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
            // genid: () => cuid(),
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
