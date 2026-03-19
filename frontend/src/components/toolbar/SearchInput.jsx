/**
 * Project:       Pokemon Data Collector
 * File:          SearchInput.jsx
 * @description   Provides a text input for searching Pokémon by Name or Id.
 * @author        Maxximillion Thomas
 * @date          March 18, 2026
 */

import React from 'react';

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