<?php

function get_aqi_data($location, $state, $api_key, $country="USA", $distance=25) {
    try {
        // Determine if the location is a zip code or a city name
        try {
            $zip_code = intval($location);
            $params = array(
                "format" => "application/xml",
                "zipCode" => $zip_code,
                "distance" => $distance,
                "API_KEY" => $api_key
            );
        } catch (Exception $e) {
            $params = array(
                "format" => "application/xml",
                "city" => $location,
                "state" => $state,
                "country" => $country,
                "distance" => $distance,
                "API_KEY" => $api_key
            );
        }

        // Send the API request
        $url = "https://www.airnowapi.org/aq/observation/zipCode/current/";
        $response = file_get_contents($url . "?" . http_build_query($params));

        // Check if the response is successful
        if (!$response) {
            throw new Exception("No response from the AirNow API");
        }

        // Parse the XML response
        try {
            $root = new SimpleXMLElement($response);
        } catch (Exception $e) {
            throw new Exception("Failed to parse the XML response: " . $e->getMessage());
        }

        // Check if any data was returned
        if (!count($root->xpath("//")) > 0) {
            throw new Exception("No data returned by the AirNow API");
        }

        // Get the AQI score and category
        $aqi = (string)$root->xpath("//ObservedAQI")[0];
        $category = (string)$root->xpath("//Category/Name")[0];

        // Return the AQI data
        if ($zip_code) {
            return "Current AQI score in " . (string)$root->xpath("//ReportingArea")[0] . ": $aqi ($category)";
        } else {
            return "Current AQI score in $location, $state: $aqi ($category)";
        }

    } catch (Exception $e) {
        return "Error getting AQI data: " . $e->getMessage();
    }
}
?>
