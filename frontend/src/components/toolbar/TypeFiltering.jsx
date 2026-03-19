/**
 * Project:       Pokemon Data Collector
 * File:          TypeFiltering.jsx
 * @description   Provides multi-select Type filtering with a collapsible dropdown.
 * @author        Maxximillion Thomas
 * @date          March 18, 2026
 */

import { useState, useEffect, useRef } from 'react';

/**
 * Renders the collapsible Pokémon type filter dropdown.
 * @param {Object} props
 * @param {string[]} props.selectedTypes - Array of currently selected Pokémon types.
 * @param {Function} props.setSelectedTypes - State setter to update the selected types array.
 * @param {boolean} props.disabled - Determines whether elements are interactible.
 * @returns {JSX.Element} The type filtering component.
 */
export default function TypeFiltering({ selectedTypes, setSelectedTypes, disabled }) {
    // ==========  Use states  ==========

    // Types dropdown collapsibility
    const [typesExpanded, setTypesExpanded] = useState(false);
    const dropdownRef = useRef(null);

    // ==========  Constants  ==========

    // Pokemon types for filtering
    const ALL_TYPES = [
        'bug', 'dragon', 'electric', 'fighting', 'fire', 'flying', 'ghost', 
        'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'water'
    ];

    
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
        <div className="toolbar-group" ref={dropdownRef}>
            <label>Filter Types:</label>

            {/* Dropdown button */}
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
    );
}