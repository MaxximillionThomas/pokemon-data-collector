<img src="https://d1xb64xlhesy7f.cloudfront.net/assets/logo.png" alt="LG 151 logo" width="125"/>

# **Pokémon Data Collector (LG 151)**
**A FireRed/LeafGreen-inspired Pokédex for Generation 1 Pokémon.**

## Explore
[![Static Badge](https://img.shields.io/badge/View_Pokedex-Click_here-brightgreen)](https://maxximillionthomas.github.io/pokemon-data-collector/)

## Overview
**LG 151 is a React-based Pokédex application built around a cloud-backed data pipeline** that keeps the browser fast by serving prebuilt Pokémon data.

A weekly AWS Lambda function fetches data for the first 151 Pokémon from the PokéAPI, then writes each record as a JSON file into an S3 bucket. That bucket is exposed through CloudFront, so the frontend loads ready-made data and sprite references from a CDN instead of making many direct API calls.

This makes the app feel responsive, reduces browser-side load, and keeps the dataset synchronized with a weekly update cycle.

## Key Features
- **Weekly cloud refresh**: A Lambda job updates the S3 dataset automatically on a weekly schedule.
- **CDN-hosted data**: The app fetches JSON files and other assets through CloudFront for consistent delivery.
- **Fast client experience**: Browser-side rendering uses prepared S3 content instead of live API queries.
- **URL-backed filters**: Search, sort, and type filters are encoded in the browser URL for easy sharing.
- **Mobile-friendly layout**: The UI adapts for smaller screens while keeping the content readable.

## How it works
- `backend/lambda_function/` is a copy of the code configured to AWS Lambda, for reference only.
- `lambda_function.py` is the Lambda entry point.
- It calls `collector.py`, which fetches Pokémon data from the PokéAPI and uploads it to S3.
- The data is stored in S3 as static JSON files, so the browser does not need a local database or direct API access.
- CloudFront sits in front of the S3 bucket and serves the stored JSON files from a fast global edge network.
- The frontend uses CloudFront URLs to read those JSON files and other assets.
- The result is a client app that loads data from a CDN instead of from API calls.

## Technology Used
**Backend**:
- **AWS Lambda**: Runs the update job in the cloud.
- **Amazon EventBridge**: Schedules the weekly run.
- **Amazon S3**: Stores the generated Pokémon JSON files.
- **Amazon CloudFront**: Serves data and sprite assets from the CDN.
- **Python**: Fetches PokéAPI data and uploads it to S3.

**Frontend**:
- **React** and **Vite**: Build the SPA.
- **React Router**: Keeps app state and URL in sync.
- **Bootstrap** and **React-Bootstrap**: Provide responsive UI components.
- **CSS**: Applies the retro theme and accessibility styling.

## Repository Structure
```text
pokemon-data-collector/
 ├── .github/workflows/
 │    └── static.yml
 ├── backend/
 │    └── lambda_function/
 │         ├── collector.py
 │         └── lambda_function.py
 └── frontend/
      ├── 404.html
      ├── index.html
      ├── package.json
      ├── vite.config.js
      └── src/
           ├── App.css
           ├── App.jsx
           ├── main.jsx
           ├── components/
           │    ├── PokemonCard.jsx
           │    ├── PokemonDetail.jsx
           │    ├── PokemonList.jsx
           │    ├── Toolbar.jsx
           │    └── toolbar/
           │         ├── ResetButton.jsx
           │         ├── SearchInput.jsx
           │         ├── ShinyToggle.jsx
           │         ├── SortControls.jsx
           │         └── TypeFiltering.jsx
           └── utils/
                └── helpers.js
```

## Installation & Setup

To run the frontend locally:

1. **Clone the repository**
```bash
git clone https://github.com/maxximillionthomas/pokemon-data-collector.git
```

2. **Open the frontend folder**
```bash
cd pokemon-data-collector/frontend
```

3. **Install dependencies**
```bash
npm install
```

4. **Start the local development server**
```bash
npm run dev
```

> Note: The backend data update process runs in the cloud, so you only need the frontend locally to view and test the app.

## Author

**Maxximillion Thomas**
