/**
 * Project:       Pokemon Data Collector
 * File:          Toolbar.jsx
 * @description   Provides search and sorting controls for the Pokemon overview page.
 * @author        Maxximillion Thomas
 * @date          March 4, 2026
 */

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
 * @returns {JSX.Element} The toolbar component.
 */
export function Toolbar({ query, setQuery, sortKey, setSortKey, sortDir, setSortDir, selectedTypes, setSelectedTypes }) {
  // Pokemon types for filtering
  const ALL_TYPES = ['bug', 'dragon', 'electric', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'water'];

  /**
   * Handles changes to the multi-select type filter dropdown.
   * Extracts selected values from the event target and updates the parent state.
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event from the select element.
   */
  function handleTypeChange(e) {
    // Extract selected values from the multiple-select dropdown, setting them to the state object
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedTypes(values);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
      {/* Search input */}
      <div>
        <label>Search Pokémon:</label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try 'Char' or '6'..."
        />
        <button onClick={() => setQuery('')}>Clear</button>
      </div>

      {/* Sort controls */}
      <div>
        <label>Sort By:</label>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="name">Name</option>
          <option value="id">Id</option>
        </select>
        
        <select value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
          <option value="asc">Ascending {sortKey == 'name' ? '(A → Z)' : '(1 → 151)'}</option>
          <option value="desc">Descending {sortKey == 'name' ? '(Z → A)' : '(151 → 1)'}</option>
        </select>
      </div>

      {/* Type filtering */}
      <div>
        <label>Filter Types:</label>
        <select multiple={true} value={selectedTypes} onChange={handleTypeChange}>
          {ALL_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
    </div>
  );
}