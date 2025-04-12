const substitutionMap: Record<string, string[]> = {
  spinach: ["kale", "Swiss chard", "arugula", "collard greens", "romaine lettuce"],
  milk: ["almond milk", "soy milk", "oat milk", "coconut milk", "rice milk", "cashew milk"],
  rice: ["quinoa", "cauliflower rice", "bulgur", "farro", "barley", "freekeh"],
  beef: ["tofu", "tempeh", "mushrooms", "lentils", "seitan", "jackfruit"],
  chicken: ["tofu", "tempeh", "chickpeas", "jackfruit", "cauliflower"],
  cheese: ["nutritional yeast", "vegan cheese", "tofu ricotta", "cashew cheese", "hummus"],
  butter: ["olive oil", "coconut oil", "avocado", "ghee (for non-vegan)", "plant-based spreads"],
  sugar: ["honey", "maple syrup", "dates", "stevia", "monk fruit", "coconut sugar"],
  eggs: ["chia seeds (gelled)", "flaxseeds (gelled)", "mashed banana", "applesauce", "silken tofu"],
  yogurt: ["coconut yogurt", "soy yogurt", "almond yogurt", "cashew yogurt"],
  cream: ["coconut cream", "cashew cream", "Greek yogurt", "silken tofu blended"],
  pasta: ["zoodles (zucchini noodles)", "spaghetti squash", "whole wheat pasta", "chickpea pasta", "lentil pasta"],
  bread: ["lettuce wraps", "rice cakes", "whole grain wraps", "sweet potato slices", "cloud bread"],
  potatoes: ["sweet potatoes", "turnips", "butternut squash", "cauliflower mash"],
  "ice cream": ["banana ice cream", "coconut milk ice cream", "frozen yogurt", "sorbet", "almond milk ice cream"],
  mayonnaise: ["Greek yogurt", "avocado", "hummus", "cashew mayo", "mustard"],
  flour: ["almond flour", "coconut flour", "oat flour", "chickpea flour", "spelt flour"],
  salt: ["herbs", "lemon juice", "vinegar", "nutritional yeast", "salt-free spice blends"],
};


export function MealSubstitutions(healthData: HealthData | null, input: string): string {
  const lowered = input.toLowerCase();

  const target = Object.keys(substitutionMap).find(item =>
    lowered.includes(item)
  );

  if (!target) {
    return "Could you specify what ingredient or food you'd like to substitute?";
  }

  const suggestions = substitutionMap[target];
  return `If you don't like ${target}, you can try: ${suggestions.join(", ")}. They're great alternatives nutritionally.`;
}
