import { z } from "zod"

import { db } from "@/lib/db"

const postCreateSchema = z.object({
  todoName: z.string(),
  status: z.number(),
})

/**
 * Retrieve all the data from database using prisma
 *
 * Method: GET
 * @returns
 */
export async function GET() {
  try {
    const todos = await db.todo.findMany()

    return new Response(JSON.stringify(todos))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

/**
 * Save todo to the database
 *
 * Method: POST
 * @param req
 * @returns
 */
export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = postCreateSchema.parse(json)

    const post = await db.todo.create({
      data: {
        todoName: body.todoName,
        status: body.status,
      },
    })

    return new Response(JSON.stringify(post))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
