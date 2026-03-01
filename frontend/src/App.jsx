/**
 * Project:       Pokemon Data Collector
 * File:          App.jsx
 * @purpose       Frontend entry point for visualizing cloud-hosted Pokemon data.
 * @description   Main application layout and component routing.
 * @author        Maxximillion Thomas
 * @date          February 28, 2026
 */

import { PokemonCard } from './components/PokemonCard';
import { useEffect, useState } from 'react';

function App() {
  // Control which Pokemon are to populate the overview page
  const [pokemon, setPokemon] = useState(null);

  // Keep the user updated on the loading status of the application
  const [loading, setLoading] = useState(true);

  // On first load, ALL Pokemon should be visible 
  // HOWEVER, right now we only have the Card component set up, and no map function yet to an array of PokemonCards (!!! come back !!!)
  useEffect(() => {
    // Target the CloudFront distribution for the S3 bucket (only bulbasaur - temporarily manually created - right now per the above)
    const CLOUDFRONT_URL = 'https://d1xb64xlhesy7f.cloudfront.net/bulbasaur.json';

    // Fetch the data from cloud storage
    fetch(CLOUDFRONT_URL)
      // If the HTTP response is ok, return it for data handling
      .then((response) => {
        if (!response.ok) {
          // Create a custom error message and throw it to the 'catch' block
          const error = new Error(`Status ${response.status}`);
          error.type = 'HTTP_ERROR';
          throw error;
        }

        return response.json();
      })

      // Use the response data (Pokemon overview JSON data) to set the Pokemon state object
      .then ((data) => {
        setPokemon(data);
      })

      // The response was NOT ok
      .catch((error) => {
        // Handle HTTP status errors (e.g., 404, 500) thrown in 'then' block
        if (error.type === 'HTTP_ERROR') {
          console.log(`API request failed with status code: ${error.message}.`);
        // Handle connectivity, DNS, or security/CORS failures
        } else {
          console.log('Network or CORS issue. Check CloudFront/S3 policy.');
        }
      });

      // Loading message shown until state object set to false
      setLoading(false);

  // Run only on first load of the web application
  }, []);

  return (
    <div className="container mt-5">
      <h1>Pokémon Data Collector</h1>

      {/* Quick test - to replace PokemonCard with PokemonList (array of PokemonCards) */}
      {loading ? (
      // Display loading message until fetch complete
        <p>Fetching data...</p>
      // Fetch success
      ) : pokemon ? (
        <PokemonCard pokemon={pokemon}/>
      // Fetch failure
      ) : (
        <p>Failed to fetch Pokemon data.</p>
      )}
    </div>
  );
}

export default App; 