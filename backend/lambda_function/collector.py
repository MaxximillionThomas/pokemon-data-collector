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


#############
# Quick test
#############
mewtwo_index = 150

# Fetch the Mewtwo overview data
mewtwo_data = fetch_pokemon_overview(mewtwo_index)

if (mewtwo_data): 
    # Save the data to the JSON file and upload it
    save_to_storage(mewtwo_index, mewtwo_data)
