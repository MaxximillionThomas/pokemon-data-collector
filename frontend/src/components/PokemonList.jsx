/**
 * Project:         Pokemon Data Collector
 * File:            PokemonList.jsx
 * @description     Maps through the array of Pokemon data and renders individual PokemonCard components.
 * @author          Maxximillion Thomas
 * @date            March 2, 2026
 */

import { PokemonCard } from './PokemonCard';

/**
 * Renders a list of Pokemon cards based on an array of Pokemon data.
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.pokemonArray - An array of Pokemon data objects.
 * @param {Function} props.onSelect - Callback function to handle selecting a Pokemon for the detail view.
 * @param {boolean} props.isShiny - Indicates whether to display the shiny versions of Pokemon sprites.
 * @returns {JSX.Element} An array of PokemonCard components.
 */
export function PokemonList({ pokemonArray, onSelect, isShiny }) {
  return (
    <div className='row'>
      {pokemonArray.map((pokemon) => (
        <PokemonCard 
          key={pokemon.id} 
          pokemon={pokemon} 
          onSelect={onSelect}
          isShiny={isShiny}
        />
      ))}
    </div>
  );
}