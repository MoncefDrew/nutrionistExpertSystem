
import { prisma } from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, rating, userId ,username} = await req.json();

    if (!message || !rating || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        message,
        rating,
        userId,
        username,
      },
    });

    return NextResponse.json({ success: true, feedback }, { status: 200 });

  } catch (error: any) {
    console.error("🚨 Feedback Error:", error.message || error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

