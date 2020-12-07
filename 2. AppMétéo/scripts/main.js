import tabJoursEnOrdre from './Utilitaire/gestionTemps.js';


const CLEAPI = '96afa3bc60fa86c63e16bbfe0c2b5b13';
let resultatsApi;

const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const heure = document.querySelectorAll('.heure-nom-prevision');
const tempPourH = document.querySelectorAll('.heure-prevision-valeur');
const joursDiv = document.querySelectorAll('.jour-prevision-nom');
const tempJoursDiv = document.querySelectorAll('.jour-prevision-temps');
const imgIcone = document.querySelector('.logo-meteo');
const chargementContainer = document.querySelector('.overlay-icone-chargement');    

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {

       let long = position.coords.longitude;
       let lat = position.coords.latitude;
       AppelApi(long, lat);

    }, () => {
        alert(`vous avez refusé la géolocalisation, veuillez l'activer`)
    })
}

function AppelApi(long, lat) {

   fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEAPI}`)
   .then((reponse) => {
       return reponse.json();
   })
   .then((data) => {
         resultatsApi = data;
            // console.log(data);
         temps.innerText = resultatsApi.current.weather[0].description;
         temperature.innerText = `${Math.trunc(resultatsApi.current.temp)}°`;
         localisation.innerText = resultatsApi.timezone;


        //  Les heures par tranches de 3; avec leur temperature 
        let heureActuelle = new Date().getHours();

        for (let i = 0; i < heure.length; i++) {

            let heureIncr = heureActuelle + i * 3;

            if(heureIncr > 24){
                heure[i].innerText = `${heureIncr - 24} h`;
            }
            else if(heureIncr === 24) {
                heure[i].innerText = "00 h";
            }
            else {
                heure[i].innerText = `${heureIncr} h`;
            }
            
        }

        // Temps pour 3h 

        for (let j = 0; j < tempPourH.length; j++) {
            tempPourH[j].innerText = `${Math.trunc(resultatsApi.hourly[j * 3].temp)}°`   
        }

        // 3 premieres lettres des jours 

        for (let k = 0; k < tabJoursEnOrdre.length; k++) {
            joursDiv[k].innerText = tabJoursEnOrdre[k].slice(0, 3);   
        }

        // Temps par jour 

        for (let m = 0; m < 7; m++) {
            tempJoursDiv[m].innerText = `${Math.trunc(resultatsApi.daily[m + 1].temp.day)}° `
        }

        // Icone dynamique 

        if(heureActuelle >= 6 && heureActuelle < 17){
            imgIcone.src = `ressources/jour/${resultatsApi.current.weather[0].icon}.svg`
        }
        else {
            imgIcone.src = `ressources/nuit/${resultatsApi.current.weather[0].icon}.svg`
        }

        chargementContainer.classList.add('disparition');
   })

}

