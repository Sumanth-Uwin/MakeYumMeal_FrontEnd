import React from 'react';
import { Home as HomeIcon, Calendar as CalendarIcon, ShoppingCart as ShoppingCartIcon, User as UserIcon, Search as SearchIcon, Settings, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import Icon from '../Icon/icon';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header className="container mx-auto p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <a href="/">
          <Icon />
        </a>
        <span className="text-2xl font-bold">MakeYumMeal</span>
      </div>
      <nav className="flex space-x-4">
        <a href="/" aria-label="Home">
          <HomeIcon className="h-6 w-6" />
        </a>
        <a href="/search" aria-label="Search">
          <SearchIcon className="h-6 w-6" />
        </a>
        <a href="/cart" aria-label="Shopping Cart">
          <ShoppingCartIcon className="h-6 w-6" />
        </a>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="User Profile" className="cursor-pointer">
              <UserIcon className="h-6 w-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 bg-white shadow-lg rounded-md">
            <DropdownMenuItem className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 hover:text-blue-600 cursor-pointer">
              <a href="/profile" className="flex items-center space-x-2">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 hover:text-blue-600 cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Navbar;
