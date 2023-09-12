const token = '121ac8393d56134e64b1bbf02397a447e7d2c2d6611b17f1f8b129f2c9ad36a5'; // Replace with your API token

const cityListElement = document.getElementById('city-list');
const searchButton = document.getElementById('search-button');
const forecastElement = document.getElementById('forecast');

searchButton.addEventListener('click', () => {
  const ville = document.getElementById('ville').value;
  cityListElement.innerHTML = 'Loading...';
  fetch(`https://api.meteo-concept.com/api/location/cities?token=${token}&search=${ville}`)
    .then(response => response.json())
    .then(data => {
      const cities = data.cities;
      if(cities.length>0){
        cityListElement.innerHTML = `<li>${cities[0].name} (${cities[0].insee.slice(0, 2)})</li>`
      }
      // Assuming you want to display the temperature for the first city in the list
      if (cities.length > 0) {
        const inseeCode = cities[0].insee;
        displayTemperature(inseeCode);
      } else {
        forecastElement.innerHTML = 'No cities found.';
      }
    })
    .catch(error => {
      cityListElement.innerHTML = `An error occurred: ${error}`;
    });
});

function displayTemperature(inseeCode) {
  fetch(`https://api.meteo-concept.com/api/forecast/daily/0?token=${token}&insee=${inseeCode}`)
    .then(response => response.json())
    .then(data => {
      const temperature = data.forecast.tmax;      
      forecastElement.innerHTML = `The maximum temperature for today is ${temperature}°C`;
    })
    .catch(error => {
      forecastElement.innerHTML = `An error occurred: ${error}`;
    });
}