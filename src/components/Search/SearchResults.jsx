import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ recipes = [] }) => {
  if (!recipes.length) {
    return <p className="text-center mt-4">No recipes found. Try a different search term!</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="p-4 border rounded-lg text-center">
          <Link to={`/recipe/${recipe.id}`}>
            <img src={recipe.image} alt={recipe.title} className="h-24 w-24 mx-auto" />
            <h3 className="font-bold mt-2">{recipe.title}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
