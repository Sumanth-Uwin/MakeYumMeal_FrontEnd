import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "../../components/ui/card";
import { useUser } from '../../UserContext';
import Navbar from '../../components/Navbar/navbar';
import Footer from "../../components/Footer/Footer";

const SavedRecipes = () => {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useUser(); // Get user from context
    const loggedInUserId = user?.userId;

    const navigate = useNavigate(); // Using useNavigate hook

    useEffect(() => {
        const fetchSavedRecipes = async () => {
            if (!loggedInUserId) {
                console.log("No logged in user ID available");
                setLoading(false);
                return;
            }

            try {
                console.log("Fetching saved recipes for user ID:", loggedInUserId);
                const response = await fetch(`http://localhost:3100/api/recipes?userId=${loggedInUserId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log("Full response:", response);

                if (response.ok) {
                    const data = await response.json();
                    console.log("Recipes received:", data);
                    setSavedRecipes(data);
                } else {
                    const errorText = await response.text();
                    console.error("Fetch error response:", errorText);
                    setError(`Error fetching saved recipes: ${errorText}`);
                }
            } catch (err) {
                console.error("Fetch catch block error:", err);
                setError(`Error fetching saved recipes: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedRecipes();
    }, [loggedInUserId]);

    const handleRecipeClick = (recipeId) => {
        navigate(`/recipe/${recipeId}`);
    };

    const handleRecipeRemove = async (recipeId) => {
        if (!loggedInUserId) return;

        try {
            const response = await fetch(`http://localhost:3100/api/recipes/${recipeId}?userId=${loggedInUserId}`, {
                method: 'DELETE', // Changed to DELETE method
            });
            if (response.ok) {
                setSavedRecipes(savedRecipes.filter((recipe) => recipe.recipeId !== recipeId));
            } else {
                setError('Error removing recipe from saved list');
            }
        } catch (err) {
            setError('Error removing recipe from saved list');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 p-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Your Saved Recipes</h1>

                    {loading && <div>Loading...</div>}
                    {error && <div className="text-red-500">{error}</div>}

                    {savedRecipes.length === 0 ? (
                        <div>No recipes saved yet.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {savedRecipes.map((recipe) => (
                                <Card
                                    key={recipe.recipeId || recipe._id} // Use a fallback if `recipeId` is missing
                                    onClick={() => handleRecipeClick(recipe.recipeId || recipe._id)} // Use fallback here too
                                    className="cursor-pointer hover:shadow-lg transition-shadow"
                                >
                                    <div className="relative h-48">
                                        {recipe.image && <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />}
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                                            <h3 className="text-lg font-medium">{recipe.title}</h3>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md w-full"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRecipeRemove(recipe.recipeId || recipe._id);
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SavedRecipes;
