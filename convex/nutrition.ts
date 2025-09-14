import { action } from "./_generated/server";

export const getNutrition = action(async (ctx, { food, quantity }: { 
  food: string; 
  quantity: string; 
}) => {
  try {
    const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      method: 'POST',
      headers: {
        'x-app-id': process.env.NUTRITIONIX_API_ID!,
        'x-app-key': process.env.NUTRITIONIX_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: `${quantity} ${food}`,
        timezone: "US/Eastern"
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const foodItem = data.foods?.[0];
    
    if (!foodItem) {
      throw new Error("No nutrition data found");
    }
    
    return {
      food: foodItem.food_name,
      quantity: `${foodItem.serving_qty} ${foodItem.serving_unit}`,
      calories: Math.round(foodItem.nf_calories || 0),
      protein: Math.round(foodItem.nf_protein || 0),
      carbs: Math.round(foodItem.nf_total_carbohydrate || 0),
      fat: Math.round(foodItem.nf_total_fat || 0),
      fiber: Math.round(foodItem.nf_dietary_fiber || 0),
      sugar: Math.round(foodItem.nf_sugars || 0),
      sodium: Math.round(foodItem.nf_sodium || 0),
      success: true,
    };
  } catch (error) {
    console.error("Error fetching nutrition data:", error);
    return {
      food,
      quantity,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      success: false,
    };
  }
});

export const searchFood = action(async (ctx, { query }: { query: string }) => {
  try {
    const response = await fetch('https://trackapi.nutritionix.com/v2/search/instant', {
      method: 'GET',
      headers: {
        'x-app-id': process.env.NUTRITIONIX_API_ID!,
        'x-app-key': process.env.NUTRITIONIX_API_KEY!,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      common: data.common?.slice(0, 5) || [],
      branded: data.branded?.slice(0, 5) || [],
      success: true,
    };
  } catch (error) {
    console.error("Error searching food:", error);
    return {
      common: [],
      branded: [],
      success: false,
    };
  }
});