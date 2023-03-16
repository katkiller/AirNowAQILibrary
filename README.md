# AirNowAQILibrary
These are Python/js/php library's for retrieving air quality data from the AirNow API.


# example usage:
```
<?php
include 'aqi.php';

// Call the get_aqi_data function with a location and API key
$data = get_aqi_data('40222', 'KY', 'your_api_key');

// Print the AQI data
echo $data;
?>
```
--------------
```
getAQIData("40222", "KY", "your-api-key-here").then(console.log).catch(console.error);
```
---------
```
from airnow import get_aqi_data

location = "40222"
state = "KY"
api_key = "your_api_key_here"

aqi_data = get_aqi_data(location, state, api_key)
print(aqi_data)
```
# License
this is licensed under the GNU 3 License. See the LICENSE file for more information
