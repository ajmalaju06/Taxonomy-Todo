import { db } from "./db"

export const saveTodo = (params: any) => {}

export const getTodo = async () => {
  return await db.todo.findMany()
}
