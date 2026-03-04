/**
 * Project:       Pokemon Data Collector
 * File:          App.jsx
 * @description   Main application layout and component routing.
 * @author        Maxximillion Thomas
 * @date          February 28, 2026
 */

import { PokemonList } from './components/PokemonList';
import { PokemonDetail } from './components/PokemonDetail';
import { useEffect, useRef, useState, useMemo } from 'react';
import { toTitleCase } from './utils/helpers';
import { Toolbar } from './components/Toolbar';

function App() {
  // ==========  Use states  ==========

  // Toolbar
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  
  // Pokemon display
  const [pokemonArray, setPokemonArray] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  // ==========  Data fetching  ==========

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

  // ==========  Filtering + sorting  ==========

  // Normalize the searchbar query
  const normalized = query.trim().toLowerCase();

  // Filter the overview results per the query
  const filtered = useMemo(() => {
    return pokemonArray.filter((pokemon) => {
      // A query must exist to filter results
      if (!normalized) return true;

      // Check name and Id for partial match
      const inName = pokemon.name.toLowerCase().includes(normalized);
      const inId = pokemon.id.toString().includes(normalized);

      return inName || inId;
    });
  // Run on change of the result set or query
  }, [pokemonArray, normalized]);

  // Sort the filtered results
  const displayedPokemon = useMemo(() => {
    const copy = [...filtered];

    // Build the sort parameter (e.g., "nameAsc", "idDesc")
    const sort = sortKey + toTitleCase(sortDir);

    switch (sort) {
      case "nameAsc":
        copy.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        copy.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "idAsc":
        copy.sort((a, b) => a.id - b.id);
        break;
      case "idDesc":
        copy.sort((a, b) => b.id - a.id);
        break;
    }

    return copy;
  // Run on change of the filtered result set or sort parameters
  }, [filtered, sortKey, sortDir]);

  // ==========  Rendering  ==========

  return (
    <div className="container mt-5">
      {/* Title */}
      <h1>Pokémon Data Collector</h1>

      {/* Toolbar */}
      <Toolbar 
        query={query} setQuery={setQuery}
        sortKey={sortKey} setSortKey={setSortKey}
        sortDir={sortDir} setSortDir={setSortDir}
      />

      {/* Results */}
      {loading ? (
      // Display loading message until fetch (partially) complete
        <p>Fetching data...</p>

      // Detail page
      ): selectedPokemon ? (
        <div>
            <button onClick={() => setSelectedPokemon(null)}>Back to list</button>
            <PokemonDetail pokemon={selectedPokemon} />
        </div>

      // Overview page
      ) : pokemonArray.length > 0 ? (
        <PokemonList 
          pokemonArray={displayedPokemon}
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