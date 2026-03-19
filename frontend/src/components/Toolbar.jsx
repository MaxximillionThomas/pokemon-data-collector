/**
 * Project:       Pokemon Data Collector
 * File:          Toolbar.jsx
 * @description   Provides search and sorting controls for the Pokemon overview page.
 * @author        Maxximillion Thomas
 * @date          March 4, 2026
 */

import TypeFiltering from './toolbar/TypeFiltering';

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
 * @param {boolean} props.disabled - Determines whether elements are interactible.
 * @returns {JSX.Element} The toolbar component.
 */
export function Toolbar({ query, setQuery, sortKey, setSortKey, sortDir, setSortDir, selectedTypes, setSelectedTypes, isShiny, setIsShiny, resetSearchParams, disabled }) {


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

      <TypeFiltering 
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        disabled={disabled}
      />

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