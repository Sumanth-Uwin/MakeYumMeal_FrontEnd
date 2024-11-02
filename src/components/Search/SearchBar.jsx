import React, { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import styles from "./styles.module.css";

function SearchBar({ onSearchResults }) {
  const [query, setQuery] = useState('egg');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3100/api/recipes/search?searchTerm=${query}&page=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      onSearchResults(data.results); // Pass results back to Main component
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <form onSubmit={handleSearch} className="bg-white p-4 rounded relative flex items-center">
        <Input
          type="search"
          className="max-w-sm"
          name="query"
          placeholder="Search for a recipe"
          id="search"
          required
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" className={styles.search}>Search</Button>
      </form>

      {loading && <p>Loading recipes...</p>}
    </div>
  );
}

export default SearchBar;
