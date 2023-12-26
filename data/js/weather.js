const token = 'api key'; // Replace with your API token

const searchButton = document.getElementById('show');
const temp = document.getElementById('temperature');
const weather = document.getElementById('weather');
const city = document.getElementById('ville');
const hours = document.getElementById('row-hours');
const wind = document.getElementById('wind');
const humidite = document.getElementById('humidite');
const rain = document.getElementById('rain');
const up = document.getElementById('update');
const days = document.getElementById('days');

searchButton.addEventListener('click', () => {
    const ville = document.getElementById('search-input').value;
    console.log(ville);
    city.innerHTML = 'Loading...';
    fetch(`https://api.meteo-concept.com/api/location/cities?token=${token}&search=${ville}&world=true`)
        .then(response => response.json())
        .then(data => {
            const cities = data.cities;
            if (cities.length > 0) {
                city.innerHTML = `${data.cities[0].name} (${data.cities[0].insee.slice(0, 2)})`
            }
            // Assuming you want to display the temperature for the first city in the list
            if (cities.length > 0) {
                const inseeCode = data.cities[0].insee;
                displayTemperature(inseeCode);
            } else {
                city.innerHTML = 'Aucune ville trouver.';
            }
        })
        .catch(error => {
            city.innerHTML = `Erreur rencontré : ${error}`;
        });
});

function displayTemperature(inseeCode) {
    fetch(`https://api.meteo-concept.com/api/forecast/nextHours?token=${token}&insee=${inseeCode}&hourly=true&world=true`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            up.innerHTML = `${data.update.slice(8, 10)}/${data.update.slice(5, 7)}/${data.update.slice(0, 4)}`;
            const codeWeather = data.forecast[0].weather;
            weather.innerHTML = `${conditionsMeteo[codeWeather]}`;
            temp.innerHTML += `${data.forecast[0].temp2m}°`;
            wind.innerHTML = `${data.forecast[0].wind10m}km/h`;
            humidite.innerHTML = `${data.forecast[0].rh2m}%`;
            rain.innerHTML = `${data.forecast[0].probarain}%`;
            for (var i = 1; i <= 5; i++) {
                hours.innerHTML +=
                    `<div class="col-hours">
                    <div class="hours">
                        <h3>${data.forecast[i].datetime.slice(11, 13)}H</h3>
                    </div>
                    <div class="temp">
                        <h3>${data.forecast[i].temp2m}°</h3>
                    </div>
                    <div class="weather">
                        <h3>${conditionsMeteo[data.forecast[i].weather]}</h3>
                    </div>
                </div>`;
            }
        })
        .catch(error => {
            temp.innerHTML = `An error occurred: ${error} `;
        });
    fetch(`https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=${inseeCode}&world=true`)
        .then(response => response.json())
        .then(data => {

            var jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
            for (var i = 1; i <= 5; i++) {
                var maDate = new Date(data.forecast[i].datetime);
                var nomjour = jours[maDate.getDay()];
                days.innerHTML +=
                    `<div class="col-days">
                    <div class="days">
                        <h3>${nomjour}</h3>
                    </div>
                    <div class="temp">
                        <h3>${data.forecast[i].tmin}°/${data.forecast[i].tmax}°</h3>
                    </div>
                    <div class="weather">
                        <h3>${conditionsMeteo[data.forecast[i].weather]}</h3>
                    </div>
                </div>`;
            }
        }).catch(error => {
            days.innerHTML = `Erreur rencontrer : ${error}`;
        });
}
