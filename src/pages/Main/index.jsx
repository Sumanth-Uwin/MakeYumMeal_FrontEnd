import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import Navbar from "../../components/Navbar/navbar";
import Footer from "../../components/Footer/Footer";
import { png1, png2, png3, png4 } from "../../index";
import SearchBar from "../../components/Search/SearchBar";
import SearchResults from "../../components/Search/SearchResults";

const Main = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  //const API_KEY = 'c7be5e80b9d74f42a80086a83b8305fd'; // Replace with your actual API key
  const API_KEY='b742e43802e749a0a94080a6c28a269a';

  // Function to handle search and update results
  const handleSearchResults = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3100/api/recipes/search?searchTerm=${query}&page=1`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();
      if (data.message) {
        setError(data.message); // No recipes found
        setSearchResults([]);
      } else {
        setSearchResults(data);
      }
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError("Unable to fetch search results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  useEffect(() => {
    const fetchTrendingRecipes = async () => {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/random?number=5&apiKey=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch trending recipes");
        }
        const data = await response.json();
        setTrendingRecipes(data.recipes);
      } catch (err) {
        console.error("Error fetching trending recipes:", err);
        setError("Failed to load trending recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingRecipes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 py-12 text-center">
          <div className="flex justify-center space-x-4">
            <img src={png1} alt="Grocery" className="h-24 w-24" />
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Effortless Meal Planning & Grocery Management
              </h1>
              <div className="flex justify-center space-x-2 mb-4">
              <SearchBar onSearchResults={(results) => setSearchResults(results)} />
              </div>
              {loading && <p>Loading search results...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {searchResults.length > 0 && <SearchResults recipes={searchResults} />}
            </div>
            <img src={png1} alt="Grocery" className="h-24 w-24" />
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8">How MakeYumMeal Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Step 1",
                description:
                  "Customize your meal plan. Add recipes and schedule your meals with ease.",
                image: png3,
              },
              {
                title: "Step 2",
                description:
                  "Browse recipes and select ingredients. Your perfect meal is just a click away.",
                image: png2,
              },
              {
                title: "Step 3",
                description:
                  "Organize your shopping list. Track purchases and manage your cart effortlessly.",
                image: png1,
              },
            ].map((step, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="mx-auto mb-4 h-32 w-32"
                  />
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p>{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8">Trending Recipes</h2>
          {loading && <p>Loading trending recipes...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {trendingRecipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => handleRecipeClick(recipe.id)}
                >
                  <CardContent className="p-4">
                    <img
                      src={recipe.image || png4}
                      alt={recipe.title}
                      className="w-full h-24 object-cover mb-2"
                    />
                    <h3 className="font-bold text-sm">{recipe.title}</h3>
                    <p
                      className="mb-4"
                      dangerouslySetInnerHTML={{
                        __html: recipe.summary
                          ? `${recipe.summary.split(" ").slice(0, 10).join(" ")}...`
                          : "No description available",
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Main;
