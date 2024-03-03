import { z } from "zod"

import { db } from "@/lib/db"

const jwt = require("jsonwebtoken")

const loginSchema = z.object({
  username: z.string(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = loginSchema.parse(json)

    const user = await db.user.findFirst({
      where: {
        email: body.username,
      },
    })

    if (!user) {
      const payload = {
        message: "User not found",
      }
      return new Response(JSON.stringify(payload), { status: 422 })
    } else {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY)

      return new Response(
        JSON.stringify({
          statusCode: "0000",
          token: accessToken,
          ...user,
        })
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
