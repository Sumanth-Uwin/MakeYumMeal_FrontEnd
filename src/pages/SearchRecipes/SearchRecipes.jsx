import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { ScrollArea } from "../../components/ui/scroll-area";
import Navbar from "../../components/Navbar/navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./styles.module.css";
import {
  ChevronDown,
  X,
  Utensils,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";

export default function RecipeDiscovery() {
  const [recipes, setRecipes] = useState([]);
  const [originalRecipes, setOriginalRecipes] = useState([]); // Store original unfiltered recipes
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [cookingTime, setCookingTime] = useState([]);
  const [mealType, setMealType] = useState([]);
  const [ingredientsCount, setIngredientsCount] = useState([]);
  const [dietPreference, setDietPreference] = useState([]);

  // Comprehensive filter function
  const applyAllFilters = (recipesToFilter) => {
    let filteredRecipes = recipesToFilter;

    // Ingredient Count Filter
    if (ingredientsCount.length > 0) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        const ingredientCount = recipe.extendedIngredients?.length || 0;
        return ingredientsCount.some(range => {
          switch (range) {
            case '< 5':
              return ingredientCount < 5;
            case '5 - 10':
              return ingredientCount >= 5 && ingredientCount <= 10;
            case '10 - 20':
              return ingredientCount > 10 && ingredientCount <= 20;
            case '20 - 30':
              return ingredientCount > 20 && ingredientCount <= 30;
            case '30 - 40':
              return ingredientCount > 30 && ingredientCount <= 40;
            default:
              return false;
          }
        });
      });
    }

    // Cooking Time Filter
    if (cookingTime.length > 0) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        const minutes = recipe.readyInMinutes;
        return cookingTime.some(time => {
          switch (time) {
            case '< 10 minutes':
              return minutes < 10;
            case '10 - 20 minutes':
              return minutes >= 10 && minutes <= 20;
            case '20 - 40 minutes':
              return minutes > 20 && minutes <= 40;
            case '40 - 60 minutes':
              return minutes > 40 && minutes <= 60;
            case '> 60 minutes':
              return minutes > 60;
            default:
              return false;
          }
        });
      });
    }

    // Meal Type Filter
    if (mealType.length > 0) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        const dishTypes = recipe.dishTypes || [];
        return mealType.some((meal) =>
          dishTypes.includes(meal.toLowerCase())
        );
      });
    }

    // Diet Preference Filter
    if (dietPreference.length > 0) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        return dietPreference.some(diet => {
          // Adjust this logic based on how diet info is stored in your recipe object
          return recipe.diets?.some(recipeDiet =>
            recipeDiet.toLowerCase().includes(diet.toLowerCase())
          );
        });
      });
    }

    setRecipes(filteredRecipes);
  };

  const fetchRecipes = async (query, pageNumber) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3100/api/recipes/search?searchTerm=${query}&page=${pageNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
      setOriginalRecipes(data); // Store original recipes
      setRecipes(data); // Initially set all recipes
    } catch (err) {
      setError("An error occurred while fetching recipes. Please try again.");
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes("", 1);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRecipes(searchQuery, 1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRecipes(searchQuery, nextPage);
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const handleCookingTimeChange = (time) => {
    setCookingTime((prev) =>
      prev.includes(time)
        ? prev.filter((item) => item !== time)
        : [...prev, time]
    );
  };

  const handleMealTypeChange = (meal) => {
    setMealType((prev) =>
      prev.includes(meal) ? prev.filter((item) => item !== meal) : [...prev, meal]
    );
  };

  const handleIngredientsCountChange = (count) => {
    setIngredientsCount((prev) =>
      prev.includes(count)
        ? prev.filter((item) => item !== count)
        : [...prev, count]
    );
  };

  const handleDietPreferenceChange = (diet) => {
    setDietPreference((prev) =>
      prev.includes(diet)
        ? prev.filter((item) => item !== diet)
        : [...prev, diet]
    );
  };

  const handleClearFilters = () => {
    // Reset all filter states
    setCookingTime([]);
    setMealType([]);
    setIngredientsCount([]);
    setDietPreference([]);

    // Restore original recipes
    setRecipes(originalRecipes);
  };

  const handleApplyFilters = () => {
    if (originalRecipes.length > 0) {
      applyAllFilters(originalRecipes);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <Navbar />
      </header>

      <div className="flex flex-1">
        {/* Sidebar Filters */}
        <aside className="w-64 border-r p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Filters</h2>
            <X className="h-4 w-4 cursor-pointer" />
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-6">
              {/* Filters: Cooking Time */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Cooking Time</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="space-y-2">
                  {[
                    "< 10 minutes",
                    "10 - 20 minutes",
                    "20 - 40 minutes",
                    "40 - 60 minutes",
                    "> 60 minutes",
                  ].map((time) => (
                    <label key={time} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={cookingTime.includes(time)}
                        onChange={() => handleCookingTimeChange(time)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{time}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Meal Type */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Meal Type</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="space-y-2">
                  {['Breakfast', 'Lunch', 'Snack', 'Dinner', 'Drinks', 'Desserts'].map((meal) => (
                    <label key={meal} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={mealType.includes(meal)}
                        onChange={() => handleMealTypeChange(meal)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{meal}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ingredients count */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Ingredients count</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="space-y-2">
                  {['< 5', '5 - 10', '10 - 20', '20 - 30', '30 - 40'].map((count) => (
                    <label key={count} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={ingredientsCount.includes(count)}
                        onChange={() => handleIngredientsCountChange(count)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Diet Preference */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Diet Preference</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="space-y-2">
                  {['Vegetarian', 'Non-Vegetarian', 'Vegan', 'gluten-free', 'Protein'].map((diet) => (
                    <label key={diet} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={dietPreference.includes(diet)}
                        onChange={() => handleDietPreferenceChange(diet)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{diet}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </ScrollArea>

          <div className="flex space-x-2">
            <Button
              className="w-full mt-4"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Discover New Recipes</h1>

            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search recipes, ingredients"
                  className="max-w-xl flex-grow"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className={styles.search}>
                  Search
                </Button>
              </div>
            </form>

            {loading && <p>Loading recipes...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {recipes.length === 0 && !loading && (
              <div className="text-center py-12 bg-gray-100 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">No Recipes Found</h2>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms to find recipes.
                </p>
                <Button onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}

            {recipes.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map((recipe) => (
                    <Card
                      key={recipe.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                      onClick={() => handleRecipeClick(recipe.id)}
                    >
                      <CardContent className="p-0">
                        <img
                          src={recipe.image || "/placeholder.svg?height=200&width=200"}
                          alt={recipe.title}
                          className="w-full aspect-square object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold mb-2">{recipe.title}</h3>
                          <p
                            className="text-sm text-gray-600 mb-4"
                            dangerouslySetInnerHTML={{
                              __html: recipe.summary
                                ? `${recipe.summary.split(" ").slice(0, 10).join(" ")}...`
                                : "No description available.",
                            }}
                          ></p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Utensils className="h-4 w-4 mr-1" />
                            <span>{recipe.readyInMinutes || "N/A"} mins</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center mt-8">
                  <Button variant="outline" onClick={handleLoadMore}>
                    Load More Recipes
                  </Button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}