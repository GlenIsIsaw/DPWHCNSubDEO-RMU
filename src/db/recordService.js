import { dbPromise } from './recordsDB'

export const addRecord = async (record) => {
  const db = await dbPromise
  await db.add('records', record)
}

export const getAllRecords = async () => {
  const db = await dbPromise
  return await db.getAll('records')
}

export const deleteRecord = async (id) => {
  const db = await dbPromise
  await db.delete('records', id)
}
