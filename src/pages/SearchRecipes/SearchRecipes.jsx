import {React,useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Checkbox } from "../../components/ui/checkbox"
import { ScrollArea } from "../../components/ui/scroll-area"
import Navbar from '../../components/Navbar/navbar';
import Footer from '../../components/Footer/Footer';
import styles from "./styles.module.css";
import {
  ChevronDown,
  X,
  Utensils,
  Instagram,
  Facebook,
  Linkedin,
  Twitter
} from 'lucide-react';

export default function RecipeDiscovery() {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const searchRecipes = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3100/api/recipes/search?searchTerm=${query}&page=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      setRecipes(data.results || []);
    } catch (err) {
      setError('An error occurred while fetching recipes. Please try again.');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchRecipes('');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    searchRecipes(searchQuery);
  };
  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
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
              {/* Cooking Time */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Cooking Time</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="space-y-2">
                  {['< 10 minutes', '10 - 20 minutes', '20 - 40 minutes', '40 - 60 minutes', '> 60 minutes'].map((time) => (
                    <label key={time} className="flex items-center space-x-2">
                      <Checkbox />
                      <span className="text-sm">{time}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cuisine Type */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Cuisine Type</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="space-y-2">
                  {['Indian', 'Italian', 'Asian', 'Mediterrian', 'American'].map((cuisine) => (
                    <label key={cuisine} className="flex items-center space-x-2">
                      <Checkbox />
                      <span className="text-sm">{cuisine}</span>
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
                      <Checkbox />
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
                      <Checkbox />
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
                      <Checkbox />
                      <span className="text-sm">{diet}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <Button className="w-full mt-4">Apply Filters</Button>
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
                <Button type="submit" className={styles.search}>Search</Button>
              </div>
            </form>

            {loading && <p>Loading recipes...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <Card key={recipe.id} className="cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={() => handleRecipeClick(recipe.id)}>
                  <CardContent className="p-0">
                    <img
                      src={recipe.image || "/placeholder.svg?height=200&width=200"}
                      alt={recipe.title}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{recipe.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{recipe.description || 'No description available.'}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Utensils className="h-4 w-4 mr-1" />
                        <span>{recipe.readyInMinutes || 'N/A'} mins</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button variant="outline">Load More Recipes</Button>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}