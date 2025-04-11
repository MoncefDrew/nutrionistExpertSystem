import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const { userId, ...mealPlanData } = data;

    // Check if a meal plan already exists for the user
    const existingMealPlan = await prisma.mealPlan.findUnique({
      where: { userId: userId },
      select: {
        id: true,
        userId: true,
        planType: true,
        mealsPerDay: true,
        breakfast: true,
        lunch: true,
        dinner: true,
        snacks: true,
      }
    });

    if (existingMealPlan) {
      // Update existing meal plan
      const updatedMealPlan = await prisma.mealPlan.update({
        where: { userId: userId },
        data: {
          planType: mealPlanData.planType,
          mealsPerDay: mealPlanData.mealsPerDay,
          breakfast: mealPlanData.breakfast,
          lunch: mealPlanData.lunch,
          dinner: mealPlanData.dinner,
          snacks: mealPlanData.snacks,
        },
      });
      return NextResponse.json(updatedMealPlan);
    } else {
      // Create new meal plan
      const newMealPlan = await prisma.mealPlan.create({
        data: {
          userId: userId,
          planType: mealPlanData.planType,
          mealsPerDay: mealPlanData.mealsPerDay,
          breakfast: mealPlanData.breakfast,
          lunch: mealPlanData.lunch,
          dinner: mealPlanData.dinner,
          snacks: mealPlanData.snacks,
        },
      });
      return NextResponse.json(newMealPlan);
    }
  } catch (error) {
    console.error('Error saving meal plan:', error);
    return NextResponse.json({ error: 'Failed to save meal plan' }, { status: 500 });
  }
}


