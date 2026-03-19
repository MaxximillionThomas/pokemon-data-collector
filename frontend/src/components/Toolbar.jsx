/**
 * Project:       Pokemon Data Collector
 * File:          Toolbar.jsx
 * @description   Provides search and sorting controls for the Pokemon overview page.
 * @author        Maxximillion Thomas
 * @date          March 4, 2026
 */

import TypeFiltering from './toolbar/TypeFiltering';
import SearchInput from './toolbar/SearchInput';
import SortControls from './toolbar/SortControls';
import ShinyToggle from './toolbar/ShinyToggle';

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

      <SearchInput 
        query={query}
        setQuery={setQuery}
        disabled={disabled}
      />

      <SortControls 
        sortKey={sortKey} 
        setSortKey={setSortKey} 
        sortDir={sortDir} 
        setSortDir={setSortDir} 
        disabled={disabled}
      />

      <TypeFiltering 
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        disabled={disabled}
      />

      {/* Shiny toggle */}
      <ShinyToggle
        isShiny={isShiny}
        setIsShiny={setIsShiny}
        disabled={disabled}
      />

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