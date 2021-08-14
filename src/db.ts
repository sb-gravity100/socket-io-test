import _, { ObjectChain } from 'lodash';
import { JSONFile, Low } from 'lowdb';
import path from 'path';
import { ChatArgswithRoom, IUserStore } from './events-map';

interface LowDB<T = { [key: string]: any; [num: number]: any }> extends Low<T> {
   chain?(): ObjectChain<T>;
}
interface Database {
   users: IUserStore[];
   messages: ChatArgswithRoom[];
}
const CWD = path.normalize(path.join(__dirname, '../'));
const adapter = new JSONFile<Database>(path.join(CWD, 'db.json'));
export const db: LowDB<Database> = new Low(adapter);
db.chain = () => _.chain(db.data);
