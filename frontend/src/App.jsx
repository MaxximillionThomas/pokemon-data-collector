/**
 * Project:       Pokemon Data Collector
 * File:          App.jsx
 * @description   Main application layout and component routing.
 * @author        Maxximillion Thomas
 * @date          February 28, 2026
 */

import { PokemonList } from './components/PokemonList';
import { PokemonDetail } from './components/PokemonDetail';
import { useEffect, useRef, useState } from 'react';

function App() {
  // Control which Pokemon are to populate the overview page
  const [pokemonArray, setPokemonArray] = useState([]);

  // Track which Pokemon is in selection
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Keep the user updated on the loading status of the application
  const [loading, setLoading] = useState(true);

  // Prevent double-rendering
  const hasFetched = useRef(false);

  // On first load, ALL Pokemon should be visible -> hydrate from S3
  useEffect(() => {
    // Prevent double-rendering
    if (hasFetched.current) return;
    hasFetched.current = true;

    // Use an async function to handle individual Pokemon data fetches
    const loadPokedex = async () => {
      // Target the CloudFront distribution for the S3 bucket 
      const CLOUDFRONT_URL = 'https://d1xb64xlhesy7f.cloudfront.net/pokemon-data/';

      // Iterate through each Pokemond Id up to the limit of 151 (data files are saved in the format '#.json')
      for (let pokemon_id = 1; pokemon_id <= 151; pokemon_id++) {
        try {
          const response = await fetch(`${CLOUDFRONT_URL}${pokemon_id}.json`);
          
          // Handle fetch failure (1/2)
          if (!response.ok) {
            const error = new Error(`Status ${response.status}`);
            error.type = 'HTTP_ERROR';
            throw error;
          }

          // On fetch success, read the (Pokemon) data as JSON and push it to the state array
          const data = await response.json();
          setPokemonArray(prev => [...prev, data]);

          // After the first update, stop the loading state
          if (pokemon_id === 1) setLoading(false);
          
        // Handle fetch failure (2/2)
        } catch (error) {
          // Handle HTTP status errors (e.g., 404, 500) thrown in 'then' block
          if (error.type === 'HTTP_ERROR') {
            console.log(`API request failed with status code: ${error.message}.`);
          // Handle connectivity, DNS, or security/CORS failures
          } else {
            console.log('Network or CORS issue. Check CloudFront/S3 policy.');
          }
        }
      }
    };

    loadPokedex();
  // Run only on first load of the web application
  }, []);

  return (
    <div className="container mt-5">
      <h1>Pokémon Data Collector</h1>

      {loading ? (
      // Display loading message until fetch complete
        <p>Fetching data...</p>

      ): selectedPokemon ? (
        <div>
            <button onClick={() => setSelectedPokemon(null)}>Back to list</button>
            <PokemonDetail pokemon={selectedPokemon} />
        </div>
      // Fetch success
      ) : pokemonArray.length > 0 ? (
        <PokemonList 
          pokemonArray={pokemonArray}
          onSelect={setSelectedPokemon}
        />
      // Fetch failure
      ) : (
        <p>Failed to fetch Pokemon data.</p>
      )}
    </div>
  );
}

export default App; 