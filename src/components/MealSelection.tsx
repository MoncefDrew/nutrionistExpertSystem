export const MealSelection = ({ mealType, searchMeals, searchResults, handleMealSelection, removeMeal, watch }) => (
    <div className="mb-6">
      <label className="text-sm font-medium text-zinc-300 capitalize">{mealType} Options</label>
      <div className="relative">
        <input
          type="text"
          onChange={(e) => searchMeals(e.target.value, mealType)}
          placeholder={`Search for ${mealType} options...`}
          className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 transition-colors text-gray-300 placeholder-gray-500"
        />
        {searchResults[mealType]?.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-zinc-800 rounded-lg border border-zinc-700 max-h-60 overflow-auto">
            {searchResults[mealType].map((meal) => (
              <button
                key={meal.id}
                type="button"
                onClick={() => handleMealSelection(meal, mealType)}
                className="w-full p-3 text-left hover:bg-zinc-700 text-gray-300"
              >
                <div className="font-medium">{meal.name}</div>
                <div className="text-sm text-gray-400">
                  {meal.nutritionInfo.calories} cal | P: {meal.nutritionInfo.protein}g | 
                  C: {meal.nutritionInfo.carbs}g | F: {meal.nutritionInfo.fat}g
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="mt-2 space-y-2">
        {watch(mealType).map((meal: MealOption) => (
          <div key={meal.id} className="flex items-center justify-between p-2 bg-zinc-800/50 rounded-lg">
            <span className="text-gray-300">{meal.name}</span>
            <button
              type="button"
              onClick={() => removeMeal(meal.id, mealType)}
              className="text-red-500 hover:text-red-400"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );