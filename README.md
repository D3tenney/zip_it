# zip_it
## Introduction
Zip_it is a node API to return some basic information about zip codes.

The data comes from a dataset available at https://simplemaps.com/data/us-zips. Their license (as of 1/19/2021) allows the data to be used freely, even for commercial purposes, if attribution is provided. That's why all successful payloads returned by Zip_it contain `"source": "https://simplemaps.com/data/us-zips"`.

## Installation and Setup

### Cloning and Dependencies
- Clone the repository from GitHub (docs [here](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository))
- run `npm install` to install dependencies listed in `package.json`
- run `cp .env.example .env` to create `.env` file. Unless you're altering the sequelize setup, it should be good to go. If you do use another database that requires user credentials, the `.env` file would be a great place to store them.

### Data setup
- Zip_it uses [sequelize](https://sequelize.org/) as an ORM. It comes set up to work with a sqlite database at `/db/zipcode_db.sqlite`. To connect it to a different sequelize-compatible database (postgres, mysql, etc...), just alter the connection uri in `sequelize.js` and install the appropriate package (see [sequelize docs](https://sequelize.org/master/manual/getting-started.html)).
- To create the sqlite database using the .csv file from simplemaps, download the data ([here](https://simplemaps.com/data/us-zips)) and unzip it into `/db/zip_data/`, then you can use the provided `/db/db_setup.py` script to create `/db/zipcode_db.sqlite`. I chose to do this in python because it was quick and easy. You can use any tool you'd like - it doesn't affect how the API will interact with the database. Just follow the `CREATE TABLE` statement from `/db/db_setup.py`.

### App setup
- run `npm run dev` to run in a development environment with nodemon. This will allow you to play with the app, make changes and have the app restart to reflect them in real-time.

## Use
Zip_it uses url-encoded parameters.

Zip_it offers two endpoints: `zip` and `state`.

- The `zip` endpoint requires a 5-digit zipcode and returns the following information about that zipcode (as described on https://simplemaps.com/data/us-zips):
  - zip: The 5-digit zip code assigned by the U.S. Postal Service.
  - lat: The latitude of the zip code.
  - lng: The longitude of the zip code.
  - city: The official USPS city name.
  - state_id: The official USPS state abbreviation.
  - state_name: The state's name.
  - zcta: TRUE if the zip code is a Zip Code Tabulation area.
  - parent_zcta: The ZCTA that contains this zip code. Only exists if zcta is FALSE. Useful for making inferences about a zip codes that is a point from the ZCTA that contains it.
  - population: An estimate of the zip code's population. Only exists if zcta is TRUE.
  - density: The estimated population per square kilometer. Only exists if zcta is TRUE.
  - county_fips: The zip's primary county in the FIPS format.
  - county_name: The name of the county_fips.
  - county_weights: A JSON dictionary listing all county_fips and their weights (by population) associated with the zip code.
  - county_names_all: The name of all counties that overlap the zip. (e.g. Maricopa|Pinal).
  - county_fips_all: The 5-digit FIPS code for all counties that overlap the zip. (e.g. 04013|04021)
  - imprecise: TRUE if the lat/lng has been geolocated using the city (rare).
  - military: TRUE if the zip code is used by the US Military (lat/lng not available).
  - timezone: The city's time zone in the tz database format. (e.g. America/Los_Angeles)


- The `state` endpoint requires a state abbreviation (capitalized) and returns an array of dictionaries, each containing the above fields for one zipcode in the state.

## Examples:
### `zip` endpoint
`curl http://localhost:4242/zip/90210` returns:
```
{
    "data": {
        "zip": "90210",
        "lat": "34.10103",
        "lng": "-118.41476",
        "city": "Beverly Hills",
        "state_id": "CA",
        "state_name": "California",
        "zcta": "TRUE",
        "parent_zcta": "",
        "population": "19909",
        "density": "829.1",
        "county_fips": "06037",
        "county_name": "Los Angeles",
        "county_weights": "{'06037':100}",
        "county_names_all": "Los Angeles",
        "county_fips_all": "06037",
        "imprecise": "FALSE",
        "military": "FALSE",
        "timezone": "America/Los_Angeles"
    },
    "source": "https://simplemaps.com/data/us-zips",
    "message": "OK"
}
```

Requesting an invalid zipcode:

`curl http://localhost:4242/zip/9` returns:

```
{
    "message": "data not found for zipcode: 9"
}
```
with status 404.

## `state` endpoint
`curl http://localhost:4242/state/RI` returns:
```
{
    "data": [
        {
            "zip": "02802",
            "lat": "41.95195",
            "lng": "-71.45534",
            "city": "Albion",
            "state_id": "RI",
            "state_name": "Rhode Island",
            "zcta": "TRUE",
            "parent_zcta": "",
            "population": "671",
            "density": "1552.1",
            "county_fips": "44007",
            "county_name": "Providence",
            "county_weights": "{'44007':100}",
            "county_names_all": "Providence",
            "county_fips_all": "44007",
            "imprecise": "FALSE",
            "military": "FALSE",
            "timezone": "America/New_York"
        },
        {
            "zip": "02804",
            "lat": "41.43188",
            "lng": "-71.77236",
            "city": "Ashaway",
            "state_id": "RI",
            "state_name": "Rhode Island",
            "zcta": "TRUE",
            "parent_zcta": "",
            "population": "2004",
            "density": "99.7",
            "county_fips": "44009",
            "county_name": "Washington",
            "county_weights": "{'44009':100}",
            "county_names_all": "Washington",
            "county_fips_all": "44009",
            "imprecise": "FALSE",
            "military": "FALSE",
            "timezone": "America/New_York"
        },
        ... (75 more zipcodes)
    ],
    "source": "https://simplemaps.com/data/us-zips",
    "message": "OK"
}
```

Requesting a state abbreviation that is not found:

`curl http://localhost:4242/state/R` returns:

```
{
    "message": "no data found for state: R"
}
```
with status 404.

## Resources
### Sequelize:
- https://www.codementor.io/@mirko0/how-to-use-sequelize-with-node-and-express-i24l67cuz

### Logging:
- https://itnext.io/setup-logger-for-node-express-app-9ef4e8f73dac
