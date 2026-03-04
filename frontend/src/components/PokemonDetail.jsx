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
 * @returns {JSX.Element} A detailed view of the selected Pokemon.
 */
export function PokemonDetail({ pokemon }) {
    // Track state of PokemonDetail VIEW
    const [detailOpen, setDetailOpen] = useState(false);

    return (
        <div>
            {/* Sprites and basic info */}
            <section>
                <div>
                    <img src={pokemon.spriteFront} alt={`${pokemon.name} front`} />
                    <img src={pokemon.spriteBack} alt={`${pokemon.name} back`} />
                </div>  

                <h1>{pokemon.id} - {pokemon.name}</h1>

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
                    <button onClick={() => setDetailOpen(!detailOpen)}>
                        {detailOpen ? 'Hide Learnset' : 'View Learnset'}
                    </button>
                    {detailOpen && <LearnsetTable learnset={pokemon.learnset} />}
                </div>
            </section>
        </div>
    );
};
