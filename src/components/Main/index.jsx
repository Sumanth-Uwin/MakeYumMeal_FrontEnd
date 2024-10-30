import React from 'react';
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent } from "../ui/card"
import { Home, Calendar, ShoppingCart, User, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react'
import Navbar from '../Navbar/navbar';
import Footer from '../Footer/Footer';
import styles from "./styles.module.css";
import png1 from '../../images/image (2).png';
import png2 from '../../images/image (4).png';
import png3 from '../../images/image (5).png';
import png4 from '../../images/image (6).png';

const Main = () => {
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
              <div className="flex justify-center space-x-2 mb-4">
                <Input type="text" placeholder="Search recipes" className="max-w-sm" />
                <Button  className={styles.search}>Search</Button>
              </div>
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
