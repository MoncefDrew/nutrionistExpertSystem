import { NextResponse } from 'next/server';
import axios from 'axios';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { parseStringPromise } from 'xml2js';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    const mealType = url.searchParams.get('mealType');
    const planType = url.searchParams.get('planType');

    // Configure OAuth
    const oauth = new OAuth({
      consumer: {
        key: process.env.FATSECRET_CONSUMER_KEY,
        secret: process.env.FATSECRET_CONSUMER_SECRET,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(baseString, key) {
        return crypto.createHmac('sha1', key).update(baseString).digest('base64');
      },
    });

    // Prepare the request parameters
    let searchExpression = query;
    
    // If `mealType` or `planType` is provided, modify the search query
    if (mealType) {
      searchExpression += ` ${mealType}`;
    }
    if (planType) {
      searchExpression += ` ${planType}`;
    }

    const requestData = {
      url: 'https://platform.fatsecret.com/rest/server.api',
      method: 'GET',
      data: {
        method: 'recipes.search',
        search_expression: searchExpression,
        max_results: 10,
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
    if (!parsedData || !parsedData.recipes || !parsedData.recipes.recipe) {
      return NextResponse.json({ recipes: [] }); // Return an empty array if no recipes found
    }

    // Transform FatSecret response to your app's format
    const recipes = parsedData.recipes.recipe.map((recipe: any) => ({
      id: recipe.recipe_id[0],
      name: recipe.recipe_name[0],
      description: recipe.recipe_description[0],
      ingredients: recipe.recipe_ingredients[0],
      instructions: recipe.recipe_instructions[0],
      nutritionInfo: {
        calories: parseFloat(recipe.recipe_nutrition[0]?.match(/Calories: (\d+)kcal/)?.[1] || '0'),
        protein: parseFloat(recipe.recipe_nutrition[0]?.match(/Protein: (\d+)g/)?.[1] || '0'),
        carbs: parseFloat(recipe.recipe_nutrition[0]?.match(/Carbs: (\d+)g/)?.[1] || '0'),
        fat: parseFloat(recipe.recipe_nutrition[0]?.match(/Fat: (\d+)g/)?.[1] || '0'),
      },
    }));

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Recipe search error:', error);
    return NextResponse.json(
      { error: 'Failed to search recipes' },
      { status: 500 }
    );
  }
}
