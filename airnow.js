async function getAQIData(location, state, apiKey, country = "USA", distance = 25) {
  try {
    // Determine if the location is a zip code or a city name
    let params;
    try {
      const zipCode = parseInt(location);
      params = {
        "format": "application/xml",
        "zipCode": zipCode,
        "distance": distance,
        "API_KEY": apiKey
      };
    } catch (error) {
      params = {
        "format": "application/xml",
        "city": location,
        "state": state,
        "country": country,
        "distance": distance,
        "API_KEY": apiKey
      };
    }

    // Send the API request
    const url = "https://www.airnowapi.org/aq/observation/zipCode/current/";
    const response = await fetch(url + "?" + new URLSearchParams(params));

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("API request failed with status " + response.status);
    }

    // Parse the XML response
    const xml = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    // Check if any data was returned
    if (!xmlDoc.getElementsByTagName("ObservedAQI")[0]) {
      throw new Error("No data returned by the AirNow API");
    }

    // Get the AQI score and category
    const aqi = xmlDoc.getElementsByTagName("ObservedAQI")[0].childNodes[0].nodeValue;
    const category = xmlDoc.getElementsByTagName("Name")[0].childNodes[0].nodeValue;

    // Return the AQI data
    if (isNaN(parseInt(location))) {
      return `Current AQI score in ${location}, ${state}: ${aqi} (${category})`;
    } else {
      return `Current AQI score in ${xmlDoc.getElementsByTagName("ReportingArea")[0].childNodes[0].nodeValue}: ${aqi} (${category})`;
    }

  } catch (error) {
    throw new Error("Error getting AQI data: " + error.message);
  }
}
