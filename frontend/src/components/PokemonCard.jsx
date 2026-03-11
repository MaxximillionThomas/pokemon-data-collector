/**
 * Project:         Pokemon Data Collector
 * File:            PokemonCard.jsx
 * @description     Displays Sprite, ID, Name, and Types for the overview list.
 * @author          Maxximillion Thomas
 * @date            February 28, 2026
 */

import { Card, Badge } from 'react-bootstrap';

/**
 * Renders a Pokemon card with overview information.
 * @param {Object} props - The component props.
 * @param {Object} props.pokemon - The full Pokemon data object retrieved from S3.
 * @param {number} props.pokemon.id - The unique ID (Pokedex number).
 * @param {string} props.pokemon.name - The name of the Pokemon.
 * @param {string[]} props.pokemon.types - List of Pokemon types.
 * @param {string} props.pokemon.spriteFront - URL to the Pokemon sprite (front).
 * @param {Function} props.onSelect - Callback function to handle selecting a Pokemon for the detail view.
 * @param {boolean} props.isShiny - Indicates whether to display the shiny versions of Pokemon sprites.
 * @returns {JSX.Element} The rendered Pokemon card component.
 */
export function PokemonCard({ pokemon, onSelect, isShiny }) {
    return (
        <Card style={{ width: '12rem', margin: '10px', cursor:'pointer'}} onClick={() => onSelect(pokemon)} >
            {/* Sprite */}
            <Card.Img variant="top" src={isShiny ? pokemon.spriteFrontShiny : pokemon.spriteFront} alt={pokemon.name} />
            <Card.Body>
                {/* Name and Id */}
                <Card.Title>#{pokemon.id}</Card.Title>
                <Card.Title>{pokemon.name.toLocaleUpperCase()}</Card.Title>
                <div>
                    {/* Types */}
                    {pokemon.types.map(type => (
                        <Badge key={type} bg="info" className="me-1 text-capitalize">{type}</Badge>
                    ))}
                </div>
            </Card.Body>
        </Card>
    );
}