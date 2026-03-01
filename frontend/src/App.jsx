/**
 * Project:       Pokemon Data Collector
 * File:          App.jsx
 * @purpose       Frontend entry point for visualizing cloud-hosted Pokemon data.
 * @description   Main application layout and component routing.
 * @author        Maxximillion Thomas
 * @date          February 28, 2026
 */

import { PokemonCard } from './components/PokemonCard';

function App() {
  // Quick test
  const bulbasaur = {
    id: 1,
    name: "Bulbasaur",
    types: ["grass"],
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
  }

  return (
    <div className="container mt-5">
      <h1>Pokémon Data Collector</h1>
      {/* Quick test */}
      <PokemonCard pokemon={bulbasaur}/>
    </div>
  );
}

export default App; 