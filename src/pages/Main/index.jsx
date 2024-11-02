import {React,useEffect, useState} from 'react';
import { Card, CardContent } from "../../components/ui/card"
import Navbar from '../../components/Navbar/navbar';
import Footer from '../../components/Footer/Footer';
import styles from "./styles.module.css";
import { png1,png2,png3,png4 } from '../../index';
import SearchBar from "../../components/Search/SearchBar"
import SearchResults from "../../components/Search/SearchResults";
import CategoryWrapper from '../category/CategoryWrapper';
const Main = () => {

  const [searchResults, setSearchResults] = useState([]);

  // Function to handle search and update results
  const handleSearchResults = (results) => {
    setSearchResults(results);
  };
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
              <h1 className="text-4xl font-bold mb-4">Effortless Meal planning & Grocery Management</h1>
              <div className="flex justify-center space-x-2 mb-4" >
              <SearchBar onSearchResults={handleSearchResults} />
              </div>
              {searchResults.length > 0 && <SearchResults recipes={searchResults} />}
              
            </div>
            <img src={png1} alt="Grocery" className="h-24 w-24" />
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8">How MakeYumMeal works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Step 1", description: "Customize your meal plan. Add recipes and schedule your meals with ease.", image: png3 },
              { title: "Step 2", description: "Browse recipes and select ingredients. Your perfect meal is just a click away.", image: png2 },
              { title: "Step 3", description: "Organize your shopping list. Track purchases and manage your cart effortlessly.", image: png1 },
            ].map((step, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <img src={step.image} alt={step.title} className="mx-auto mb-4 h-32 w-32" />
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p>{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8">Trending Recipes</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { title: "Mixed Berry Smoothie", description: "A refreshing blend of berries for a healthy start." },
              { title: "Gourmet Burger", description: "Juicy burger with cheese and crispy bacon." },
              { title: "Sushi Rolls", description: "Fresh salmon and avocado sushi rolls." },
              { title: "Vegan Chili", description: "Hearty chili with beans and corn." },
              { title: "Chocolate Cake", description: "Rich chocolate cake with creamy frosting." },
            ].map((recipe, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                <img src={png4} alt="Grocery" className="h-24 w-24" />
                  <h3 className="font-bold text-sm">{recipe.title}</h3>
                  <p className="text-xs text-muted-foreground">{recipe.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-4">About Us</h2>
          <p className="mb-4">
            At MakeYumMeal, we understand the challenges of managing daily meal-related tasks in today's fast-paced world. 
            From planning meals and grocery shopping to cooking nutritious and balanced dishes, it can be overwhelming—
            especially for busy individuals and families. We believe that eating well shouldn't be a struggle, and that's why we've 
            created a platform to simplify and streamline your meal-planning experience.
          </p>
          <p>
            Our mission is to help people, especially international students, working professionals, and families, make smarter food 
            choices while saving time and reducing food waste. We know that adjusting to a new environment, managing tight 
            schedules, and maintaining dietary preferences can be tough, so we're here to make it easier. Whether you're looking 
            for recipe inspiration, personalized meal plans, help with grocery shopping, or plating ideas we've got you covered.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
};

export default Main;
