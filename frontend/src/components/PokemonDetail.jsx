/**
 * Project:       Pokemon Data Collector
 * File:          PokemonDetail.jsx
 * @description   Detailed view component displaying species info, evolution, and learnsets.
 * @author        Maxximillion Thomas
 * @date          March 4, 2026
 */

import { useState } from 'react';
import { Badge } from 'react-bootstrap';
import { LearnsetTable } from './LearnsetTable';
import { PokemonCard } from './PokemonCard';
import { toTitleCase } from '../utils/helpers';

/**
 * Renders the full details of a specific Pokemon.
 * @param {Object} props - The component props.
 * @param {Object} props.pokemon - The full Pokemon data object retrieved from S3.
 * @param {number} props.pokemon.id - The unique ID (Pokedex number).
 * @param {string} props.pokemon.name - The name of the Pokemon.
 * @param {string[]} props.pokemon.types - List of Pokemon types.
 * @param {string} props.pokemon.spriteFront - URL to the Pokemon sprite (front).
 * @param {string} props.pokemon.spriteBack - URL to the Pokemon sprite (back).
 * @param {string} props.pokemon.entry - Pokedex entry (description of the Pokemon).
 * @param {string} props.pokemon.location - Pokemon habitat/location.
 * @param {string[]} props.pokemon.abilities - List of abilities.
 * @param {Array<Object>} props.pokemon.learnset - List of moves and levels learned at.
 * @param {Array<Object>} props.pokemonArray - The full list of Pokémon.
 * @param {Function} props.onSelect - Callback to change the selected Pokémon in App state.
 * @param {number} props.currentPage - The current page of the list view.
 * @param {Function} props.setCurrentPage - Callback to change the parent pagination state.
 * @param {number} props.itemsPerPage - Number of items shown per page.
 * @returns {JSX.Element} A detailed view of the selected Pokemon with navigation capabilities.
 */
export function PokemonDetail({ pokemon, pokemonArray, onSelect, currentPage, setCurrentPage, itemsPerPage }) {
    // Track state of learnset visibility
    const [learnsetVisible, setLearnsetVisible] = useState(false);

    // Track overview page PokemonCard index (associated with currently open PokemonDetail)
    const currentIndex = pokemon.id - 1;
    const prevPokemon = pokemonArray[currentIndex - 1];
    const nextPokemon = pokemonArray[currentIndex + 1];

    // Book-end Pokemon
    const missingNo = { 
        id: '???', 
        name: 'MissingNo.', 
        types: ['???'], 
        spriteFront: 'https://s3.pokeos.com/pokeos-uploads/forgotten-dex/pokemon/0-missingNo.png' 
    }

    /**
     * Navigates to the previous Pokémon in the array, updating the page if necessary.
     */
    function handlePrev() {
        // There must be a Pokemon found at {pokemonArray[prevPokemon]}
        if (prevPokemon) {
            // If the previous PokemonCard is behind the current page, decrement the page number
            if ((currentIndex - 1) < (currentPage - 1) * itemsPerPage) {
                setCurrentPage(prev => Math.max(prev - 1, 1));
            }
            onSelect(prevPokemon);
        }
    }

    /**
     * Navigates to the next Pokémon in the array, updating the page if necessary.
     */
    function handleNext() {
        // There must be a Pokemon found at {pokemonArray[nextPokemon]}
        if (nextPokemon) {
            // If the next PokemonCard is beyond the current page, increment the page number
            if ((currentIndex + 1) >= currentPage * itemsPerPage) {
                setCurrentPage(prev => prev + 1);
            }
            onSelect(nextPokemon);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Preview - previous Pokemon */}
            {prevPokemon ? (
                <div onClick={handlePrev}>
                    <p>Previous</p>
                    <PokemonCard pokemon={prevPokemon} onSelect={onSelect} />
                </div>
            ) :  (               
                <div>
                    <p>Previous (None)</p>
                    <PokemonCard pokemon={missingNo} onSelect={() => {}} />
                </div>)
            } 

            {/* Details - current pokemon */}
            <div>
                {/* Sprites and basic info */}
                <section>
                    <div>
                        <img src={pokemon.spriteFront} alt={`${pokemon.name} front`} />
                        <img src={pokemon.spriteBack} alt={`${pokemon.name} back`} />
                    </div>  

                    <h1>{pokemon.id} - {toTitleCase(pokemon.name)}</h1>

                    <div>
                        {pokemon.types.map(type => (
                            <Badge key={type} bg="info" className="me-1">{type}</Badge>
                        ))}
                    </div>
                </section>

                {/* Pokedex entry and location */}
                <section>
                    <p>{pokemon.entry}</p>
                    <p>Habitat: {pokemon.location}</p>
                </section>

                {/* Evolution chain (placeholders for now*/}
                <section>
                    <div>
                        <img src={pokemon.spriteFront} alt={'Evolution stage 1'} />
                        <p>Evolution Stage 1</p>
                    </div>

                    <div>
                        <img src={pokemon.spriteFront} alt={'Evolution stage 2'} />
                        <p>Evolution Stage 2</p>
                    </div>

                    <div>
                        <img src={pokemon.spriteFront} alt={'Evolution stage 3'} />
                        <p>Evolution Stage 3</p>
                    </div>
                </section>

                {/* Abilities and learnset */}
                <section>
                    <h2>Abilities</h2>
                    <ul>
                        {pokemon.abilities.map((ability, index) => (
                            <li key={index}>{ability}</li>
                        ))}
                    </ul>

                    <div>
                        <button onClick={() => setLearnsetVisible(!learnsetVisible)}>
                            {learnsetVisible ? 'Hide Learnset' : 'View Learnset'}
                        </button>
                        {learnsetVisible && <LearnsetTable learnset={pokemon.learnset} />}
                    </div>
                </section>
            </div>

            {/* Preview - next Pokemon */}
            {nextPokemon ? (
                <div onClick={handleNext}>
                    <p>Next</p>
                    <PokemonCard pokemon={nextPokemon} onSelect={onSelect} />
                </div>
            ) :  (               
                <div>
                    <p>Next (None)</p>
                    <PokemonCard pokemon={missingNo} onSelect={() => {}} />
                </div>)
            } 
        </div>
    );
};
