import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Extract user ID from the URL and parse it as an integer
    const url = new URL(request.url);
    const userIdStr = url.searchParams.get('userId');

    if (!userIdStr) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userId = parseInt(userIdStr, 10);
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    const healthData = await prisma.health.findFirst({
      where: {
        userId: userId  // Now userId is an integer
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ data: healthData });
  } catch (error) {
    console.error('Health data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health data: ' + error.message },
      { status: 500 }
    );
  }
}