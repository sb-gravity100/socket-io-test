import { Request, Router } from 'express';
import fs from 'fs';
import { ChatArgswithRoom } from '../types';

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
      const usernames = await fs.promises.readFile('./usernames.txt');
      names = usernames.toString().match(/\@[\w_.-]+/gim);
   }
   res.send(names);
});

route.get('/messages', async (req: NewRequest<{}, MessageQuery>, res) => {});

export default route;
