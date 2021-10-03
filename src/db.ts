import Datastore from 'nedb-promises'
import path from 'path'

export const socketDb = new Datastore({
   filename: path.join(process.cwd(), 'db/socket.nedb'),
   // timestampData: true
})
