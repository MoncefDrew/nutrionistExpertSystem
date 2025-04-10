import { prisma } from '../../../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Find all questions that are connected through options
    const children = await prisma.questionNode.findMany({
      where: {
        OR: [
          { parentId: id },
          {
            id: {
              in: await prisma.option.findMany({
                where: { questionId: id },
                select: { nextId: true }
              }).then(options => options.map(opt => opt.nextId).filter(Boolean))
            }
          }
        ]
      },
      include: {
        options: {
          include: {
            next: true
          }
        }
      }
    });

    return Response.json(children);
  } catch (error) {
    console.error('Error fetching children:', error);
    return Response.json(
      { error: "Failed to fetch children" },
      { status: 500 }
    );
  }
} 