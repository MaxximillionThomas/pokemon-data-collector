"""
Project:        Pokemon Data Collector
File:           collector.py
Purpose:        AWS Lambda logic to fetch API data and save to cloud storage.
Description:    Defines the primary data collection function and API interaction.
Author:         Maxximillion Thomas
Date:           February 28, 2026
"""

import requests
import json
import boto3
import time

# ==========  Declarations  ==========

# Define the S3 session constants
SESSION = boto3.Session(profile_name='pokemon-writer')
S3 = SESSION.client('s3')
BUCKET_NAME = 'pokemon-data-collector-s3'

# ==========  Functions  ==========

def fetch_pokemon_data(pokemon_id):
    """
    Fetch and filter the overview data for a specific Pokemon.
    """
    # Inject the target pokemon into the pokeapi link
    main_url = f'https://pokeapi.co/api/v2/pokemon/{pokemon_id}'

    # Request the data, attempting to parse the response and map it to desired pairs
    try:
        # Primary fetch (main data)
        main_response = requests.get(main_url)
        main_response.raise_for_status()
        main_data = main_response.json()
        
        # Secondary fetch (species data)
        species_url = main_data['species']['url']
        species_response = requests.get(species_url)
        species_response.raise_for_status()
        species_data = species_response.json()

        # Map the data
        mapped_data = {
            'id': main_data['id'],
            'name': main_data['name'],
            'types': [t['type']['name'] for t in main_data['types']],
            'spriteFront': main_data['sprites']['front_default'],
            'spriteBack': main_data['sprites']['back_default'], 
            'abilities': [a['ability']['name'] for a in main_data['abilities']],
            # Moves that the Pokemon learns 
            'learnset': [
                # Iterate through 2 sets of data simultaneously, saving the pairs where the conditions are met
                {
                    # Saved pair 1
                    'move': m['move']['name'],
                    # Saved pair 2
                    'level': detail['level_learned_at']
                }
                # Iteration set 1
                for m in main_data['moves']
                # Iteration set 2
                for detail in m['version_group_details']
                # Conditions (Gen 1 only, and learned from leveling up)
                if detail['version_group']['name'] == 'red-blue'
                and detail['move_learn_method']['name'] == 'level-up'
            ],
            # Pokedex entry (description) - must be in English and Gen 1
            'entry': next(
                # Description (ex: 'Cuando lanza una descarga de fuego supercaliente')
                e['flavor_text'] 
                for e in species_data['flavor_text_entries'] 
                if e['language']['name'] == 'en' and e['version']['name'] == 'red'
            ),
            'location': species_data['habitat']['name'] if species_data['habitat'] else 'unknown',
            'evolution_chain_url': species_data['evolution_chain']['url']
        }
        return mapped_data        

    # If unsuccessful, print the error message to the terminal
    except requests.exceptions.RequestException as e:
        print(f'Error fetching data: {e}.')
        return None
    
def cloud_pipeline(pokemon_id, data):
    """
    Save the PokeApi data for a specific Pokemon as a JSON file, pushing it to S3 cloud storage for future referencing.
    """
    # Define the storage path and name for the new JSON file
    file_name = f'pokemon-data/{pokemon_id}.json'

    # Upload the data to S3 bucket
    try:
        S3.put_object(
            Bucket=BUCKET_NAME,
            Key=file_name,
            Body=json.dumps(data),
            ContentType='application/json'
        )
        print(f'Successfully saved {file_name} to {BUCKET_NAME}.')

    except Exception as e:
        print(f'Failed to upload to S3: {e}.')

def upload_all_pokemon(limit): 
    """
    Iterate through the first *limit* Pokemon in PokeApi, fetching and uploading the data for each to S3.
    """
    success_counter = 0

    for pokemon_id in range(1, limit + 1):
        print(f'Processing data for Pokemon Id: {pokemon_id}...')
        
        # Fetch the data
        data = fetch_pokemon_data(pokemon_id)

        # Push it to the cloud
        if (data):
            cloud_pipeline(pokemon_id, data)
            success_counter += 1

        # Pause briefly between each request to respect API rate limits
        time.sleep(0.5)

    # Inform the user of the completion status
    print(f'Uploading complete! Successfully uploaded {success_counter} of {limit} Pokemon.')

# ==========  Execution  ==========

if __name__ == '__main__':
    upload_all_pokemon(151)
    # Quick testing (keeping for potential data additions)
    # data = fetch_pokemon_data(6)
    # for key,value in data.items():
    #     print(f'{key}: {value}')
    

