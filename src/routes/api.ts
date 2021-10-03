import { Request, Router } from 'express';
import { Collection, CollectionChain, filter, ObjectChain } from 'lodash';
import { ChatArgswithRoom } from './types';
import { db } from '../db';

type NewRequest<Body = {}, Query = any> = Request<
   Body,
   any,
   any,
   Query,
   Record<string, any>
>;

const route = Router();

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

route.get('/messages', async (req: NewRequest<{}, MessageQuery>, res) => {
   
});

export default route;
