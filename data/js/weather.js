const token = '121ac8393d56134e64b1bbf02397a447e7d2c2d6611b17f1f8b129f2c9ad36a5'; // Replace with your API token

// Boutton d'affichage 
const searchButton = document.getElementById('show');
// Affichage ville actuel
const city = document.getElementById('ville');
// Affichage température actuel
const temp = document.getElementById('temperature');
// Affichage de la météo
const weather = document.getElementById('weather');
//Affichage de la descriptiion graphique de la météo 
const icon_weather = document.getElementById('main-icon');
// Affichege de la vitesse du vent
const wind = document.getElementById('wind');
// Affichage du taux d'hulidité
const humidite = document.getElementById('humidite');
// Affichage de la probabilité d'apparution de la pluie 
const rain = document.getElementById('rain');
// Affiche toute la partie des données météo par hours
const hours = document.getElementById('row-hours');
// Affiche toute la partie des données météo par jours 
const days = document.getElementById('days');
// Affichage de la dernière mise à jour des données météo 
const up = document.getElementById('update');

/** Trouve le groupe au quel appratient la condition météorologique */
let g = 'Inconnue';
function getGroupe(conditionsCode) {
    for (let groupe in groupesMeteo) {
        for (let c of groupesMeteo[groupe]) { // Changer 'c in groupe' à 'c of groupesMeteo[groupe]'
            if (c == conditionsCode) {
                g = groupe;
                console.log(c == conditionsCode + " if : " + g);
            }
        }
        console.log("for : " + g);
    }
    console.log("fonction : " + g);
    return g;
}

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

let g_meteo = "titoy";
/** Traitement de données */
function displayTemperature(inseeCode) {
    fetch(`https://api.meteo-concept.com/api/forecast/nextHours?token=${token}&insee=${inseeCode}&hourly=true&world=true`)
        .then(response => response.json())
        .then(data => {
            const codeWeather = data.forecast[0].weather;
            g_meteo = getGroupe(codeWeather);
            icon_weather.innerHTML = `<img src="/data/img/weather_icon/${g_meteo}.gif" alt="${g_meteo}">`
            up.innerHTML = `dernière maj ${data.update.slice(8, 10)}/${data.update.slice(5, 7)}/${data.update.slice(0, 4)}`;
            weather.innerHTML = `${conditionsMeteo[codeWeather]}`;
            weather_icon = `<img src='/data/img/weather_icon/${getGroupe(codeWeather)}.gif'>`
            temp.innerHTML = `${data.forecast[0].temp2m}°`;
            wind.innerHTML = `${data.forecast[0].wind10m}km/h`;
            humidite.innerHTML = `${data.forecast[0].rh2m}%`;
            rain.innerHTML = `${data.forecast[0].probarain}%`;
            hours.innerHTML = ``;

            for (var i = 1; i <= 5; i++) {
                g_meteo = getGroupe(data.forecast[i].weather);
                hours.innerHTML +=
                    `<div class="col-hours">
                    <div class="hours">
                        <h3><strong>${data.forecast[i].datetime.slice(11, 13)}H</strong></h3>
                    </div>
                    <div class="temp">
                        <h3>${data.forecast[i].temp2m}°</h3>
                    </div>
                    <div class="weather">
                        <img src="/data/img/weather_icon/${g_meteo}.gif" alt="${g_meteo}">
                    </div>
                </div>`;
            }
        })
        .catch(error => {
            temp.innerHTML = `An error occurred: ${error} `;
            hours.innerHTML = `An error occurred: ${error} `;
        });
    fetch(`https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=${inseeCode}&world=true`)
        .then(response => response.json())
        .then(data => {
            days.innerHTML = ``;
            var jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
            for (var i = 1; i <= 5; i++) {
                var maDate = new Date(data.forecast[i].datetime);
                var nomjour = jours[maDate.getDay()];
                g_meteo = getGroupe(data.forecast[i].weather);
                days.innerHTML +=
                    `<div class="col-days">
                    <div class="days">
                        <h3><strong>${nomjour}</strong></h3>
                    </div>
                    <div class="temp">
                        <h3>${data.forecast[i].tmin}°/${data.forecast[i].tmax}°</h3>
                    </div>
                    <div class="weather">
                        <img src="/data/img/weather_icon/${g_meteo}.gif" alt="${g_meteo}">
                    </div>
                </div>`;
            }
        }).catch(error => {
            days.innerHTML = `Erreur rencontrer : ${error}`;
        });
}