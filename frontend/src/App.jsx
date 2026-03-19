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
import { useSearchParams } from 'react-router-dom';
import './App.css';

function App() {
  // ==========  Use states  ==========

  // Overview / detailed views
  const [pokemonArray, setPokemonArray] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Rendering support
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [showProgress, setShowProgress] = useState(true);

  // URL syncing
  const [searchParams, setSearchParams] = useSearchParams();

  // ==========  URL syncing  ==========

  // Toolbar
  const query = searchParams.get('q') ?? '';
  const sortKey = searchParams.get('sortKey') ?? 'id';
  const sortDir = searchParams.get('sortDir') ?? 'asc';
  const selectedTypes = searchParams.get('types') ? searchParams.get('types').split(',') : [];
  const isShiny = searchParams.get('shiny') === 'true';
  
  // Pagination
  const currentPage = searchParams.get('page') ?? '1';

  /**
   * Updates the browser's URL search parameters with new values.
   * Merges the provided parameters into the existing search state and 
   * removes any keys with empty or null values.
   * @param {Object} newParams - An object containing the parameters to update or remove.
   * @param {string|number|null} [newParams.q] - The search query string.
   * @param {string|null} [newParams.sortKey] - The field to sort by.
   * @param {string|null} [newParams.sortDir] - The sort direction ('asc' or 'desc').
   * @param {string|null} [newParams.types] - Comma-separated string of selected types.
   * @param {number|null} [newParams.page] - The current pagination page number.
   */
  function updateParams(newParams) {
    // Get a handle on this app's search parameters
    const next = new URLSearchParams(searchParams);

    // Iterate through the key:value pairs of newParams (ex: {q:X, sortkey:X, sortDir:X, types:X})
    Object.entries(newParams).forEach(([key, value]) => {
      // Current newParams pair has no value (ex: {q:___, sortKey:X, ...}) 
      if (value === null || value === undefined || value === '') {
        next.delete(key);

      // Current newParam pair has a value (ex: {q:'char', sortKey:X, ...})
      } else {
        next.set(key, value);
      }
    });

    // Set the state object using the new pairs
    setSearchParams(next);
  }

  /**
   * Reset all URL parameters (query, sorting, type filtering, shiny toggle).
   */
  function resetSearchParams() {
    setSearchParams({});
  }

  // ==========  Data fetching  ==========

  // Number of records to fetch
  const totalPokemon = 151;

  // On first load, ALL Pokemon should be visible -> hydrate from S3
  useEffect(() => {
    // Prevent double-rendering
    if (hasFetched.current) return;
    hasFetched.current = true;

    // Use an async function to handle individual Pokemon data fetches
    const loadPokedex = async () => {
      // Target the CloudFront distribution for the S3 bucket 
      const CLOUDFRONT_URL = 'https://d1xb64xlhesy7f.cloudfront.net/pokemon-data/';

      // Iterate through each Pokemond Id up to the limit of totalPokemon (data files are saved in the format '#.json')
      for (let pokemon_id = 1; pokemon_id <= totalPokemon; pokemon_id++) {
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

          // Enable rendering
          setFetchSuccess(true);
          
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

  // Autodismiss the fetch progress message after all data has been fetched
  useEffect(() => {
    if (pokemonArray.length === totalPokemon) {
      // In 3 seconds, hide the progress message
      const timer = setTimeout(() => setShowProgress(false), 3000);
      // Clean up the timer
      return () => clearTimeout(timer);
    }
  // Check with every fetched object addition to pokemonArray
  }, [pokemonArray.length]);

  // ==========  Filtering + sorting  ==========

  // Filter the overview results per the query
  const filtered = useMemo(() => {
    return pokemonArray.filter((pokemon) => {
      // Normalize the searchbar query
      const normalized = query.trim().toLowerCase();

      // Check name and Id for partial match
      const inName = pokemon.name.toLowerCase().includes(normalized);
      const inId = pokemon.id.toString().includes(normalized);
      const inTypes = selectedTypes.length === 0 || pokemon.types.some(type => selectedTypes.includes(type));

      // Pokemon must partially match {Name OR Id} AND be of the selected Type
      return (inName || inId) && inTypes;
    });
  // Run on change of the query or type filter
  }, [pokemonArray, query, selectedTypes]);

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

  // ==========  Pagination  ==========

  const itemsPerPage = 9;

  // Slice the results to meet the itemsPerPage limit, based on current page number
  const totalPages = Math.ceil(displayedPokemon.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPokemon = displayedPokemon.slice(startIndex, startIndex + itemsPerPage);

  // Determine new page numbers (5 shown at a time)
  const pageNumbers = useMemo(() => {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + 4);
      
      if (end - start < 4) {
        start = Math.max(1, end - 4);
      }
      
      let pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    // Run on change of current page or result set (indirectly)
    }, [currentPage, totalPages]);

  // ==========  Rendering  ==========

  return (
    <div className="container mt-5">
      {/* Title */}
      <h1>Pokémon Data Collector</h1>

      {/* Toolbar */}
      <Toolbar 
        query={query}                   
        setQuery={(val) =>updateParams({ q: val, page: 1 })}

        sortKey={sortKey}               
        setSortKey={(val) =>updateParams({ sortKey: val, page: 1 })}

        sortDir={sortDir}               
        setSortDir={(val) =>updateParams({ sortDir: val, page: 1 })}

        selectedTypes={selectedTypes}   
        setSelectedTypes={(val) =>updateParams({ types: val.join(','), page: 1 })}

        isShiny={isShiny}
        setIsShiny={(val) =>updateParams({ shiny: (val ? 'true' : null) })}

        resetSearchParams={resetSearchParams}

        disabled={selectedPokemon ? true : false}
      />

      {/* TEMP VISUAL AID */}
      <div>-</div>

      {/* Page controls */}
      <nav style={{display: 'flex', justifyContent: 'center'}}>
        <ul className="pagination">
          <button 
            onClick={() => {
              const prevPage = currentPage - 1;
              updateParams({ page: Math.max(prevPage, 1) });
              setSelectedPokemon(null);
            }}
            disabled={currentPage === 1 || selectedPokemon != null}
          >
            Prev
          </button>
          
          {pageNumbers.map(page => (
            <button 
              key={page} 
              onClick={() => {
                updateParams({ page: page });
                setSelectedPokemon(null);
              }}
              className={currentPage === page ? 'active' : ''}
              disabled={selectedPokemon ? true : false}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => {
              const nextPage = Number(currentPage) + 1;
              updateParams({ page: Math.min(nextPage, totalPages) });
              setSelectedPokemon(null);
            }}
            disabled={currentPage === totalPages || selectedPokemon != null}
          >
            Next
          </button>
        </ul>
      </nav>

      {/* Fetch progress message */}
      {showProgress && (
        <div>{pokemonArray.length} of {totalPokemon} Pokémon processed.</div>
      )}

      {/* Results */}
      {loading ? (
      // Display loading message until fetch (partially) complete
        <p>Fetching data...</p>

      // Fetch failure
      ) : fetchSuccess === false ?  (
        <p>Failed to fetch Pokemon data.</p>

      // Detail page
      ) : selectedPokemon ? (
        <div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => setSelectedPokemon(null)}>Back to list</button>
              {/* TEMP SPACING */}
              <div>-</div>
            </div>

            <PokemonDetail 
              pokemon={selectedPokemon} 
              pokemonArray={pokemonArray}
              displayedPokemon={displayedPokemon}
              onSelect={setSelectedPokemon}
              currentPage={currentPage}
              setCurrentPage={(val) => updateParams({ page: val })}
              itemsPerPage={itemsPerPage}
              setQuery={(val) => updateParams({ q: val })}
            />
        </div>

      // Overview page
      ) : paginatedPokemon.length > 0 ? (
        <PokemonList 
          pokemonArray={paginatedPokemon}
          onSelect={setSelectedPokemon}
          isShiny={isShiny}
        />

      ) : (
        <p>Failed to fetch Pokemon data.</p>
      )}
    </div>
  );
}

export default App; 