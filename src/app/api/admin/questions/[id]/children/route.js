import { prisma } from '../../../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    if (!params?.id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    const id = params.id;

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

    if (!children || children.length === 0) {
      // If no children found, try to find the question itself
      const question = await prisma.questionNode.findUnique({
        where: { id },
        include: {
          options: {
            include: {
              next: true
            }
          }
        }
      });

      return Response.json(question ? [question] : []);
    }

    return Response.json(children);
  } catch (error) {
    console.error('Error fetching children:', error);
    return Response.json(
      { error: "Failed to fetch children" },
      { status: 500 }
    );
  }
} 