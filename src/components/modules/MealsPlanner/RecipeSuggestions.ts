import axios from 'axios';

export async function RecipeSuggestions(healthData: HealthData | null, input: string): Promise<string> {
  if (!healthData) return "Please provide your health profile to get personalized recipes.";

  const query = extractRecipeKeywords(input, healthData.goal);

  if (!query) return "Please specify a valid recipe query.";

  try {
    // Make a request to the Next.js API route for recipe suggestions
    const response = await axios.get(`/api/client/recipesApi/search?query=${encodeURIComponent(query)}&healthGoal=${encodeURIComponent(healthData.goal)}`);

    // Check if the response is successful
    if (!response.status) {
      return "Something went wrong while fetching the recipe. Please try again later.";
    }

    // Parse the response data
    const data = await response.data();

    // If no recipes were found
    if (!data.recipes || data.recipes.length === 0) {
      return `I couldn't find a recipe for "${query}". Try something else!`;
    }

    // If recipes are found, construct the response
    const recipe = data.recipes[0];
    return `🍽️ ${recipe.name}

              Description: ${recipe.description || "No description available."}

              Preparation Time:  ${recipe.preparationTime || "Unknown"}
              Cooking Time: ${recipe.cookingTime || "Unknown"}

              You can view the full recipe and nutritional info here: ${recipe.url}`;

  } catch (error) {
    console.error("Error fetching recipe suggestions:", error);
    return "Something went wrong while fetching the recipe. Please try again later.";
  }
}


function extractRecipeKeywords(input: string | null | undefined, goal: string): string {
  // Check if input is a valid string
  if (typeof input !== 'string') {
    throw new Error('Input must be a valid string');
  }

  // Clean up the input to ensure it's in a good format
  const cleanedInput = input.trim().toLowerCase();

  // Optionally, you can add more logic to prioritize certain keywords based on the user's health goal
  let keyword = cleanedInput;

  // Example of appending goal-related keywords
  if (goal === 'lose_weight') {
    keyword += ' low calorie';
  } else if (goal === 'gain_weight') {
    keyword += ' high protein';
  } else if (goal === 'maintain') {
    keyword += ' balanced';
  }

  return keyword;
}

