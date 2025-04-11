import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId } = data;
    console.log("user", userId);

    if (!userId) {
      return NextResponse.json(
        { error: 'No user ID provided' },
        { status: 400 }
      );
    }

    // Verify user exists in database
    const dbUser = await prisma.user.findUnique({
      where: {
        id: parseInt(userId) // Make sure to parse the ID if it's a number
      }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Check if health profile already exists
    const existingHealth = await prisma.health.findUnique({
      where: {
        userId: parseInt(userId)
      }
    });

    let healthProfile;
    if (existingHealth) {
      // Update existing profile
      healthProfile = await prisma.health.update({
        where: {
          userId: parseInt(userId)
        },
        data: {
          age: data.age,
          gender: data.gender,
          weight: data.weight,
          height: data.height,
          goal: data.goal,
          activityLevel: data.activityLevel,
          dietaryRestrictions: data.dietaryRestrictions,
          allergies: data.allergies,
        },
      });
    } else {
      // Create new profile
      healthProfile = await prisma.health.create({
        data: {
          userId: parseInt(userId),
          age: data.age,
          gender: data.gender,
          weight: data.weight,
          height: data.height,
          goal: data.goal,
          activityLevel: data.activityLevel,
          dietaryRestrictions: data.dietaryRestrictions,
          allergies: data.allergies,
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: healthProfile
    });
    
  } catch (error) {
    console.error('Health data creation error:', error);
    return NextResponse.json(
      { error: 'Failed to save health data: ' + error.message },
      { status: 500 }
    );
  }
}