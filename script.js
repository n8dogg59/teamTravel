var virusKey = config.CORONA_KEY;
var weatherKey = config.WEATHER_API_KEY;
var countyPopKey = config.COUNTY_POP_KEY;
var county = "";
var stateCountry = "US-TX"; // we'll need to get the state name from the html input element
var state = "tx"; // we'll need to get the state name from the html input element
var week1CasesEl = document.querySelector("#week1Cases");
var week2CasesEl = document.querySelector("#week2Cases");
var week3CasesEl = document.querySelector("#week3Cases");
var week4CasesEl = document.querySelector("#week4Cases");
var stateAbbr = "";
var cityStateArr = [{"name": "Alabama", "abbreviation": "AL"},
    {"name": "Alaska","abbreviation": "AK"},
    {"name": "American Samoa", "abbreviation": "AS"},
    {"name": "Arizona", "abbreviation": "AZ"},
    {"name": "Arkansas","abbreviation": "AR"},
    {"name": "California", "abbreviation": "CA"},
    {"name": "Colorado", "abbreviation": "CO"},
    {"name": "Connecticut", "abbreviation": "CT"},
    {"name": "Delaware", "abbreviation": "DE"},
    {"name": "District Of Columbia", "abbreviation": "DC"},
    {"name": "Federated States Of Micronesia", "abbreviation": "FM"},
    {"name": "Florida","abbreviation": "FL"},
    {"name": "Georgia", "abbreviation": "GA"},
    {"name": "Guam", "abbreviation": "GU"},
    {"name": "Hawaii", "abbreviation": "HI"},
    {"name": "Idaho", "abbreviation": "ID"},
    {"name": "Illinois", "abbreviation": "IL"},
    {"name": "Indiana", "abbreviation": "IN"},
    {"name": "Iowa", "abbreviation": "IA"},
    {"name": "Kansas", "abbreviation": "KS"},
    {"name": "Kentucky", "abbreviation": "KY"},
    {"name": "Louisiana", "abbreviation": "LA"},
    {"name": "Maine", "abbreviation": "ME"},
    {"name": "Marshall Islands", "abbreviation": "MH"},
    {"name": "Maryland", "abbreviation": "MD"},
    {"name": "Massachusetts", "abbreviation": "MA"},
    {"name": "Michigan", "abbreviation": "MI"},
    {"name": "Minnesota", "abbreviation": "MN"},
    {"name": "Mississippi", "abbreviation": "MS"},
    {"name": "Missouri", "abbreviation": "MO"},
    {"name": "Montana", "abbreviation": "MT"},
    {"name": "Nebraska", "abbreviation": "NE"},
    {"name": "Nevada", "abbreviation": "NV"},
    {"name": "New Hampshire", "abbreviation": "NH"},
    {"name": "New Jersey", "abbreviation": "NJ"},
    {"name": "New Mexico", "abbreviation": "NM"},
    {"name": "New York", "abbreviation": "NY"},
    {"name": "North Carolina", "abbreviation": "NC"},
    {"name": "North Dakota", "abbreviation": "ND"},
    {"name": "Northern Mariana Islands", "abbreviation": "MP"},
    {"name": "Ohio", "abbreviation": "OH"},
    {"name": "Oklahoma", "abbreviation": "OK"},
    {"name": "Oregon", "abbreviation": "OR"},
    {"name": "Palau", "abbreviation": "PW"},
    {"name": "Pennsylvania", "abbreviation": "PA"},
    {"name": "Puerto Rico", "abbreviation": "PR"},
    {"name": "Rhode Island", "abbreviation": "RI"},
    {"name": "South Carolina", "abbreviation": "SC"},
    {"name": "South Dakota", "abbreviation": "SD"},
    {"name": "Tennessee", "abbreviation": "TN"},
    {"name": "Texas", "abbreviation": "TX"},
    {"name": "Utah", "abbreviation": "UT"},
    {"name": "Vermont", "abbreviation": "VT"},
    {"name": "Virgin Islands", "abbreviation": "VI"},
    {"name": "Virginia", "abbreviation": "VA"},
    {"name": "Washington", "abbreviation": "WA"},
    {"name": "West Virginia", "abbreviation": "WV"},
    {"name": "Wisconsin", "abbreviation": "WI"},
    {"name": "Wyoming", "abbreviation": "WY"}]

$(document).ready(function() {    
    
    function getCityState() {
        // This function will get the city and state from the airport code the user inputs
        fetch("https://airport-info.p.rapidapi.com/airport?iata=AUS", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "d0d36869f4msh08f660e28e5060bp1aef27jsncfbd043899ea",
                "x-rapidapi-host": "airport-info.p.rapidapi.com"
            }
        })
            .then(response => {
                return response.json().then(function (response) {
                    var searchedCity = response.city;
                    var searchedState = response.state;
                    console.log(response);
                    console.log(cityStateArr);
                    for (i = 0; i < cityStateArr.length; i++) {
                        if (cityStateArr[i].name === searchedState) {
                            stateAbbr = cityStateArr[i].abbreviation;
                            console.log(stateAbbr);
                        }
                    }
                    getCounty(searchedCity, stateAbbr);
                    totalStateCases(stateAbbr);
                })
            })
            .catch(err => {
                console.error(err);
            });
    }
    // This function gets the county from the city by getting the longitude and latitude of the city first then finding the county.
    function getCounty(searchedCity) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + weatherKey + "&units=imperial")
            .then(function(response) {
                if (response.ok) {
                    return response.json().then(function (response) {
                        var latitude = response.coord.lat;
                        var longitude = response.coord.lon;
                        // console.log(latitude);
                        // console.log(longitude);
                        fetch("https://geo.fcc.gov/api/census/block/find?latitude=" + latitude + "&longitude=" + longitude + "&showall=true&format=json")
                            .then(function(response) {
                                if (response.ok) {
                                    return response.json().then(function (response) {
                                        // console.log(response);
                                        console.log(response.County.name);
                                        var countyName = response.County.name;
                                        var stateName = response.State.name;
                                        console.log(stateAbbr);
                                        countyInfo(countyName, stateName, stateAbbr);
                                    })
                                } else {
                                    console.log(response);
                                }
                            })          
                    })
                }
            })
    }    
    
    // This function get the total confirmed cases for the county.  It's the total overall cases from the start of the pandemic and not
    //just the total recent cases.  We still need to figure out how to pass the county into this function because it's manually entered
    // right now.
    
    function countyInfo(countyName, stateName, stateAbbr) {
        fetch("https://coronavirus-smartable.p.rapidapi.com/stats/v1/US-" + stateAbbr + "/", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": virusKey,
                    "x-rapidapi-host": "coronavirus-smartable.p.rapidapi.com"
                }
            })
                .then(response => {
                    return response.json().then(function (response) {
                        // console.log(response);
                        var countyLength = response.stats.breakdowns;
                        // console.log(countyLength);
                        for (i = 0; i < countyLength.length; i++) {
                            if (countyLength[i].location.county === countyName) {
                                console.log("Total Confirmed Cases in " + countyName + " County = " + countyLength[i].totalConfirmedCases);
                                console.log("Total Deaths in " + countyName + " County = " + countyLength[i].totalDeaths);
                            }
                        }
                    })
                })
                .catch(err => {
                    console.error(err);
                });

        fetch("https://api.census.gov/data/2019/pep/population?get=NAME,POP&for=county:*&key=" + countyPopKey)
            .then(function(response) {
                if (response.ok) {
                    return response.json().then(function (response) {
                        var totalCounties = response;
                        // console.log(totalCounties);
                        for (i = 0; i < totalCounties.length; i++) {
                            if (totalCounties[i][0] === countyName + " County, " + stateName) {
                                var countyPopulation = totalCounties[i][1];
                                console.log("Population of " + countyName + " County = " + countyPopulation);
                            }
                        }
                    })
                }

            })
    }            

    // This function gets the total new cases for each week.  The state data is manually added to the fetch but we should be able
    // to get that from the input from the user or if we don't have them input the state then we'll get it from the city in another
    // fetch and pass it in.
    function totalStateCases(stateAbbr) {
        fetch("https://api.covidtracking.com/v1/states/" + stateAbbr + "/daily.json")
            .then(function(response) {
                if (response.ok) {
                    return response.json().then(function (response) {
                        console.log(response);
                        var dailyCases = response[1].positiveIncrease;
                        var weekOneTotalCases = 0;
                        var weekTwoTotalCases = 0;
                        var weekThreeTotalCases = 0;
                        var weekFourTotalCases = 0;
                        var weekFiveTotalCases = 0;
                        var weekOneDeathIncrease = 0;
                        var weekTwoDeathIncrease = 0;
                        var weekThreeDeathIncrease = 0;
                        var weekFourDeathIncrease = 0;
                        var weekFiveDeathIncrease = 0;
                        for (i = 0; i < 35; i++) {
                            if (i < 7) {
                                var weekOneTotalCases = weekOneTotalCases + response[i].positiveIncrease;
                                var weekOneDeathIncrease = weekOneDeathIncrease + response[i].deathIncrease;
                            } else if (i > 6 && i < 14) {
                                var weekTwoTotalCases = weekTwoTotalCases + response[i].positiveIncrease;
                                var weekTwoDeathIncrease = weekTwoDeathIncrease + response[i].deathIncrease;
                            } else if (i > 13 && i < 21) {
                                var weekThreeTotalCases = weekThreeTotalCases + response[i].positiveIncrease;
                                var weekThreeDeathIncrease = weekThreeDeathIncrease + response[i].deathIncrease;
                            } else if (i > 20 && i < 28) {
                                var weekFourTotalCases = weekFourTotalCases + response[i].positiveIncrease;
                                var weekFourDeathIncrease = weekFourDeathIncrease + response[i].deathIncrease;
                            } else if (i > 27 && i < 35) {
                                var weekFiveTotalCases = weekFiveTotalCases + response[i].positiveIncrease;
                                var weekFiveDeathIncrease = weekFiveDeathIncrease + response[i].deathIncrease;
                            }
                        }
                        document.getElementById("week1Cases").innerHTML = weekOneTotalCases;                        
                        document.getElementById("week2Cases").innerHTML = weekTwoTotalCases;
                        document.getElementById("week3Cases").innerHTML = weekThreeTotalCases;
                        document.getElementById("week4Cases").innerHTML = weekFourTotalCases;
                        document.getElementById("week5Cases").innerHTML = weekFiveTotalCases;
                        document.getElementById("week1Deaths").innerHTML = weekOneDeathIncrease;                        
                        document.getElementById("week2Deaths").innerHTML = weekTwoDeathIncrease;
                        document.getElementById("week3Deaths").innerHTML = weekThreeDeathIncrease;
                        document.getElementById("week4Deaths").innerHTML = weekFourDeathIncrease;
                        document.getElementById("week5Deaths").innerHTML = weekFiveDeathIncrease;

                        console.log(week1CasesEl.textContent);
                        console.log(week2CasesEl.textContent);
                        console.log(week3CasesEl.textContent);
                        console.log(week4CasesEl.textContent);

                        console.log(weekOneTotalCases);  
                        console.log(weekTwoTotalCases);                    
                        console.log(weekThreeTotalCases);                    
                        console.log(weekFourTotalCases);                    
                        console.log(weekFiveTotalCases);

                        console.log(weekOneDeathIncrease);
                        console.log(weekTwoDeathIncrease);
                        console.log(weekThreeDeathIncrease);
                        console.log(weekFourDeathIncrease);
                        console.log(weekFiveDeathIncrease);
                        
                        
                        var table = document.getElementById('dataTable');
                        var json = []; // First row needs to be headers 
                        var headers = [];
                        for (var i = 0; i < table.rows[0].cells.length; i++) {
                        headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
                        }

                        // Go through cells 
                        for (var i = 1; i < table.rows.length; i++) {
                        var tableRow = table.rows[i];
                        var rowData = {};
                        for (var j = 0; j < tableRow.cells.length; j++) {
                            rowData[headers[j]] = tableRow.cells[j].innerHTML;
                        }
                        json.push(rowData);
                        }

                        console.log(json)

                        function BuildChart(labels, values, chartTitle) {
                        var ctx = document.getElementById("myChart").getContext('2d');
                        var myChart = new Chart(ctx, {
                            type: 'bar',
                            data: {
                            labels: labels, // Our labels
                            datasets: [{
                                label: chartTitle, // Name the series
                                data: values, // Our values
                                backgroundColor: [ // Specify custom colors
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                                ],
                                borderColor: [ // Add custom color borders
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1 // Specify bar border width
                            }]
                            },
                            options: {
                            responsive: true, // Instruct chart js to respond nicely.
                            maintainAspectRatio: false, // Add to prevent default behavior of full-width/height 
                            }
                        });
                        return myChart;
                        }

                        function BuildChart2(labels, values, chartTitle) {
                            var ctx = document.getElementById("myChartDeath").getContext('2d');
                            var myChart = new Chart(ctx, {
                                type: 'line',
                                data: {
                                labels: labels, // Our labels
                                datasets: [{
                                    label: chartTitle, // Name the series
                                    data: deathValues, // Our values
                                    backgroundColor: [ // Specify custom colors
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)'
                                    ],
                                    borderColor: [ // Add custom color borders
                                    'rgba(255,99,132,1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                    ],
                                    borderWidth: 1 // Specify bar border width
                                }]
                                },
                                options: {
                                responsive: true, // Instruct chart js to respond nicely.
                                maintainAspectRatio: false, // Add to prevent default behavior of full-width/height 
                                }
                            });
                            return myChart;
                            }

                        // Map JSON values back to label array
                        var labels = json.map(function (e) {
                            return e.week;
                        });
                        console.log(labels); // ["2016", "2017", "2018", "2019"]

                        // Map JSON values back to values array
                        var values = json.map(function (e) {
                            return e.totalnewcases;
                        });
                        console.log(values); // ["10", "25", "55", "120"]

                        var chart = BuildChart(labels, values, "Weekly COVID Cases for by State");

                        var deathValues = json.map(function (f) {
                            return f.totalnewdeaths;
                        });

                        var chart = BuildChart2(labels, deathValues, "Weekly Covid Deaths by State");
         
                    })
                } else {
                    console.log(response);
                }
            })   
        }
    getCityState();
})
