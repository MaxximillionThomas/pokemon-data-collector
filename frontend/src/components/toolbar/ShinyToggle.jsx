/**
 * Project:       Pokemon Data Collector
 * File:          ShinyToggle.jsx
 * @description   Provides a checkbox toggle to switch between normal and shiny Pokemon sprites.
 * @author        Maxximillion Thomas
 * @date          March 18, 2026
 */

/**
 * Renders the shiny sprite toggle for the toolbar.
 * @param {Object} props
 * @param {boolean} props.isShiny - Indicates whether to display the shiny versions of Pokemon sprites.
 * @param {Function} props.setIsShiny - Callback to toggle the shiny state in the URL.
 * @param {boolean} props.disabled - Determines whether elements are interactible.
 * @returns {JSX.Element} The shiny toggle component.
 */

export default function ShinyToggle({ isShiny, setIsShiny, disabled }) {
    return (
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
    );
}