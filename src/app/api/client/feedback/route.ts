// app/api/client/feedback/route.ts
import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    })

    return NextResponse.json(feedbacks)
  } catch (error) {
    console.error("Error fetching feedbacks:", error)
    return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 })
  }
}
