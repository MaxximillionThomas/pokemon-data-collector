/**
 * Project:         Pokemon Data Collector
 * File:            PokemonCard.jsx
 * @purpose         Render the Overview data for a specific Pokemon.
 * @description     Displays Sprite, ID, Name, and Types for the overview list.
 * @author          Maxximillion Thomas
 * @date            February 28, 2026
 */

import { Card, Badge } from 'react-bootstrap';

/**
 * Renders a Pokemon card with overview information.
 * @param {Object} props - The component props.
 * @param {Object} props.pokemon - The pokemon data object.
 * @param {number} props.pokemon.id - The unique ID.
 * @param {string} props.pokemon.name - The name of the Pokemon.
 * @param {string[]} props.pokemon.types - List of Pokemon types.
 * @param {string} props.pokemon.sprite - URL to the Pokemon sprite.
 * @returns {JSX.Element} The rendered Pokemon card component.
 */
export function PokemonCard({ pokemon }) {
    return (
        <Card style={{ width: '18rem', margin: '10px' }}>
            {/* Sprite */}
            <Card.Img variant="top" src={pokemon.sprite} alt={pokemon.name} />
            <Card.Body>
                {/* Name and Id */}
                <Card.Title>#{pokemon.id} - {pokemon.name.toLocaleUpperCase()}</Card.Title>
                <div>
                    {/* Types */}
                    {pokemon.types.map(type => (
                        <Badge key={type} bg="info" className="me-1">{type}</Badge>
                    ))}
                </div>
            </Card.Body>
        </Card>
    );
}