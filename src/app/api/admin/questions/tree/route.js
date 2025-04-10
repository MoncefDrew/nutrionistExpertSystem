import { prisma } from '../../../../../lib/prisma';

export async function GET() {
  try {
    // Fetch all root questions (questions with no parent)
    const rootQuestions = await prisma.questionNode.findMany({
      where: {
        parentId: null
      },
      include: {
        options: {
          include: {
            next: {
              include: {
                options: true
              }
            }
          }
        }
      }
    });

    return Response.json(rootQuestions);
  } catch (error) {
    console.error('Error fetching question tree:', error);
    return Response.json(
      { error: "Failed to fetch question tree" },
      { status: 500 }
    );
  }
} 