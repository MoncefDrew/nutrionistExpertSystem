import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const questions = await prisma.questionNode.findMany({
      include: {
        options: true
      }
    });

    return Response.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return Response.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
} 