import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { BookmarkIcon, VolumeXIcon, FileTextIcon } from 'lucide-react';
import Navbar from '../../components/Navbar/navbar';
import { useUser } from '../../UserContext';
import Footer from "../../components/Footer/Footer";

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [saved, setSaved] = useState(false);  // Track if the recipe is saved
  const [notes, setNotes] = useState('');  // Track the notes
  const [isNotesOpen, setIsNotesOpen] = useState(false); // Track whether notes popup is open
  const speechSynthesisRef = useRef(null);
  const { user } = useUser(); // Get user from context
  const loggedInUserId = user?.userId; // Get logged-in user ID
  
  // Fetch recipe data
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

  // Speak the preparation method
  const speakPreparationMethod = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }

    const preparationSteps = recipe.analyzedInstructions?.[0]?.steps
      .map((step, index) => `Step ${index + 1}: ${step.step}`)
      .join('. ');

    if (preparationSteps) {
      const utterance = new SpeechSynthesisUtterance(preparationSteps);
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesisRef.current = window.speechSynthesis;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Save recipe to the user's list
  const handleSaveRecipe = async () => {
    try {
      const response = await axios.post("http://localhost:3100/api/recipes/save", {
        userId: loggedInUserId,
        recipeId: id,
        title: recipe.title,
        image: recipe.image,
        ingredients: recipe.extendedIngredients,
        instructions: recipe.analyzedInstructions,
      });

      if (response.status === 200) {
        setSaved(true);  // Mark as saved
        alert("Recipe saved successfully!");
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Failed to save recipe. Please try again.");
    }
  };

  // Handle Notes popup open/close
  const handleNotesToggle = () => {
    setIsNotesOpen(!isNotesOpen);
  };

  // Save notes
  const handleSaveNotes = async () => {
    try {
      if (!loggedInUserId) {
        alert("You must be logged in to save notes.");
        return;
      }
  
      const userId = loggedInUserId;
  
      const response = await axios.post("http://localhost:3100/api/notes/create", {
        recipeId: id,
        title: recipe.title,
        content: notes,
        userId: userId,
      });
  
      if (response.status === 200 || response.status === 201) {
        alert("Notes saved successfully!");
  
        // Delay closing the popup to allow the alert to appear first
        setTimeout(() => {
          setIsNotesOpen(false); // Close the notes popup
        }, 1000); // Close the popup after 1 second (you can adjust the delay)
      }
    } catch (error) {
      console.error("Error saving notes:", error);
      alert("Failed to save notes. Please try again.");
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
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleSaveRecipe} // Save recipe button
            >
              <BookmarkIcon className="w-4 h-4" />
              {saved ? "Saved" : "Save Recipe"}
            </Button>
            <Button 
              variant="secondary" 
              className="flex items-center gap-2"
              onClick={handleNotesToggle} // Open notes popup
            >
              <FileTextIcon className="w-4 h-4" />
              Notes
            </Button>
            <Button 
              variant={isSpeaking ? "destructive" : "secondary"} 
              className="flex items-center gap-2"
              onClick={isSpeaking ? stopSpeaking : speakPreparationMethod}
            >
              {isSpeaking ? (
                <>
                  <VolumeXIcon  className="w-4 h-4" />
                  Stop Reading
                </>
              ) : (
                <>
                  <VolumeXIcon  className="w-4 h-4" />
                  Read Preparation
                </>
              )}
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
      </div>

      {/* Notes Popup */}
      {isNotesOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Add Your Notes</h3>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
            />
            <div className="flex justify-end gap-4 mt-4">
              <Button 
                variant="destructive" 
                onClick={() => setIsNotesOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSaveNotes}
              >
                Save Notes
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RecipeDetail;
