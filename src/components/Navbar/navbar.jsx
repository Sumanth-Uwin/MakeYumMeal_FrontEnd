// src/components/Navbar/index.jsx
import React from 'react';
import { Home, Calendar, ShoppingCart, User } from 'lucide-react';
import Icon from '../Icon/icon'; // Default export does not need curly braces

const Navbar = () => {
  return (
    <header className="container mx-auto p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Icon />
        <span className="text-2xl font-bold">MakeYumMeal</span>
      </div>
      <nav className="flex space-x-4">
        <Home className="h-6 w-6" />
        <Calendar className="h-6 w-6" />
        <ShoppingCart className="h-6 w-6" />
        <User className="h-6 w-6" />
      </nav>
    </header>
  );
};

export default Navbar;
