/**
 * Project:       Pokemon Data Collector
 * File:          SortControls.jsx
 * @description   Provides dropdown controls for sorting Pokemon by different criteria.
 * @author        Maxximillion Thomas
 * @date          March 18, 2026
 */

/**
 * Renders the sort selection dropdowns for the toolbar.
 * @param {Object} props
 * @param {string} props.sortKey - Field to sort by (e.g., 'name', 'id').
 * @param {Function} props.setSortKey - State setter for sort key.
 * @param {string} props.sortDir - Direction ('asc' or 'desc').
 * @param {Function} props.setSortDir - State setter for sort direction.
 * @param {boolean} props.disabled - Determines whether elements are interactible.
 * @returns {JSX.Element} The sort controls component.
 */
export default function SortControls({ sortKey, setSortKey, sortDir, setSortDir, disabled }) {
    return (
        <div className="toolbar-group">
            <label htmlFor="sort-key-select">Sort By:</label>

            <div className="d-flex gap-1">
                {/* Sort Key */}
                <select 
                    id="sort-key-select"
                    value={sortKey} 
                    onChange={(e) => setSortKey(e.target.value)} 
                    disabled={disabled}
                >
                    <option value="name">Name</option>
                    <option value="id">Id</option>
                </select>
                
                {/* Sort Dir */}
                <select 
                    id="sort-dir-select"
                    value={sortDir} 
                    onChange={(e) => setSortDir(e.target.value)}
                    disabled={disabled}
                >
                    <option value="asc">Ascending {sortKey == 'name' ? '(A → Z)' : '(1 → 151)'}</option>
                    <option value="desc">Descending {sortKey == 'name' ? '(Z → A)' : '(151 → 1)'}</option>
                </select>
            </div>
        </div>
    );
}