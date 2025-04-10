import { prisma } from '../../../lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const { text, parentOptionId = null, isFinal = false, options = [] } = body;

    // Create the question
    const question = await prisma.questionNode.create({
      data: {
        text,
        isFinal,
      }
    });

    // If there's a parent option, update its nextId to point to this question
    if (parentOptionId) {
      await prisma.option.update({
        where: { id: parentOptionId },
        data: { nextId: question.id }
      });
    }

    // Create options
    if (options.length > 0) {
      for (const option of options) {
        await prisma.option.create({
          data: {
            label: option.label,
            questionId: question.id,
            nextId: null // This will be set later when creating child questions
          }
        });
      }
    }

    // Fetch the complete question with all relations
    const completeQuestion = await prisma.questionNode.findUnique({
      where: { id: question.id },
      include: {
        options: {
          include: {
            next: true
          }
        }
      }
    });

    return Response.json({ success: true, question: completeQuestion }, { status: 201 });
  } catch (error) {
    console.error('Error creating question node:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
} 