"""
Project:        Pokemon Data Collector
File:           collector.py
Purpose:        AWS Lambda logic to fetch API data and save to cloud storage.
Description:    Defines the primary data collection function and API interaction.
Author:         Maxximillion Thomas
Date:           February 28, 2026
"""

import requests

def fetch_pokemon_overview(pokemon):
    """
    Fetch and filter the overview data for a specific Pokemon.
    """
    # Inject the target pokemon into the pokeapi link
    url = f"https://pokeapi.co/api/v2/pokemon/{pokemon.lower()}"

    # Request the data, attempting to parse the response and map it to desired pairs
    try:
        # Obtain the data
        response = requests.get(url)
        response.raise_for_status()
        raw_data = response.json()

        # Map the data
        overview_data = {
            "id": raw_data["id"],
            "name": raw_data["name"],
            "types": [t["type"]["name"] for t in raw_data["types"]],
            "sprite": raw_data["sprites"]["front_default"]
        }
        return overview_data        

    # If unsuccessful, print the error message to the terminal
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None