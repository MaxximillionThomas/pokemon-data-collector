/**
 * Project:       Pokemon Data Collector
 * File:          Toolbar.jsx
 * @description   Provides search and sorting controls for the Pokemon overview page.
 * @author        Maxximillion Thomas
 * @date          March 4, 2026
 */

import { useState, useEffect, useRef } from 'react';

/**
 * Renders the toolbar for searching and sorting Pokémon.
 * @param {Object} props
 * @param {string} props.query - Current search string.
 * @param {Function} props.setQuery - State setter for search.
 * @param {string} props.sortKey - Field to sort by (e.g., 'name', 'id').
 * @param {Function} props.setSortKey - State setter for sort key.
 * @param {string} props.sortDir - Direction ('asc' or 'desc').
 * @param {Function} props.setSortDir - State setter for sort direction.
 * @param {string[]} props.selectedTypes - Array of currently selected Pokémon types.
 * @param {Function} props.setSelectedTypes - State setter to update the selected types array.
 * @param {boolean} props.isShiny - Indicates whether to display the shiny versions of Pokémon sprites.
 * @param {Function} props.setIsShiny - Callback to toggle the shiny state in the URL.
 * @param {Function} props.resetSearchParams - Callback to clear all URL search parameters.
 * @returns {JSX.Element} The toolbar component.
 */
export function Toolbar({ query, setQuery, sortKey, setSortKey, sortDir, setSortDir, selectedTypes, setSelectedTypes, isShiny, setIsShiny, resetSearchParams, disabled }) {
  // ==========  Use states  ==========
  
  // Types dropdown collapsibility
  const [typesExpanded, setTypesExpanded] = useState(false);
  const dropdownRef = useRef(null);

  // ==========  Constants  ==========
  
  // Pokemon types for filtering
  const ALL_TYPES = ['bug', 'dragon', 'electric', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'water'];

  // ==========  Functions  ==========

  /**
   * Determines the label text shown for the Types dropdown.
   * @returns {string} "All types", a single Type name, OR "Multiple".
   */
  function getDisplayText() {
    if (selectedTypes.length === 0) return "All Types";
    if (selectedTypes.length === 1) return selectedTypes[0];
    return "Multiple";
  }

  /**
   * Toggles a Pokemon type within the selection array.
   * @param {React.MouseEvent|React.ChangeEvent} e - The trigger event.
   * @param {string} type - The Pokemon type to add or remove.
   */
  function handleTypeToggle(e, type) {
    // Prevent the dropdown from closing when a label is clicked
    e.stopPropagation();

    // Check whether the type selected is already in the state object
    const isSelected = selectedTypes.includes(type);

    let newSelections = [];

    // If it is, remove it
    if (isSelected) {
      newSelections = selectedTypes.filter(t => t !== type);

    // If not, add it
    } else {
      newSelections = [...selectedTypes, type];
    }

    setSelectedTypes(newSelections);
  }

  // ==========  Use effects  ==========

  /**
   * Handles auto-collapsing the Types dropdown when clicking outside the component.
   */
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setTypesExpanded(false);
      }
    }

    if (typesExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [typesExpanded]);

  // ==========  Rendering  ==========

  return (
    <div className={`toolbar-container ${disabled ? 'is-disabled' : ''}`}>

      {/* Search input */}
      <div className="toolbar-group">
        <label>Search Pokémon:</label>

        <div className="d-flex">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try 'Char' or '6'..."
            disabled={disabled}
          />

          <button 
            onClick={() => setQuery('')} 
            disabled={disabled}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Sort controls */}
      <div className="toolbar-group">
        <label>Sort By:</label>

        <div className="d-flex gap-1">
          <select 
            value={sortKey} 
            onChange={(e) => setSortKey(e.target.value)} 
            disabled={disabled}
          >
            <option value="name">Name</option>
            <option value="id">Id</option>
          </select>
          
          <select 
            value={sortDir} 
            onChange={(e) => setSortDir(e.target.value)}
            disabled={disabled}
          >
            <option value="asc">Ascending {sortKey == 'name' ? '(A → Z)' : '(1 → 151)'}</option>
            <option value="desc">Descending {sortKey == 'name' ? '(Z → A)' : '(151 → 1)'}</option>
          </select>
        </div>
      </div>

      {/* Type filtering */}
      <div className="toolbar-group" ref={dropdownRef}>
        <label>Filter Types:</label>
    
        <button 
          type="button"
          className="type-dropdown-button text-capitalize"
          onClick={() => setTypesExpanded(!typesExpanded)}
          disabled={disabled}
        >
          {getDisplayText()}
          <span>{typesExpanded ? '▲' : '▼'}</span>
        </button>

        {/* Render expanded view only when active */}
        {typesExpanded && (
          <div className="type-dropdown-content">
            <div className="type-grid">
              {ALL_TYPES.map(type => (
                <div key={type} className="type-item">

                  <input 
                    type="checkbox"
                    id={`filter-${type}`}
                    checked={selectedTypes.includes(type)}
                    onChange={(e) => handleTypeToggle(e, type)}
                    disabled={disabled}
                  />

                  <label 
                    htmlFor={`filter-${type}`} 
                    className="text-capitalize"
                    onClick={(e) => e.stopPropagation()} 
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Shiny toggle */}
      <div className="toolbar-group align-items-start">
        <label>Shiny Sprites:</label>

        <div className="checkbox-wrapper">
          <input 
            type="checkbox"
            checked={isShiny}
            onChange={(e) => {setIsShiny(e.target.checked)}}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Reset button */}
      <div className="toolbar-group justify-content-end">
        <button 
          className="btn-reset"
          onClick={resetSearchParams}
          disabled={disabled}
        >
          RESET ALL
        </button>
      </div>
    </div>
  );
}