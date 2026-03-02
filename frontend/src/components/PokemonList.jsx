/**
 * Project:         Pokemon Data Collector
 * File:            PokemonList.jsx
 * @purpose         Render a grid of Pokemon cards based on an array of Pokemon data.
 * @description     Maps through the array of Pokemon data and renders individual PokemonCard components.
 * @author          Maxximillion Thomas
 * @date            March 2, 2026
 */

import { PokemonCard } from './PokemonCard';

/**
 * Renders a list of Pokémon cards based on an array of Pokémon data.
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.pokemonArray - An array of Pokémon data objects.
 * @param {number} props.pokemonArray[].id - The unique identifier for the Pokémon.
 * @param {string} props.pokemonArray[].name - The name of the Pokémon.
 * @param {string} props.pokemonArray[].sprite - The URL to the Pokémon's sprite image.
 * @returns {JSX.Element} A grid or list of PokemonCard components.
 */
export function PokemonList({ pokemonArray }) {
  return (
    <div className='row'>
      {pokemonArray.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
}