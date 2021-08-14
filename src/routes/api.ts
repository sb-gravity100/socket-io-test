import { Request, Router } from 'express';
import { db } from '../db';

type NewRequest<Body = {}, Query = any> = Request<
   Body,
   any,
   any,
   Query,
   Record<string, any>
>;

const route = Router();

route.get('/messages', async (req, res) => {
   await db.read();
});

export default route;
