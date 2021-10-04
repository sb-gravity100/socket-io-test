import { DataStoreOptions } from 'nedb';
import Datastore from 'nedb-promises';
import path from 'path';

function createDatastore(
   name: string,
   root: string = process.cwd(),
   options?: DataStoreOptions
) {
   return new Datastore({
      filename: path.join(root, name + '.nedb'),
      ...options,
   });
}

export const socket = createDatastore('socket', './db');

export const messages = createDatastore('messages', './db');
