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
    const requestData = {
      url: 'https://platform.fatsecret.com/rest/server.api',
      method: 'GET',
      data: {
        method: 'foods.search',
        search_expression: query,
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
    if (!parsedData || !parsedData.foods || !parsedData.foods.food) {
      return NextResponse.json({ meals: [] }); // Return an empty array if no meals found
    }

    // Transform FatSecret response to your app's format
    const meals = parsedData.foods.food.map((food: any) => ({
      id: food.food_id[0],
      name: food.food_name[0],
      description: food.food_description[0],
      nutritionInfo: {
        calories: parseFloat(food.food_description[0].match(/Calories: (\d+)kcal/)?.[1] || '0'),
        protein: parseFloat(food.food_description[0].match(/Protein: (\d+)g/)?.[1] || '0'),
        carbs: parseFloat(food.food_description[0].match(/Carbs: (\d+)g/)?.[1] || '0'),
        fat: parseFloat(food.food_description[0].match(/Fat: (\d+)g/)?.[1] || '0'),
      }
    }));

    return NextResponse.json({ meals });
  } catch (error) {
    console.error('Meal search error:', error);
    return NextResponse.json(
      { error: 'Failed to search meals' },
      { status: 500 }
    );
  }
}
