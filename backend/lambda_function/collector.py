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

def fetch_pokemon_overview(pokemon_id):
    """
    Fetch and filter the overview data for a specific Pokemon.
    """
    # Inject the target pokemon into the pokeapi link
    url = f'https://pokeapi.co/api/v2/pokemon/{pokemon_id}'

    # Request the data, attempting to parse the response and map it to desired pairs
    try:
        # Obtain the data
        response = requests.get(url)
        response.raise_for_status()
        raw_data = response.json()

        # Map the data
        overview_data = {
            'id': raw_data['id'],
            'name': raw_data['name'],
            'types': [t['type']['name'] for t in raw_data['types']],
            'sprite': raw_data['sprites']['front_default']
        }
        return overview_data        

    # If unsuccessful, print the error message to the terminal
    except requests.exceptions.RequestException as e:
        print(f'Error fetching data: {e}.')
        return None

def save_to_storage(pokemon_id, data):
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
    for pokemon_id in range(1, limit + 1):
        print(f'Processing data for Pokemon Id: {pokemon_id}...')
        
        # Fetch the data
        data = fetch_pokemon_overview(pokemon_id)

        # Push it to the cloud
        if (data):
            save_to_storage(pokemon_id, data)

        # Pause briefly between each request to respect API rate limits
        time.sleep(0.5)

    # Inform the user of the completion status
    print('Uploading complete!')

# ==========  Execution  ==========

if __name__ == '__main__':
    upload_all_pokemon(151)

