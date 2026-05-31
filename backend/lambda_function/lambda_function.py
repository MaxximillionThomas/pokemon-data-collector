"""
Project:        Pokemon Data Collector
File:           lambda_function.py
Purpose:        AWS Lambda entry point to automate weekly data updates.
Description:    Overrides local S3 initialization and executes the collection loop.
Author:         Maxximillion Thomas
Date:           May 30, 2026
"""

import sys
import os
import boto3
import collector 

# Force Python to look in the immediate execution root directory for collector.py
sys.path.append(os.path.dirname(os.path.realpath(__file__)))

# ==========  Declarations  ==========

# Set number of Pokemon to fetch data for
number_of_pokemon = 151

# ==========  Functions  ==========

def lambda_handler(event, context):
    """
    Entry point for fetching PokeApi data and updating S3 storage.  
    """

    try:
        # Override S3 client to use cloud IAM role instead of local credentials
        collector.S3 = boto3.client('s3')

        # Fetch and upload the data
        collector.upload_all_pokemon(number_of_pokemon)
        
        return {
            'statusCode': 200,
            'body': f'Successfully updated all {number_of_pokemon} Pokemon JSON files in S3.'
        }
    
    except Exception as e:
        print(f"Execution Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': f'Pipeline failure: {str(e)}'
        }