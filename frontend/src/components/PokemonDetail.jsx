/**
 * Project:       Pokemon Data Collector
 * File:          PokemonDetail.jsx
 * @description   Detailed view component displaying species info, evolution, and learnsets.
 * @author        Maxximillion Thomas
 * @date          March 4, 2026
 */

import { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { LearnsetTable } from './LearnsetTable';
import { PokemonCard } from './PokemonCard';

/**
 * Renders the full details of a specific Pokemon.
 * @param {Object} props - The component props.
 * @param {Object} props.pokemon - The full Pokemon data object retrieved from S3.
 * @param {number} props.pokemon.id - The unique ID (Pokedex number).
 * @param {string} props.pokemon.name - The name of the Pokemon.
 * @param {string[]} props.pokemon.types - List of Pokemon types.
 * @param {string} props.pokemon.spriteFront - URL to the Pokemon sprite (front).
 * @param {string} props.pokemon.spriteBack - URL to the Pokemon sprite (back).
 * @param {string} props.pokemon.spriteFrontShiny - URL to the Pokemon shiny sprite (front).
 * @param {string} props.pokemon.spriteBackShiny - URL to the Pokemon shiny sprite (back).
 * @param {string} props.pokemon.entry - Pokedex entry (description of the Pokemon).
 * @param {string} props.pokemon.location - Pokemon habitat/location.
 * @param {string[]} props.pokemon.abilities - List of abilities.
 * @param {Array<Object>} props.pokemon.learnset - List of moves and levels learned at.
 * @param {string} props.pokemon.evolution_chain_url - API endpoint URL to fetch evolution chain data.
 * @param {Array<Object>} props.pokemonArray - The full list of Pokémon.
 * @param {Array<Object>} props.displayedPokemon - The currently filtered/sorted list for navigation.
 * @param {Function} props.onSelect - Callback to change the selected Pokémon in App state.
 * @param {Function} props.setCurrentPage - Callback to update the 'page' parameter in the URL. 
 * @param {number} props.itemsPerPage - Number of items shown per page.
 * @param {Function} props.setQuery - Callback to update the 'q' parameter in the URL and reset search filters. 
 * @returns {JSX.Element} A detailed view of the selected Pokemon with navigation capabilities.
 */
export function PokemonDetail({ pokemon, pokemonArray, displayedPokemon, onSelect, setCurrentPage, itemsPerPage, setQuery }) {
    // Track state of learnset visibility
    const [learnsetVisible, setLearnsetVisible] = useState(false);

    // Track overview page PokemonCard index (associated with currently open PokemonDetail)
    const currentIndex = displayedPokemon.findIndex(p => p.id === pokemon.id);
    const prevPokemon = displayedPokemon[currentIndex - 1];
    const nextPokemon = displayedPokemon[currentIndex + 1];

    // Evolution chain
    const [evoChain, setEvoChain] = useState([]);

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
            // Determine which page the PREVIOUS Pokemon should be found on
            const newIndex = currentIndex - 1;
            const newPage = Math.floor(newIndex / itemsPerPage) + 1

            setCurrentPage(newPage);
            onSelect(prevPokemon);
        }
    }

    /**
     * Navigates to the next Pokémon in the array, updating the page if necessary.
     */
    function handleNext() {
        // There must be a Pokemon found at {pokemonArray[nextPokemon]}
        if (nextPokemon) {
            // Determine which page the  NEXT Pokemon should be found on
            const newIndex = currentIndex + 1;
            const newPage = Math.floor(newIndex / itemsPerPage) + 1

            setCurrentPage(newPage);
            onSelect(nextPokemon);
        }
    };

    function extractEvolutionChain(chain) {
        let results = [];
        results.push({
            // Species identifies the root Pokemon (lowest in the chain)
            name: chain.species.name,
            // Get the number at the end of the url (ex: https://pokeapi.co/api/v2/pokemon-species/4/)
            id: parseInt(chain.species.url.split('/').slice(-2, -1)[0])
        });

        // Uses recursion to do the above name/id grab for every evo in the chain, starting from the root (species)
        // Concatenate the results object (ex: [{name: 'charmander', id: 4}]) with the results of the NEXT call 
        for (const evolution of chain.evolves_to) {
            results = results.concat(extractEvolutionChain(evolution));
        }

        // Only runs when chain.evolves_to iteration is complete (ex: 3/3 evolutions concatenated)
        return results;
    }

    // Update the evolution chain
    useEffect(() => {
        console.log(pokemon.evolution_chain_url);
        async function fetchChain() {
            try {
                const response = await fetch(pokemon.evolution_chain_url);
                const data = await response.json();
                setEvoChain(extractEvolutionChain(data.chain));

            } catch (error) {
                console.error(`Failed to fetch evolution chain for Id ${pokemon.id}: ${error}.`);
            }
        }
        fetchChain();
    // Runs on chain of evolution CHAIN (ex: Charizard (runs) -> Charmeleon (skips))
    }, [pokemon.evolution_chain_url]);

    function handleEvolutionClick(evolutionId) {
        // Identify which Pokemon was clicked in the evo div
        const targetPokemon = pokemonArray.find(p => p.id === evolutionId);

        // If a Pokemon was found (not a blank evo div clicked)
        if (targetPokemon) {
            // Reset overview results and select the Pokemon
            setQuery('');
            onSelect(targetPokemon);
        } 
    }

    return (
        <div className="detail-view-container">

            {/* Overview button */}
            <div className="detail-back-actions">
                <button onClick={() => onSelect(null)}>
                    ← BACK TO OVERVIEW
                </button>
            </div>

            <div className="detail-stage">

                {/* Preview - previous Pokemon */}
                <aside className="detail-nav-side">
                    {prevPokemon ? (
                        <div onClick={handlePrev}>
                            <span className="nav-label">Previous</span>
                            <PokemonCard pokemon={prevPokemon} onSelect={onSelect} />
                        </div>
                    ) : (
                        <div>
                            <span className="nav-label">Previous (None)</span>
                            <PokemonCard pokemon={missingNo} onSelect={() => {}} />
                        </div>
                    )}
                </aside>

                <main className="detail-main-panel">

                    {/* Name and Id */}
                    <h1 className="text-center text-capitalize mb-4 fw-bold">
                        #{pokemon.id} - {pokemon.name}
                    </h1>

                    {/* Sprites */}
                    <section className="mt-4">
                        <div className="detail-sprite-showcase">
        
                            {/* Normal sprites */}
                            <div className="sprite-row mb-3">
                                <div className="sprite-unit">
                                    <img src={pokemon.spriteFront} alt={`${pokemon.name} front`} />
                                    <p>Front</p>
                                </div>

                                <div className="sprite-unit">
                                    <img src={pokemon.spriteBack} alt={`${pokemon.name} back`} />
                                    <p>Back</p>
                                </div>
                            </div>

                            {/* Shiny sprites */}
                            <div className="sprite-row mb-3">
                                <div className="sprite-unit">
                                    <img src={pokemon.spriteFrontShiny} alt={`${pokemon.name} front shiny`} />
                                    <p>Front (Shiny)</p>
                                </div>

                                <div className="sprite-unit">
                                    <img src={pokemon.spriteBackShiny} alt={`${pokemon.name} back shiny`} />
                                    <p>Back (Shiny)</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pokedex info */}
                    <h2 className="detail-section-title">Pokédex Info</h2>
                    <section className="mt-4">

                        {/* Description */}
                        <h3 className="info-label">Description</h3>
                        <p className="lead">{pokemon.entry.replace(/[\n\f]/g, ' ')}</p>
                        <div className="detail-info-row">

                            {/* Habitat */}
                            <div className="info-item">
                                <h3 className="info-label">Habitat</h3>
                                <div className="text-capitalize">{pokemon.location === 'rare' ? 'Unknown' : pokemon.location}</div>
                            </div>

                            {/* Types */}
                            <div className="info-item">
                                <h3 className="info-label">Types</h3>
                                <div className="d-flex gap-2">
                                    {pokemon.types.map(type => (
                                        <Badge 
                                            key={type} 
                                            bg="info" 
                                            className="text-capitalize px-3 py-2"
                                        >
                                            {type}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Evolution chain */}
                    <section className="mt-4">
                        <h3 className="detail-section-title">Evolution Chain</h3>
                        <div className="evolution-chain-container d-flex justify-content-center gap-4">
                            {evoChain.map((evo) => {
                                const evoData = pokemonArray.find(p => p.id === evo.id);

                                return (
                                    <div 
                                        key={evo.id} 
                                        className="sprite-unit" 
                                        onClick={() => handleEvolutionClick(evo.id)}  
                                        style={{cursor:'pointer'}}
                                    >
                                        {evoData && (
                                            <div>
                                                <img src={evoData.spriteFront} alt={evo.name} />
                                                <p className="text-capitalize fw-bold">{evo.name}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Technicals */}
                    <h2 className="detail-section-title">Technicals</h2>
                    <section className="mt-4">

                        {/* Abilities */}
                        <h3 className="info-label">Abilities</h3>
                        <ul className="list-unstyled">
                            {pokemon.abilities.map((ability, index) => (
                                <li key={index} className="text-capitalize">● {ability}</li>
                            ))}
                        </ul>

                        {/* Learnset */}
                        <h3 className="info-label">Learnset</h3>
                        <button className="btn btn-outline-primary" onClick={() => setLearnsetVisible(!learnsetVisible)}>
                            {learnsetVisible ? 'Hide Learnset' : 'View Learnset'}
                        </button>
                        
                        <div className="col-md-6 text-center">
                            {learnsetVisible && (
                                <div className="mt-4"> 
                                    <LearnsetTable learnset={pokemon.learnset} /> 
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                {/* Preview - next Pokemon */}
                <aside className="detail-nav-side">
                    {nextPokemon ? (
                        <div onClick={handleNext}>
                            <span className="nav-label">Next</span>
                            <PokemonCard pokemon={nextPokemon} onSelect={onSelect} />
                        </div>
                    ) : (
                        <div>
                            <span className="nav-label">Next (None)</span>
                            <PokemonCard pokemon={missingNo} onSelect={() => {}} />
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};
