import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { BookmarkIcon, Volume2Icon, FileTextIcon } from 'lucide-react';
import Navbar from '../../components/Navbar/navbar';
import { useUser } from '../../UserContext';

const apiKeys = [
  process.env.REACT_APP_SPOONACULAR_KEY1,
  process.env.REACT_APP_SPOONACULAR_KEY2,
  process.env.REACT_APP_SPOONACULAR_KEY3,
  process.env.REACT_APP_SPOONACULAR_KEY4,
  process.env.REACT_APP_SPOONACULAR_KEY5,
  process.env.REACT_APP_SPOONACULAR_KEY6,
  process.env.REACT_APP_SPOONACULAR_KEY7,
  process.env.REACT_APP_SPOONACULAR_KEY8
];

// Function to fetch recipe details with multiple API keys
const fetchWithMultipleKeys = async (url) => {
  for (let key of apiKeys) {
    try {
      const response = await axios.get(url, {
        params: { apiKey: key },
      });

      // If successful, return the response data
      if (response.status === 200) {
        console.log("Fetched data successfully with API Key:", key);
        return response.data;
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.warn(`API Key ${key} failed (Unauthorized). Trying the next one.`);
      } else {
        console.error("Error fetching data:", error.message);
      }
    }
  }

  // If all API keys fail, throw an error
  throw new Error("All API keys failed.");
};

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [error, setError] = useState(null);

  // Get the logged-in userId from the context (assuming it's provided by your useUser hook)
  const { user } = useUser();
  console.log(user)
  const loggedInUserId = user?.userId; // Replace with actual user ID or get from context

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `https://api.spoonacular.com/recipes/${id}/information`;
        const data = await fetchWithMultipleKeys(url);
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
        setError("Unable to fetch recipe details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // Handle adding selected ingredients to shopping list
  const handleAddToShoppingList = async () => {
    try {
      const selectedItems = recipe.extendedIngredients.filter((ingredient) =>
        selectedIngredients.includes(ingredient.id)
      );

      // Prepare the selected ingredients in the required format
      const formattedIngredients = selectedItems.map((ingredient) => ({
        name: ingredient.original,
        quantity: 1,
        ingredientId: ingredient.id,
      }));

      // Post the request to the backend
      const response = await axios.post("http://localhost:3100/api/shoppingList/add", {
        userId: loggedInUserId, // Ensure this is the actual logged-in user's ID
        selectedIngredients: formattedIngredients,
      });

      alert("Ingredients added to shopping list!");
    } catch (error) {
      console.error("Error adding ingredients:", error.response ? error.response.data : error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>No recipe found.</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{recipe.title}</h1>
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <BookmarkIcon className="w-4 h-4" />
              Save Recipe
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              <FileTextIcon className="w-4 h-4" />
              Notes
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              <Volume2Icon className="w-4 h-4" />
              Read Text Aloud
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="w-full h-64 object-cover rounded-t-lg"
          />
        </Card>

        <div className="grid grid-cols-2 gap-8">
          {/* Ingredients */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.extendedIngredients?.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span>{ingredient.original}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Preparation Method */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Preparation Method</h2>
            <ol className="space-y-4">
              {recipe.analyzedInstructions?.[0]?.steps.map((step, index) => (
                <li key={index} className="flex gap-2">
                  <span className="font-medium">{index + 1}.</span>
                  <span>{step.step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Shopping Cart Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Add to Shopping Cart</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="select-all"
                checked={selectedIngredients.length === recipe.extendedIngredients?.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedIngredients(recipe.extendedIngredients.map(i => i.id));
                  } else {
                    setSelectedIngredients([]);
                  }
                }}
              />
              <label htmlFor="select-all" className="font-medium">Select All</label>
            </div>
            
            {recipe.extendedIngredients?.map((ingredient) => (
              <div key={ingredient.id} className="flex items-center gap-2">
                <Checkbox 
                  id={`ingredient-${ingredient.id}`}
                  checked={selectedIngredients.includes(ingredient.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedIngredients([...selectedIngredients, ingredient.id]);
                    } else {
                      setSelectedIngredients(selectedIngredients.filter(id => id !== ingredient.id));
                    }
                  }}
                />
                <label htmlFor={`ingredient-${ingredient.id}`}>{ingredient.original}</label>
              </div>
            ))}
          </div>
          
          <Button className="mt-4 w-full" onClick={handleAddToShoppingList}>Add to shopping list</Button>
        </div>

        {/* Nutrition Facts */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Nutrition Facts</h2>
          <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: recipe.summary }} />
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
