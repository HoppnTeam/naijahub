# Reverse Geocode Function

This function takes latitude and longitude coordinates and returns location details using the Google Places API.

## Required Environment Variables

- `GOOGLE_PLACES_API_KEY`: Your Google Places API key

## Usage

Send a POST request with the following JSON body:

```json
{
  "latitude": number,
  "longitude": number
}
```

The function will return location details including:
- Formatted address
- City
- State
- Place ID
- Original coordinates