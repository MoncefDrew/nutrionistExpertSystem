// app/api/client/mealsApi/generatePlan/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { parseStringPromise } from 'xml2js';

// Helper function to search foods using OAuth 1.0a
async function searchFoods(query: string, planType: string) {
  try {
    // Configure OAuth
    const oauth = new OAuth({
      consumer: {
        key: process.env.FATSECRET_CONSUMER_KEY || '',
        secret: process.env.FATSECRET_CONSUMER_SECRET || '',
      },
      signature_method: 'HMAC-SHA1',
      hash_function(baseString, key) {
        return crypto.createHmac('sha1', key).update(baseString).digest('base64');
      },
    });

    // Modify query based on diet type
    let modifiedQuery = query;
    
    switch (planType) {
      case 'vegan':
        modifiedQuery = `${query} vegan`;
        break;
      case 'diabetes':
        modifiedQuery = `${query} low glycemic`;
        break;
      case 'hypertension':
        modifiedQuery = `${query} low sodium`;
        break;
      case 'iron-deficiency':
        modifiedQuery = `${query} iron rich`;
        break;
      case 'pregnant':
        modifiedQuery = `${query} folate rich`;
        break;
      case 'ibs':
        modifiedQuery = `${query} low fodmap`;
        break;
      default:
        break;
    }

    // Prepare the request parameters
    const requestData = {
      url: 'https://platform.fatsecret.com/rest/server.api',
      method: 'GET',
      data: {
        method: 'foods.search',
        search_expression: modifiedQuery,
        max_results: 10,
        format: 'xml',
      },
    };

    // Generate OAuth parameters
    const oauthData = oauth.authorize(requestData);

    // Make request to FatSecret API
    const response = await axios.get(requestData.url, {
      params: {
        ...requestData.data,
        ...oauthData,
        oauth_signature: oauthData.oauth_signature, // Ensure the signature is included
      },
    });

    // Parse the XML response
    const parsedData = await parseStringPromise(response.data);

    // Check if the response structure is valid
    if (!parsedData || !parsedData.foods || !parsedData.foods.food) {
      return []; // Return an empty array if no meals found
    }

    // Transform FatSecret response to your app's format
    const foods = Array.isArray(parsedData.foods.food) 
      ? parsedData.foods.food 
      : [parsedData.foods.food];

    return foods.map((food: any) => ({
      id: food.food_id[0],
      name: food.food_name[0],
      description: food.food_description?.[0] || '',
      nutritionInfo: {
        calories: parseFloat(food.food_description?.[0]?.match(/Calories: (\d+)kcal/)?.[1] || '0'),
        protein: parseFloat(food.food_description?.[0]?.match(/Protein: (\d+)g/)?.[1] || '0'),
        carbs: parseFloat(food.food_description?.[0]?.match(/Carbs: (\d+)g/)?.[1] || '0'),
        fat: parseFloat(food.food_description?.[0]?.match(/Fat: (\d+)g/)?.[1] || '0'),
      }
    }));
  } catch (error) {
    console.error(`Error searching for foods with query ${query}:`, error);
    return [];
  }
}

// Helper to determine meal options
function getMealTypeOptions(mealType: string) {
  switch (mealType) {
    case 'breakfast':
      return ['breakfast', 'cereal', 'oatmeal', 'eggs', 'toast', 'yogurt'];
    case 'lunch':
      return ['lunch', 'sandwich', 'salad', 'soup', 'wrap'];
    case 'dinner':
      return ['dinner', 'chicken', 'fish', 'beef', 'stir fry', 'pasta'];
    case 'snacks':
      return ['snack', 'nuts', 'fruit', 'vegetables', 'yogurt'];
    default:
      return ['meal'];
  }
}

// Helper to generate placeholder meals with proper nutrition info and description
function generatePlaceholderMeal(mealType: string, planType: string, caloriesTarget: number, index: number) {
  // Calculate macronutrients
  const protein = Math.round(caloriesTarget * 0.25 / 4); // 25% protein (4 cal/g)
  const fat = Math.round(caloriesTarget * 0.3 / 9);     // 30% fat (9 cal/g)
  const carbs = Math.round(caloriesTarget * 0.45 / 4);  // 45% carbs (4 cal/g)
  
  // Generate meal name based on meal type and diet plan
  let mealName = '';
  let description = '';
  
  if (mealType === 'breakfast') {
    const breakfastOptions = [
      'Oatmeal with Berries',
      'Greek Yogurt with Granola',
      'Avocado Toast with Eggs',
      'Fruit and Nut Smoothie',
      'Whole Grain Cereal with Milk'
    ];
    mealName = breakfastOptions[index % breakfastOptions.length];
  } else if (mealType === 'lunch') {
    const lunchOptions = [
      'Grilled Chicken Salad',
      'Quinoa Bowl with Vegetables',
      'Turkey and Avocado Wrap',
      'Lentil Soup with Whole Grain Bread',
      'Mediterranean Plate with Hummus'
    ];
    mealName = lunchOptions[index % lunchOptions.length];
  } else if (mealType === 'dinner') {
    const dinnerOptions = [
      'Baked Salmon with Roasted Vegetables',
      'Chicken Stir-Fry with Brown Rice',
      'Turkey Meatballs with Zucchini Noodles',
      'Bean and Vegetable Chili',
      'Grilled Tofu with Quinoa and Broccoli'
    ];
    mealName = dinnerOptions[index % dinnerOptions.length];
  } else { // snacks
    const snackOptions = [
      'Apple with Almond Butter',
      'Greek Yogurt with Honey',
      'Hummus with Carrot Sticks',
      'Mixed Nuts and Dried Fruit',
      'Cottage Cheese with Berries'
    ];
    mealName = snackOptions[index % snackOptions.length];
  }
  
  // Modify based on diet type
  if (planType === 'vegan') {
    mealName = mealName.replace('Chicken', 'Tofu')
                       .replace('Turkey', 'Tempeh')
                       .replace('Salmon', 'Grilled Portobello')
                       .replace('Greek Yogurt', 'Coconut Yogurt')
                       .replace('Milk', 'Almond Milk')
                       .replace('Eggs', 'Scrambled Tofu');
  } else if (planType === 'diabetes') {
    mealName = mealName.replace('with Granola', 'with Low-Glycemic Berries')
                       .replace('Fruit', 'Low-Glycemic Fruit')
                       .replace('Brown Rice', 'Cauliflower Rice');
  } else if (planType === 'hypertension') {
    mealName = 'Low-Sodium ' + mealName.replace('with Salt', 'with Herbs');
  }
  
  // Create formatted description with nutrition info
  description = `A healthy ${mealType} option suitable for ${planType} diet plan.\nCalories: ${Math.round(caloriesTarget)}kcal | Protein: ${protein}g | Carbs: ${carbs}g | Fat: ${fat}g`;
  
  return {
    id: `plan-${mealType}-${index}-${Date.now()}`,
    name: mealName,
    description: description,
    nutritionInfo: {
      calories: Math.round(caloriesTarget),
      protein: protein,
      carbs: carbs,
      fat: fat
    }
  };
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { planType, mealsPerDay, healthData } = data;
    
    // Determine caloric and nutrition needs based on health data
    // This is a simplified example - you'd want to use a more sophisticated calculation
    let dailyCalories = 2000;  // Default
    if (healthData) {
      const { weight, height, age, gender, activityLevel } = healthData;
      
      // Basic BMR calculation (Harris-Benedict Equation)
      if (gender === 'male') {
        dailyCalories = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        dailyCalories = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
      
      // Activity multiplier
      const activityMultipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9
      };
      
      dailyCalories *= activityMultipliers[activityLevel] || 1.2;
      
      // Adjust based on diet type
      if (planType === 'diabetes') {
        dailyCalories *= 0.9; // Slightly lower calories for diabetes
      }
    }
    
    // Calculate calories per meal
    let caloriesPerMeal: Record<string, number> = {};
    if (mealsPerDay === 3) {
      caloriesPerMeal = {
        breakfast: dailyCalories * 0.25,
        lunch: dailyCalories * 0.35,
        dinner: dailyCalories * 0.4,
        snacks: 0
      };
    } else if (mealsPerDay === 4) {
      caloriesPerMeal = {
        breakfast: dailyCalories * 0.25,
        lunch: dailyCalories * 0.3,
        dinner: dailyCalories * 0.3,
        snacks: dailyCalories * 0.15
      };
    } else if (mealsPerDay === 5) {
      caloriesPerMeal = {
        breakfast: dailyCalories * 0.2,
        lunch: dailyCalories * 0.25,
        dinner: dailyCalories * 0.25,
        snacks: dailyCalories * 0.3 // Split between multiple snacks
      };
    }
    
    // Generate meal plan
    const mealPlan: Record<string, any[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    };
    
    // For each meal type
    for (const mealType of Object.keys(mealPlan)) {
      if (mealType === 'snacks' && mealsPerDay < 4) continue;
      
      const mealOptions = getMealTypeOptions(mealType);
      
      // Get number of items to include
      let itemCount = 2; // Default
      if (mealType === 'breakfast') itemCount = 2;
      if (mealType === 'lunch') itemCount = 3;
      if (mealType === 'dinner') itemCount = 3;
      if (mealType === 'snacks') itemCount = mealsPerDay === 4 ? 1 : 2;
      
      // Try to fetch foods for each option until we have enough
      for (const option of mealOptions.slice(0, 3)) {
        if (mealPlan[mealType].length >= itemCount) break;
        
        const foods = await searchFoods(option, planType);
        
        // Filter foods to match caloric needs
        const targetCaloriesPerItem = caloriesPerMeal[mealType] / itemCount;
        
        const suitableFoods = foods
          .filter(food => {
            const calories = food.nutritionInfo.calories;
            // Accept foods that have some calories but are not excessively high
            return calories > 50 && calories < targetCaloriesPerItem * 1.5;
          })
          .slice(0, Math.ceil(itemCount / mealOptions.length));
        
        mealPlan[mealType].push(...suitableFoods);
      }
      
      // If we still don't have enough foods, add placeholder meals with realistic data
      if (mealPlan[mealType].length < itemCount) {
        const remainingCount = itemCount - mealPlan[mealType].length;
        for (let i = 0; i < remainingCount; i++) {
          const targetCaloriesPerItem = caloriesPerMeal[mealType] / itemCount;
          const placeholderMeal = generatePlaceholderMeal(
            mealType, 
            planType, 
            targetCaloriesPerItem, 
            i
          );
          mealPlan[mealType].push(placeholderMeal);
        }
      }
    }
    
    return NextResponse.json({ 
      success: true,
      mealPlan,
      dailyCalories,
      caloriesPerMeal
    });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate meal plan' },
      { status: 500 }
    );
  }
}