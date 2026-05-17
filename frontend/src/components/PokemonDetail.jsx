/**
 * Project:       Pokemon Data Collector
 * File:          PokemonDetail.jsx
 * @description   Detailed view component displaying species info, evolutions, and type matchups.
 * @author        Maxximillion Thomas
 * @date          March 4, 2026
 */

import { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
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
 * @param {string} props.pokemon.evolution_chain_url - API endpoint URL to fetch evolution chain data.
 * @param {Array<Object>} props.pokemonArray - The full list of Pokémon.
 * @param {Array<Object>} props.displayedPokemon - The currently filtered/sorted list for navigation.
 * @param {Function} props.onSelect - Callback to change the selected Pokémon in App state.
 * @param {number} props.itemsPerPage - Number of items shown per page.
 * @param {Function} props.setQuery - Callback to update the 'q' parameter in the URL and reset search filters. 
 * @param {Object} props.missingNo - The static bookend data object used when no previous/next Pokemon exists.
 * @returns {JSX.Element} A detailed view of the selected Pokemon with navigation capabilities.
 */
export function PokemonDetail({ pokemon, pokemonArray, displayedPokemon, onSelect, itemsPerPage, setQuery, missingNo }) {
    // ==========  Constants  ==========

    // Map out type effectiveness for Weaknesses
    const LEAF_GREEN_TYPE_CHART = {
        normal:   { weak: ['fighting'], resist: [], immune: ['ghost'] },
        fire:     { weak: ['water', 'ground', 'rock'], resist: ['fire', 'grass', 'ice', 'bug', 'steel'], immune: [] },
        water:    { weak: ['grass', 'electric'], resist: ['fire', 'water', 'ice', 'steel'], immune: [] },
        grass:    { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], resist: ['water', 'grass', 'electric', 'ground'], immune: [] },
        electric: { weak: ['ground'], resist: ['electric', 'flying', 'steel'], immune: [] },
        ice:      { weak: ['fire', 'fighting', 'rock', 'steel'], resist: ['ice'], immune: [] },
        fighting: { weak: ['flying', 'psychic'], resist: ['bug', 'rock', 'dark'], immune: [] },
        poison:   { weak: ['ground', 'psychic'], resist: ['grass', 'poison', 'fighting', 'bug'], immune: [] },
        ground:   { weak: ['water', 'grass', 'ice'], resist: ['poison', 'rock'], immune: ['electric'] },
        flying:   { weak: ['electric', 'ice', 'rock'], resist: ['grass', 'fighting', 'bug'], immune: ['ground'] },
        psychic:  { weak: ['bug', 'ghost', 'dark'], resist: ['psychic', 'fighting'], immune: [] },
        bug:      { weak: ['fire', 'poison', 'flying', 'rock'], resist: ['grass', 'fighting', 'ground'], immune: [] },
        rock:     { weak: ['water', 'grass', 'fighting', 'ground', 'steel'], resist: ['normal', 'fire', 'poison', 'flying'], immune: [] },
        ghost:    { weak: ['ghost', 'dark'], resist: ['poison', 'bug'], immune: ['normal', 'fighting'] },
        dragon:   { weak: ['ice', 'dragon'], resist: ['fire', 'water', 'grass', 'electric'], immune: [] },
        steel:    { weak: ['fire', 'fighting', 'ground'], resist: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'steel', 'dark'], immune: ['poison'] },
        dark:     { weak: ['fighting', 'bug'], resist: ['ghost', 'dark'], immune: ['psychic'] }
    };

    // Track overview page PokemonCard index (associated with currently open PokemonDetail)
    const currentIndex = displayedPokemon.findIndex(p => p.id === pokemon.id);
    const prevPokemon = displayedPokemon[currentIndex - 1];
    const nextPokemon = displayedPokemon[currentIndex + 1];

    // Evolution chain
    const [evoChain, setEvoChain] = useState([]);

    // ==========  Functions  ==========

    /**
     * Navigates to the previous Pokémon in the array, updating the page if necessary.
     */
    function handlePrev() {
        // There must be a Pokemon found at {pokemonArray[prevPokemon]}
        if (prevPokemon) {
            // Determine which page the PREVIOUS Pokemon should be found on
            const newIndex = currentIndex - 1;
            const newPage = Math.floor(newIndex / itemsPerPage) + 1

            // Update URL with Pokemon Id and new page number
            onSelect(prevPokemon, newPage);
        }
    }

    /**
     * Navigates to the next Pokémon in the array, updating the page if necessary.
     */
    function handleNext() {
        // There must be a Pokemon found at {pokemonArray[nextPokemon]}
        if (nextPokemon) {
            // Determine which page the NEXT Pokemon should be found on
            const newIndex = currentIndex + 1;
            const newPage = Math.floor(newIndex / itemsPerPage) + 1

            // Update URL with Pokemon Id and new page number
            onSelect(nextPokemon, newPage);
        }
    };

    /**
     * Recursively traverses an evolution chain object to extract species names and IDs.
     * @param {Object} chain - The evolution chain node from the PokeAPI.
     * @param {Object} chain.species - Contains the name and URL for the current evolution stage.
     * @param {Array} chain.evolves_to - An array of next-stage evolution objects.
     * @returns {Array<{name: string, id: number}>} An array of objects containing all Pokemon in the chain.
     */
    function extractEvolutionChain(chain) {
        let results = [];
        results.push({
            // Species identifies the root Pokemon (lowest in the chain)
            name: chain.species.name,
            // Get the number at the end of the url (e.g., https://pokeapi.co/api/v2/pokemon-species/4/)
            id: parseInt(chain.species.url.split('/').slice(-2, -1)[0])
        });

        // Uses recursion to do the above name/id grab for every evo in the chain, starting from the root (species)
        // Concatenate the results object (e.g., [{name: 'charmander', id: 4}]) with the results of the NEXT call 
        for (const evolution of chain.evolves_to) {
            results = results.concat(extractEvolutionChain(evolution));
        }

        // Only runs when chain.evolves_to iteration is complete (e.g., 3/3 evolutions concatenated)
        return results;
    }

    /**
     * Handles selection of a Pokemon from the evolution chain.
     * Resets search queries and selects the target Pokemon object from the master array.
     * @param {number} evolutionId - The Pokedex Id of the evolution stage clicked.
     */
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

    /**
     * Calculates the damage multipliers for every attacking type against the defender's types.
     * Categorizes results into weaknesses, resistances, and immunities based on the final multiplier.
     * @param {string[]} pokemonTypes - Array of the current Pokemon's types (e.g., ['Water', 'Flying']).
     * @returns {Object} An object containing arrays of types categorized by effectiveness.
     * @returns {string[]} return.weak - Types that deal > 1.0x damage.
     * @returns {string[]} return.resist - Types that deal > 0.0x and < 1.0x damage.
     * @returns {string[]} return.immune - Types that deal 0.0x damage.
     */
    function getTypeAffinities(pokemonTypes) {
        const affinities = { weak: [], resist: [], immune:[] };
        const defenderTypes = pokemonTypes.map(t => t.toLocaleLowerCase());

        // Iterate through each "attacking" type in the chart [fire, water, grass, ...]
        Object.keys(LEAF_GREEN_TYPE_CHART).forEach(attackerType => {
            let multiplier = 1.0;
            
            /*
            Check the effectiveness of the attacker type against each of the defenders types.
            The statement's multiplier is applied if defenderType is found in the array of the current statement.    
                
            Example:
                defenderTypes:  ['water', 'flying']
                attackerType:   ['grass']

                water type matchups: 
                    weak:       ['grass', 'electric']           true -> (x2.0)
                    resist:     ['fire', 'water', 'ice']
                    immune:     []
                flying type matchups: 
                    weak:       ['electric', 'ice', 'rock']
                    resist:     ['grass', 'fighting', 'bug']    true -> (x0.5)
                    immune:     ['ground']

                Outcome:        
                    2.0 x 0.5 = 1.0 multiplier (M) 
                    Not reported - must match one of [ M > 1 (weakness), 0 < M < 1 (resistance), M === 0 (immunity]               
            */
            defenderTypes.forEach(defender => {
                const defenderChart = LEAF_GREEN_TYPE_CHART[defender];
                if (defenderChart?.weak?.includes(attackerType)) multiplier *= 2.0;
                if (defenderChart?.resist?.includes(attackerType)) multiplier *= 0.5;
                if (defenderChart?.immune?.includes(attackerType)) multiplier *= 0.0;
            });

            if (multiplier > 1) affinities.weak.push(attackerType); 
            else if (0 < multiplier && multiplier < 1) affinities.resist.push(attackerType); 
            else if (multiplier === 0) affinities.immune.push(attackerType); 
        });

        return affinities;
    }

    // ==========  Use effects  ==========

    // Update the evolution chain
    useEffect(() => {
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
    // Runs on chain of evolution CHAIN (e.g.,: Charizard (runs) -> Charmeleon (skips))
    }, [pokemon.evolution_chain_url]);

    // ==========  Setup  ==========

    // Map out the [weaknesses, resistances, and immunities] of the Pokemon
    const affinities = getTypeAffinities(pokemon.types);

    // ==========  Rendering  ==========

    return (
        <div className="detail-view-container">

            {/* Overview button */}
            <div className="detail-back-actions">
                <div className="sticky-header-content">
                    <button onClick={() => onSelect(null)} >
                        ← BACK TO OVERVIEW
                    </button>

                    {/* Name and Id */}
                    <h1 className="text-center text-capitalize mb-0 fw-bold">
                        #{pokemon.id} - {pokemon.name}
                    </h1>
                </div>
            </div>

            <div className="detail-stage">

                {/* Preview - previous Pokemon */}
                <aside className="detail-nav-side">
                    <div className="sticky-nav-wrapper">
                        {prevPokemon ? (
                            <div>
                                <span className="nav-label">Previous</span>
                                <PokemonCard 
                                    pokemon={prevPokemon} 
                                    onSelect={handlePrev}
                                    isStatic={false}
                                />
                            </div>
                        ) : (
                            <div>
                                <span className="nav-label">Previous (None)</span>
                                <PokemonCard 
                                    pokemon={missingNo} 
                                    onSelect={() => {}} 
                                    isStatic={true}
                                />
                            </div>
                        )}
                    </div>
                </aside>

                <main className="detail-main-panel primary-border">

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
                                        <Badge key={type} className={`type-tag type-tag-${type.toLocaleLowerCase()} text-capitalize`}                                        >
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
                        <div className="evolution-chain-container sprite-row d-flex justify-content-center">
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

                    {/* Type Matchups */}
                    <h2 className="detail-section-title">Type Matchups</h2>
                    <section className="mt-4 mb-3">
                        <div className="detail-info-row align-items-stretch matchup-row">

                            {/* Weaknesses */}
                            <div className="info-item flex-1">
                                <h3 className="info-label">Weak</h3>
                                <div className="badge-container mt-2">
                                    {affinities.weak.length > 0 ? (
                                        affinities.weak.map(type => (
                                            <Badge key={type} className={`type-tag type-tag-${type.toLocaleLowerCase()} text-capitalize`}>
                                                {type}
                                            </Badge>
                                        ))
                                    ) : <Badge className="type-tag type-tag-none">None</Badge>}
                                </div>
                            </div>

                            {/* Resistances */}
                            <div className="info-item flex-1">
                                <h3 className="info-label">Resistant</h3>
                                <div className="badge-container mt-2">
                                    {affinities.resist.length > 0 ? (
                                        affinities.resist.map(type => (
                                            <Badge key={type} className={`type-tag type-tag-${type.toLocaleLowerCase()} text-capitalize`}>
                                                {type}
                                            </Badge>
                                        ))
                                    ) : <Badge className="type-tag type-tag-none">None</Badge>}
                                </div>
                            </div>

                            {/* Immunities */}
                            <div className="info-item flex-1">
                                <h3 className="info-label">Immune</h3>
                                <div className="badge-container mt-2">
                                    {affinities.immune.length > 0 ? (
                                        affinities.immune.map(type => (
                                            <Badge key={type} className={`type-tag type-tag-${type.toLocaleLowerCase()} text-capitalize`}                                        >
                                                {type}
                                            </Badge>
                                        ))
                                    ) : <Badge className="type-tag type-tag-none">None</Badge>}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Preview - next Pokemon */}
                <aside className="detail-nav-side">
                    <div className="sticky-nav-wrapper">
                        {nextPokemon ? (
                            <div>
                                <span className="nav-label">Next</span>
                                <PokemonCard 
                                    pokemon={nextPokemon} 
                                    onSelect={handleNext} 
                                    isStatic={false} 
                                />
                            </div>
                        ) : (
                            <div>
                                <span className="nav-label">Next (None)</span>
                                <PokemonCard 
                                    pokemon={missingNo} 
                                    onSelect={() => {}} 
                                    isStatic={true}
                                />
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};
