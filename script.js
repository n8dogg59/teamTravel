var virusKey = config.CORONA_KEY;
var weatherKey = config.WEATHER_API_KEY;
var city = "Austin";
var county = "";

$(document).ready(function() {    
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + weatherKey + "&units=imperial")
        .then(function(response) {
            if (response.ok) {
                return response.json().then(function (response) {
                    var latitude = response.coord.lat;
                    var longitude = response.coord.lon;
                    console.log(latitude);
                    console.log(longitude);
                    fetch("https://geo.fcc.gov/api/census/block/find?latitude=" + latitude + "&longitude=" + longitude + "&showall=true&format=json")
                        .then(function(response) {
                            if (response.ok) {
                                return response.json().then(function (response) {
                                    console.log(response);
                                    console.log(response.County.name);
                                    var county = response.County.name;
                                    
                                })
                            } else {
                                console.log(response);
                            }
                        })          
                })
            }
        })
    
        
console.log(county);

    fetch("https://coronavirus-smartable.p.rapidapi.com/stats/v1/US-TX/", {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": virusKey,
            "x-rapidapi-host": "coronavirus-smartable.p.rapidapi.com"
        }
    })
        .then(response => {
            return response.json().then(function (response) {
                console.log(response);
                var countyLength = response.stats.breakdowns;
                console.log(countyLength);
                for (i = 0; i < countyLength.length; i++) {
                    if (countyLength[i].location.county == "Travis") {
                        console.log("Total Confirmed Cases = " + countyLength[i].totalConfirmedCases);
                        console.log("Total Deaths = " + countyLength[i].totalDeaths);
                    }
                }
            })
        })
        .catch(err => {
            console.error(err);
        });
})