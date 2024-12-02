import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import Navbar from "../../components/Navbar/navbar";
import Footer from "../../components/Footer/Footer";
import { png1, png2, png3, png4 } from "../../index";
import SearchBar from "../../components/Search/SearchBar";
import SearchResults from "../../components/Search/SearchResults";
import { useUser } from '../../UserContext'; 

const Main = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

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
  const defaultRecipes = [
    { id: 1, title: "Recipe 1", image: "default-image.jpg", summary: "This is a default recipe." },
    { id: 2, title: "Recipe 2", image: "default-image.jpg", summary: "This is another default recipe." },
    console.log(user)
    // Add more default recipes as needed
  ];

  // Function to handle search and update results
  const handleSearchResults = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const url = `http://localhost:3100/api/recipes/search?searchTerm=${query}&page=1`;
      const data = await fetchWithMultipleKeys(url);
      
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

  // Function to check if an API key is working
  const fetchWithApiKey = async (url, apiKey) => {
    try {
      // Pass the API key as a query parameter
      const response = await fetch(`${url}&apiKey=${apiKey}`); // Append the apiKey to the URL
      const data = await response.json();
  
      // Check if the API limit is reached
      if (data.code === 402) {
        throw new Error("API limit reached");
      }
  
      return data;
    } catch (error) {
      console.error("Error fetching data:", error.message);
      throw error;
    }
  };
  

  // Function to try multiple API keys
  // Function to try multiple API keys
  const fetchWithMultipleKeys = async (url) => {
    let triedKeys = new Set(); // Track tried keys to prevent retrying exhausted ones
  
    while (triedKeys.size < apiKeys.length) {
      for (let key of apiKeys) {
        // Skip the keys we've already tried
        if (triedKeys.has(key)) {
          continue;
        }
  
        try {
          const data = await fetchWithApiKey(url, key); // Try fetching with the current API key
          return data; // If successful, return the data immediately
        } catch (error) {
          if (error.message === "API limit reached") {
            console.log(`API limit reached for key: ${key}. Trying next key.`);
            triedKeys.add(key); // Mark this key as exhausted
            continue; // Try the next key if this one is rate-limited
          } else {
            // If there's another error, we throw it and stop
            throw error;
          }
        }
      }
    }
  
    throw new Error("All API keys exhausted."); // If all keys fail, throw an error
  };
  


  useEffect(() => {
    const fetchTrendingRecipes = async () => {
      try {
        const url = `https://api.spoonacular.com/recipes/random?number=5`; // Base URL for random recipes
        const data = await fetchWithMultipleKeys(url); // Use the updated fetch function
  
        console.log("Trending Recipes Data:", data);
  
        // If the data is valid, set it; otherwise, fallback to default data
        if (data && data.recipes) {
          setTrendingRecipes(data.recipes);
        } else {
          setTrendingRecipes(defaultRecipes); // Fallback to default data
          setError("Failed to load trending recipes from the API. Using default data.");
        }
      } catch (err) {
        console.error("Error fetching trending recipes:", err);
        setTrendingRecipes(defaultRecipes); // Fallback to default data in case of error
        setError("Failed to load trending recipes. Using default data.");
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
                  "Browse recipes and select ingredients. Your perfect meal is just a click away.",
                image: png3,
              },
              {
                title: "Step 2",
                description:
                   "Customize your meal plan. Add recipes and schedule your meals with ease.",
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
