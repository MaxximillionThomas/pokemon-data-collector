/**
 * Project:       Pokemon Data Collector
 * File:          ResetButton.jsx
 * @description   Provides a button to clear all active search and filter parameters.
 * @author        Maxximillion Thomas
 * @date          March 18, 2026
 */

/**
 * Renders the reset button for the toolbar.
 * @param {Object} props
 * @param {Function} props.resetSearchParams - Callback to clear all URL search parameters.
 * @param {boolean} props.disabled - Determines whether elements are interactible.
 * @returns {JSX.Element} The reset button component.
 */
export default function ResetButton({ resetSearchParams, disabled }) {
    return (
      <div className="toolbar-group justify-content-end">
        <button 
          type="button"
          className="btn-reset"
          onClick={resetSearchParams}
          disabled={disabled}
        >
          RESET ALL
        </button>
      </div>
    );
}