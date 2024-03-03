import { z } from "zod"

import { db } from "@/lib/db"

/**
 * Schema object for parsing id from URL for all methods
 */
const routeContextSchema = z.object({
  params: z.object({
    todoId: z.string(),
  }),
})

/**
 * Schema object for parsing status from body
 * Method: PATCH
 */
const patchStatus = z.object({
  status: z.number(),
})

/**
 * Schema object for parsing content from body
 * Method: PUT
 */
const putName = z.object({
  todoName: z.string(),
})

/**
 * Delete todo item from database
 *
 * Method: DELETE
 * @param req
 * @param context
 * @returns
 */
export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)

    if (!(await checkTodoIsAvailable(params.todoId))) {
      return new Response(null, { status: 403 })
    }

    const data = await db.todo.delete({
      where: {
        id: params.todoId,
      },
    })

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

/**
 * Update todo status based on id
 *
 * Method: PATCH
 * @param req
 * @param context
 * @returns
 */
export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)

    if (!(await checkTodoIsAvailable(params.todoId))) {
      return new Response(null, { status: 403 })
    }

    const json = await req.json()
    const { status } = patchStatus.parse(json)

    const data = await db.todo.update({
      where: {
        id: params.todoId,
      },
      data: {
        status,
      },
    })

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

/**
 * Update todo content based on id
 *
 * Method: PUT
 * @param req
 * @param context
 * @returns
 */
export async function PUT(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)
    if (!(await checkTodoIsAvailable(params.todoId))) {
      return new Response(null, { status: 403 })
    }

    const json = await req.json()
    const { todoName } = putName.parse(json)

    const data = await db.todo.update({
      where: {
        id: params.todoId,
      },
      data: {
        todoName,
      },
    })

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

/**
 * Checking todo item is available in table based on id
 *
 * @param todoId
 * @returns
 */
async function checkTodoIsAvailable(todoId: string) {
  const count = await db.todo.count({
    where: {
      id: todoId,
    },
  })

  return count > 0
}
