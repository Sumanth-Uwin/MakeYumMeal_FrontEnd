import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  // State to store fetched data
  const [data, setData] = useState(null);

  // Define the function to fetch data
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/data');
      setData(response.data.message); // Store the fetched data in state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []); // The empty array ensures this only runs once when the component mounts

  return (
    <div>
      <h1>Hello, World!</h1>
      
      {/* Render the data only if it's available */}
      {data ? (
        <div>
          <h2>Fetched Data:</h2>
          <p>{JSON.stringify(data)}</p> {/* Display the fetched data */}
        </div>
      ) : (
        <p>Loading...</p> // Show a loading message while the data is being fetched
      )}
    </div>
  );
}

export default App;
