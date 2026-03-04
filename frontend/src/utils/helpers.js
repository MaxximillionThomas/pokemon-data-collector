/**
 * Project:       Pokemon Data Collector
 * File:          helpers.js
 * @description   Provides utility functions for string formatting and data manipulation.
 * @author        Maxximillion Thomas
 * @date          March 4, 2026
 */

/**
 * Converts a string to *Title Case*.
 * @param {string} str - The string being converted.
 * @returns {string} The string after it has been converted to Title Case.
 */
export function toTitleCase(str) {
  if (!str) return '';
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}
