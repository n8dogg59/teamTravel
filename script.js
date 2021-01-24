var virusKey = config.CORONA_KEY;
var weatherKey = config.WEATHER_API_KEY;
var city = "Austin";
var county = "";

$(document).ready(function() {    
    
    // This function gets the county from the city by getting the longitude and latitude of the city first then finding the county.
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

    // This function get the total confirmed cases for the county.  It's the total overall cases from the start of the pandemic and not
    //just the total recent cases.  We still need to figure out how to pass the county into this function because it's manually entered
    // right now.
    fetch("https://coronavirus-smartable.p.rapidapi.com/stats/v1/US-TX/", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "virusKey",
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

    // This function gets the total new cases for each week.  The state data is manually added to the fetch but we should be able
    // to get that from the input from the user or if we don't have them input the state then we'll get it from the city in another
    // fetch and pass it in.
        fetch("https://api.covidtracking.com/v1/states/ca/daily.json")
        .then(function(response) {
            if (response.ok) {
                return response.json().then(function (response) {
                    console.log(response);
                    var dailyCases = response[1].positiveIncrease;
                    console.log(dailyCases);
                    var weekOneTotalCases = 0;
                    var weekTwoTotalCases = 0;
                    var weekThreeTotalCases = 0;
                    var weekFourTotalCases = 0;
                    var weekFiveTotalCases = 0;
                    for (i = 0; i < 35; i++) {
                        if (i < 7) {
                            var weekOneTotalCases = weekOneTotalCases + response[i].positiveIncrease;
                        } else if (i > 6 && i < 14) {
                            var weekTwoTotalCases = weekTwoTotalCases + response[i].positiveIncrease;
                        } else if (i > 13 && i < 21) {
                            var weekThreeTotalCases = weekThreeTotalCases + response[i].positiveIncrease;
                        } else if (i > 20 && i < 28) {
                            var weekFourTotalCases = weekFourTotalCases + response[i].positiveIncrease;
                        } else if (i > 27 && i < 35) {
                            var weekFiveTotalCases = weekFiveTotalCases + response[i].positiveIncrease;
                        }
                    }
                    console.log(weekOneTotalCases);  
                    console.log(weekTwoTotalCases);                    
                    console.log(weekThreeTotalCases);                    
                    console.log(weekFourTotalCases);                    
                    console.log(weekFiveTotalCases);                    
                })
            } else {
                console.log(response);
            }
        })    
})
