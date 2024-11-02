import React from 'react';
import { Home as HomeIcon, Calendar as CalendarIcon, ShoppingCart as ShoppingCartIcon, User as UserIcon } from 'lucide-react';
import Icon from '../Icon/icon';

const Navbar = () => {
  return (
    <header className="container mx-auto p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <a href="/">
          <Icon />
        </a>
        <span className="text-2xl font-bold">MakeYumMeal</span>
      </div>
      <nav className="flex space-x-4">
        <a href="/" aria-label="Home" title="Home">
          <HomeIcon className="h-6 w-6" />
        </a>
        <a href="/calendar" aria-label="Calendar" title="Calendar">
          <CalendarIcon className="h-6 w-6" />
        </a>
        <a href="/cart" aria-label="Shopping Cart" title="Shopping Cart">
          <ShoppingCartIcon className="h-6 w-6" />
        </a>
        <a href="/profile" aria-label="User Profile" title="User Profile">
          <UserIcon className="h-6 w-6" />
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
