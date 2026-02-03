import { openDB } from 'idb'

export const dbPromise = openDB('rmu-records-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('records')) {
      db.createObjectStore('records', {
        keyPath: 'id',
        autoIncrement: true,
      })
    }
  },
})
