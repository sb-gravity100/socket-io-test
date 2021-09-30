import { Request, Router } from 'express';
import { Collection, CollectionChain, filter, ObjectChain } from 'lodash';
import { ChatArgswithRoom } from '../types';
import { db } from '../db';
import axios from 'axios';

type NewRequest<Body = {}, Query = any> = Request<
   Body,
   any,
   any,
   Query,
   Record<string, any>
>;

const route = Router();
let names: string[];

interface MessageQuery {
   before?: string;
   after?: string;
   username?: string;
   id?: string;
   room?: string;
   limit?: number;
}

route.get('/', (_req, res) => {
   res.send({ status: 'OK' });
});

route.get('/api-usernames', async (req, res) => {
   if (!names) {
      const url =
         'https://github.com/sb-gravity100/wallpapers-I-have-recently/blob/main/api/usernames-devs.txt?raw=true';
      const usernames = await axios.get<string>(url, {
         responseType: 'text',
      });
      names = usernames.data.match(/\@[\w_.-]+/gim);
   }
   res.send(names);
});

route.get('/messages', async (req: NewRequest<{}, MessageQuery>, res) => {
   await db.read();
   if (req.query) {
      const { username, room, id, limit, before, after } = req.query;
      let filtered:
         | CollectionChain<ChatArgswithRoom>
         | ObjectChain<ChatArgswithRoom> = db
         .chain()
         .get('messages')
         .filter((msg) => {
            if (before && after) {
               const beforeDate = new Date(before);
               const afterDate = new Date(after);
               if (beforeDate > afterDate) {
                  return false;
               }
               return (
                  new Date(msg.createdAt) < beforeDate &&
                  new Date(msg.createdAt) > afterDate
               );
            }
            if (before) {
               const beforeDate = new Date(before);
               return new Date(msg.createdAt) < new Date(before);
            }
            if (after) {
               const afterDate = new Date(after);
               return new Date(msg.createdAt) > afterDate;
            }
            return true;
         });
      if (limit) {
         filtered = filtered.take(limit);
      }
      if (username) {
         filtered = filtered.filter({ username });
      }
      if (id) {
         let f: any = filtered;
         f = filtered.find({ id });
         filtered = f;
      }

      return res.send(filtered.value());
   }
   res.send(db.data);
});

export default route;
