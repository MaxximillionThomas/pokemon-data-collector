/**
 * Project:       Pokemon Data Collector
 * File:          SearchInput.jsx
 * @description   Provides a text input for searching Pokémon by Name or Id.
 * @author        Maxximillion Thomas
 * @date          March 18, 2026
 */

/**
 * Renders the search input group for the toolbar.
 * @param {Object} props
 * @param {string} props.query - Current search string.
 * @param {Function} props.setQuery - State setter for search.
 * @param {boolean} props.disabled - Determines whether elements are interactible.
 * @returns {JSX.Element} The search input component.
 */
export default function SearchInput({ query, setQuery, disabled }) {
    return (
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
    );
}