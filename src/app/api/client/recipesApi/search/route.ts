import { NextResponse } from 'next/server';
import axios from 'axios';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { parseStringPromise } from 'xml2js';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('query'); // User input (e.g., "high-protein breakfast")
    const healthGoal = url.searchParams.get('healthGoal'); // Health goal like "high-protein"

    // Ensure valid input
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required.' }, { status: 400 });
    }

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
    const requestData = {
      url: 'https://platform.fatsecret.com/rest/server.api',
      method: 'GET',
      data: {
        method: 'recipes.search',
        search_expression: query,
        max_results: 1,
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
      description: recipe.recipe_description[0] || 'No description available.',
      ingredients: recipe.ingredients[0].ingredient,
      preparationTime: recipe.preparation_time[0] || 'Unknown',
      cookingTime: recipe.cooking_time[0] || 'Unknown',
      url: recipe.recipe_url[0],
      nutrition: {
        calories: parseFloat(recipe.recipe_description[0].match(/Calories: (\d+)kcal/)?.[1] || '0'),
        protein: parseFloat(recipe.recipe_description[0].match(/Protein: (\d+)g/)?.[1] || '0'),
        carbs: parseFloat(recipe.recipe_description[0].match(/Carbs: (\d+)g/)?.[1] || '0'),
        fat: parseFloat(recipe.recipe_description[0].match(/Fat: (\d+)g/)?.[1] || '0'),
      },
    }));

    // Return the recipe(s) as a response
    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Recipe search error:', error);
    return NextResponse.json(
      { error: 'Failed to search recipes' },
      { status: 500 }
    );
  }
}
