import requests
import xml.etree.ElementTree as ET

def get_aqi_data(api_key, location, state, country="USA", distance=25):
    try:
        # Determine if the location is a zip code or a city name
        try:
            zip_code = int(location)
            params = {
                "format": "application/xml",
                "zipCode": zip_code,
                "distance": distance,
                "API_KEY": api_key
            }
        except ValueError:
            params = {
                "format": "application/xml",
                "city": location,
                "state": state,
                "country": country,
                "distance": distance,
                "API_KEY": api_key
            }

        # Send the API request
        url = "https://www.airnowapi.org/aq/observation/zipCode/current/"
        response = requests.get(url, params=params)

        # Check if the response is successful
        response.raise_for_status()

        # Parse the XML response
        try:
            root = ET.fromstring(response.text)
        except ET.ParseError as e:
            raise ValueError(f"Failed to parse the XML response: {e}")

        # Check if any data was returned
        if not root.findall("./"):
            raise ValueError("No data returned by the AirNow API")

        # Get the AQI score and category
        aqi = root.findall("./ObservedAQI")[0].text
        category = root.findall("./Category/Name")[0].text

        # Return the AQI data
        if zip_code:
            return f"Current AQI score in {root.findall('./ReportingArea')[0].text}: {aqi} ({category})"
        else:
            return f"Current AQI score in {location}, {state}: {aqi} ({category})"

    except (requests.exceptions.HTTPError, ValueError) as e:
        return f"Error getting AQI data: {e}"
