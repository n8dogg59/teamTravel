var virusKey = config.CORONA_KEY;
var weatherKey = config.WEATHER_API_KEY;
var countyPopKey = config.COUNTY_POP_KEY;
var county = "";
var week1CasesEl = document.querySelector("#week1Cases");
var week2CasesEl = document.querySelector("#week2Cases");
var week3CasesEl = document.querySelector("#week3Cases");
var week4CasesEl = document.querySelector("#week4Cases");
var stateAbbr = "";
var searchButton = document.getElementById("searchBtn");  
var searchAirportEl = document.querySelector("#destination");
var covidListEl = document.getElementById("covidList");
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
    
    function getCityState() {
        var airportCode = searchAirportEl.value.trim();  
        // This function will get the city and state from the airport code the user inputs
        fetch("https://airport-info.p.rapidapi.com/airport?iata=" + airportCode, { 
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "d0d36869f4msh08f660e28e5060bp1aef27jsncfbd043899ea",
                "x-rapidapi-host": "airport-info.p.rapidapi.com"
            }
        })
            .then(response => {
                return response.json().then(function (response) {
                    console.log(response);
                    var resultLocation = response.location;
                    var searchedCity = resultLocation.split(',',1);
                    var searchedState = response.state;
                    for (i = 0; i < cityStateArr.length; i++) {
                        if (cityStateArr[i].name === searchedState) {
                            stateAbbr = cityStateArr[i].abbreviation;
                        }
                    }
                    getCounty(searchedCity, stateAbbr);
                    totalStateCases(stateAbbr, searchedState);
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
                                        var countyName = response.County.name;
                                        var stateName = response.State.name;
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
    // just the total recent cases.  We still need to figure out how to pass the county into this function because it's manually entered
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
                                //console.log("Total Confirmed Cases in " + countyName + " County = " + countyLength[i].totalConfirmedCases);
                                //console.log("Total Deaths in " + countyName + " County = " + countyLength[i].totalDeaths);
                                var countyDeaths = countyLength[i].totalDeaths;
                                var countyCases = countyLength[i].totalConfirmedCases;
                                countyPopulation(countyName, stateName, countyCases, countyDeaths);
                            }
                        }
                    })
                })
                .catch(err => {
                    console.error(err);
                });
    }            
        
    function countyPopulation(countyName, stateName, countyCases, countyDeaths) {
        fetch("https://api.census.gov/data/2019/pep/population?get=NAME,POP&for=county:*&key=" + countyPopKey)
                .then(function(response) {
                    if (response.ok) {
                        return response.json().then(function (response) {
                            var totalCounties = response;
                            // console.log(totalCounties);
                            for (i = 0; i < totalCounties.length; i++) {
                                if (totalCounties[i][0] === countyName + " County, " + stateName) {
                                    var countyPopulation = totalCounties[i][1];
                                    //console.log("Population of " + countyName + " County = " + countyPopulation);
                                }
                            }
                            percentInfected = (countyCases / countyPopulation) * 100;
                            displayPercent = percentInfected.toFixed(2);
                            document.getElementById("countyCases").innerHTML = displayPercent + "% of " + countyName + " County has tested positive since the start of the pandemic.";
                        })
                    }

                })
    }                

    // This function gets the total new cases for each week.  The state data is manually added to the fetch but we should be able
    // to get that from the input from the user or if we don't have them input the state then we'll get it from the city in another
    // fetch and pass it in.
    function totalStateCases(stateAbbr, searchedState) {
        fetch("https://api.covidtracking.com/v1/states/" + stateAbbr + "/daily.json")
            .then(function(response) {
                if (response.ok) {
                    return response.json().then(function (response) {
                        //console.log(response);
                        var dailyCases = response[1].positiveIncrease;
                        var week1TotalCases = 0;
                        var week2TotalCases = 0;
                        var week3TotalCases = 0;
                        var week4TotalCases = 0;
                        var week5TotalCases = 0;
                        var week1DeathIncrease = 0;
                        var week2DeathIncrease = 0;
                        var week3DeathIncrease = 0;
                        var week4DeathIncrease = 0;
                        var week5DeathIncrease = 0;
                        for (i = 0; i < 35; i++) {
                            if (i < 7) {
                                var week1TotalCases = week1TotalCases + response[i].positiveIncrease;
                                var week1DeathIncrease = week1DeathIncrease + response[i].deathIncrease;
                            } else if (i > 6 && i < 14) {
                                var week2TotalCases = week2TotalCases + response[i].positiveIncrease;
                                var week2DeathIncrease = week2DeathIncrease + response[i].deathIncrease;
                            } else if (i > 13 && i < 21) {
                                var week3TotalCases = week3TotalCases + response[i].positiveIncrease;
                                var week3DeathIncrease = week3DeathIncrease + response[i].deathIncrease;
                            } else if (i > 20 && i < 28) {
                                var week4TotalCases = week4TotalCases + response[i].positiveIncrease;
                                var week4DeathIncrease = week4DeathIncrease + response[i].deathIncrease;
                            } else if (i > 27 && i < 35) {
                                var week5TotalCases = week5TotalCases + response[i].positiveIncrease;
                                var week5DeathIncrease = week5DeathIncrease + response[i].deathIncrease;
                            }
                        }
                                                
                        document.getElementById("week1Cases").innerHTML = week1TotalCases;                        
                        document.getElementById("week2Cases").innerHTML = week2TotalCases;
                        document.getElementById("week3Cases").innerHTML = week3TotalCases;
                        document.getElementById("week4Cases").innerHTML = week4TotalCases;
                        document.getElementById("week5Cases").innerHTML = week5TotalCases;
                        document.getElementById("week1Deaths").innerHTML = week1DeathIncrease;                        
                        document.getElementById("week2Deaths").innerHTML = week2DeathIncrease;
                        document.getElementById("week3Deaths").innerHTML = week3DeathIncrease;
                        document.getElementById("week4Deaths").innerHTML = week4DeathIncrease;
                        document.getElementById("week5Deaths").innerHTML = week5DeathIncrease;

                        // Adds commas to the table that will show up on the html page
                        var casesOne = week1TotalCases.toString().split(".");
                        casesOne[0] = casesOne[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        week1TotalCasesVisible = casesOne.join(".");
                        var casesTwo = week2TotalCases.toString().split(".");
                        casesTwo[0] = casesTwo[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        week2TotalCasesVisible = casesTwo.join(".");
                        var casesThree = week3TotalCases.toString().split(".");
                        casesThree[0] = casesThree[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        week3TotalCasesVisible = casesThree.join(".");
                        var casesFour = week4TotalCases.toString().split(".");
                        casesFour[0] = casesFour[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        week4TotalCasesVisible = casesFour.join(".");
                        var casesFive = week5TotalCases.toString().split(".");
                        casesFive[0] = casesFive[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        week5TotalCasesVisible = casesFive.join(".");
                        var deathsOne = week1DeathIncrease.toString().split(".");
                        deathsOne[0] = deathsOne[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        week1DeathIncreaseVisible = deathsOne.join(".");
                        var deathsTwo = week2DeathIncrease.toString().split(".");
                        deathsTwo[0] = deathsTwo[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        week2DeathIncreaseVisible = deathsTwo.join(".");
                        var deathsThree = week3DeathIncrease.toString().split(".");
                        deathsThree[0] = deathsThree[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        week3DeathIncreaseVisible = deathsThree.join(".");
                        var deathsFour = week4DeathIncrease.toString().split(".");
                        deathsFour[0] = deathsFour[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        week4DeathIncreaseVisible = deathsFour.join(".");
                        var deathsFive = week5DeathIncrease.toString().split(".");
                        deathsFive[0] = deathsFive[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        week5DeathIncreaseVisible = deathsFive.join(".");

                        // Populates the dummy chart that shows up on the html page but chart.js does not use
                        document.getElementById("week1CasesVisible").innerHTML = week1TotalCasesVisible;                        
                        document.getElementById("week2CasesVisible").innerHTML = week2TotalCasesVisible;
                        document.getElementById("week3CasesVisible").innerHTML = week3TotalCasesVisible;
                        document.getElementById("week4CasesVisible").innerHTML = week4TotalCasesVisible;
                        document.getElementById("week5CasesVisible").innerHTML = week5TotalCasesVisible;
                        document.getElementById("week1DeathsVisible").innerHTML = week1DeathIncreaseVisible;                        
                        document.getElementById("week2DeathsVisible").innerHTML = week2DeathIncreaseVisible;
                        document.getElementById("week3DeathsVisible").innerHTML = week3DeathIncreaseVisible;
                        document.getElementById("week4DeathsVisible").innerHTML = week4DeathIncreaseVisible;
                        document.getElementById("week5DeathsVisible").innerHTML = week5DeathIncreaseVisible;

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
                                events:["click"],
                                responsive: true, // Instruct chart js to respond nicely.
                                maintainAspectRatio: false, // Add to prevent default behavior of full-width/height 
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero:false,
                                            callback: function(value, index, values) {
                                                if(parseInt(value) >= 1000){
                                                   return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                } else {
                                                   return value;
                                                }
                                           }                            
                                        }
                                    }]
                                }
                                }
                            });
                            console.log(myChart);
                            console.log(values);
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
                                events:["click"],
                                responsive: true, // Instruct chart js to respond nicely.
                                maintainAspectRatio: false, // Add to prevent default behavior of full-width/height 
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero:false,
                                            callback: function(value, index, values) {
                                                if(parseInt(value) >= 1000){
                                                   return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                } else {
                                                   return value;
                                                }
                                           }                            
                                        }
                                    }],
                                    xAxes: [{
                                        offset: true
                                    }]
                                }
                                
                                    
                                
                                }
                            });
                            console.log(myChart);
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
                        var chart = BuildChart(labels, values, "Weekly COVID Cases for " + searchedState);
                        console.log(chart);
                        var deathValues = json.map(function (f) {
                            return f.totalnewdeaths;
                        });
                        var chart = BuildChart2(labels, deathValues, "Weekly Covid Deaths for " + searchedState);
         
                    })
                } else {
                    console.log(response);
                }
            })   
        }
    
    searchButton.addEventListener("click", getCityState);
    
