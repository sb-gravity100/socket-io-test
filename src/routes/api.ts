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
   
});

export default route;
