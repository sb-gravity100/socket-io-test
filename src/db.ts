import _, { ObjectChain } from 'lodash';
import { JSONFile, Low } from 'lowdb';
import path from 'path';
import { ChatArgswithRoom, IUserStore } from './types';

// interface LowDB<T = { [key: string]: any; [num: number]: any }> extends Low<T> {
//    chain?(): ObjectChain<T>;
// }

class LowDB<T = Record<string, any>> extends Low<T> {
   constructor(filename: string, defaultValue?: T) {
      const adapter = new JSONFile<T>(filename);
      super(adapter);
      if (defaultValue) {
         this.data = defaultValue;
         this.write();
      }
   }

   chain(): ObjectChain<T> {
      return _.chain(this.data) as any;
   }
}

interface Database {
   users: IUserStore[];
   messages: ChatArgswithRoom[];
}
const dbPath = path.join(process.cwd(), 'db.json');
export const db = new LowDB<Database>(dbPath, {
   messages: [],
   users: [],
});
