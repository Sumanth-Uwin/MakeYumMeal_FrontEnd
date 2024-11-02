import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/navbar';

const RecipeDetail = () => {
  const { id } = useParams(); // Recipe ID from URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:3100/api/recipes/${id}/information`);
        setRecipe(response.data); // Assuming the recipe data is returned directly
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>No recipe found.</p>;

  return (
    <div className="min-h-screen flex flex-col container mx-auto">
    <Navbar />
      <h2 className="text-3xl font-bold mb-4">{recipe.title}</h2>
      <img src={recipe.image} alt={recipe.title} className="h-48 w-48 mx-auto mb-4" />

      {/* Display recipe summary with HTML formatting */}
      <p
        className="mb-4"
        dangerouslySetInnerHTML={{ __html: recipe.summary }}
      />

      <div>
        <h3 className="text-2xl font-semibold mt-6">Ingredients</h3>
        <ul className="list-disc list-inside">
          {recipe.extendedIngredients && recipe.extendedIngredients.map((ingredient, index) => (
            <li key={index}>{ingredient.original}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-2xl font-semibold mt-6">Instructions</h3>
        <ol className="list-decimal list-inside">
          {recipe.analyzedInstructions && recipe.analyzedInstructions[0]?.steps.map((step, index) => (
            <li key={index}>{step.step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeDetail;
