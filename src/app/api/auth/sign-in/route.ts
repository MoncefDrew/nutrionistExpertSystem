import { prisma } from '../../../../lib/prisma';
import { comparePasswords } from '../../../../lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.email || !body.password) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePasswords(body.password, user.password);

    if (!isValidPassword) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return both token and user data
    return Response.json({
      token: "your-jwt-token",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username,
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
