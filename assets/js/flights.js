var searchBtn = document.getElementById("searchBtn");
var flightsEl = document.getElementById("resultbox-wrap");
var departDateSearch = document.getElementById("depart-date");
var returnDateSearch = document.getElementById("return-date");
var originCodeSearch = document.getElementById("origin");
var destCodeSearch = document.getElementById("destination");

$(document).ready(function() {
    loadData();
});

var getAuth = function() {
    flightsEl.textContent = "";
    var urlencoded = new URLSearchParams();
    urlencoded.append("client_id", config.flight_api_id);
    urlencoded.append("client_secret", config.flight_api_secret);
    urlencoded.append("grant_type", "client_credentials");

    var requestAuth = {
    method: 'POST',
    body: urlencoded,
    redirect: 'follow'
    };
    
    fetch("https://test.api.amadeus.com/v1/security/oauth2/token", requestAuth)
    .then(response => response.json())
    .then(function(response) {
        var bearerToken = response.access_token;
        flightResults(bearerToken);
    })
    .catch(error => console.log('error', error));
};

var flightResults = function(bearerToken) {
    var originCode = originCodeSearch.value.trim().toUpperCase();
    var destCode = destCodeSearch.value.trim().toUpperCase();
    var departDate = departDateSearch.value.trim();
    var returnDate = returnDateSearch.value.trim();
    var myHeaders = {Authorization: "Bearer " + bearerToken};
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=" + originCode + "&destinationLocationCode=" + destCode + "&departureDate=" + departDate + "&returnDate=" + returnDate + "&adults=1&nonStop=true&currencyCode=USD&max=10", requestOptions)
        .then(response => response.json())
        .then(function(response) {
            var airlines = response.dictionaries.carriers;
            var carrierCodes = [];
            var ticketPrices = [];
            var outboundDepartTimes = [];
            var outboundArriveTimes = [];
            var inboundDepartTimes = [];
            var inboundArriveTimes = [];

            for (i = 0; i < response.data.length; i++) {
                ticketPrices.push(response.data[i].price.total);

                outboundDepartTimes.push(response.data[i].itineraries[0].segments[0].departure.at);
                outboundDepartTimes[i] = outboundDepartTimes[i].slice(11,16);

                outboundArriveTimes.push(response.data[i].itineraries[0].segments[0].arrival.at);
                outboundArriveTimes[i] = outboundArriveTimes[i].slice(11,16);

                inboundDepartTimes.push(response.data[i].itineraries[1].segments[0].departure.at);
                inboundDepartTimes[i] = inboundDepartTimes[i].slice(11,16);

                inboundArriveTimes.push(response.data[i].itineraries[1].segments[0].arrival.at);
                inboundArriveTimes[i] = inboundArriveTimes[i].slice(11,16);

                carrierCodes.push(response.data[i].itineraries[0].segments[0].carrierCode);

                var resultsContainerEl = document.createElement("div");
                resultsContainerEl.classList = "resultbox";

                var pricesEl = document.createElement("textbox");
                pricesEl.textContent = "Price: " + ticketPrices[i]; 

                var airlineEl = document.createElement("textbox");
                airlineEl.textContent = airlines[carrierCodes[i]];

                var outboundTimesEl = document.createElement("textbox");
                outboundTimesEl.textContent = "Departing Flight: " + outboundDepartTimes[i] + " - " + outboundArriveTimes[i];

                var inboundTimesEl = document.createElement("textbox");
                inboundTimesEl.textContent = "Return Flight: " + inboundDepartTimes[i] + " - " + inboundArriveTimes[i];
                
                flightsEl.appendChild(resultsContainerEl);
                resultsContainerEl.appendChild(pricesEl);
                resultsContainerEl.appendChild(airlineEl);
                resultsContainerEl.appendChild(outboundTimesEl);
                resultsContainerEl.appendChild(inboundTimesEl);                
            };
        })
        .catch(error => displayError(error));
    
    saveData();

};

var saveData = function() {
    var originCode = originCodeSearch.value.trim();
    var destCode = destCodeSearch.value.trim();
    var departDate = departDateSearch.value.trim();
    var returnDate = returnDateSearch.value.trim();

    localStorage.setItem("origin-code", originCode);
    localStorage.setItem("dest-code", destCode);
    localStorage.setItem("depart-date", departDate);
    localStorage.setItem("return-date", returnDate);
};

var loadData = function() {
    var originCode = localStorage.getItem("origin-code");
    var destCode = localStorage.getItem("dest-code");
    var departDate = localStorage.getItem("depart-date");
    var returnDate = localStorage.getItem("return-date");

    originCodeSearch.value = originCode
    destCodeSearch.value = destCode
    departDateSearch.value = departDate
    returnDateSearch.value = returnDate
};

var displayError = function() {
    var alert = document.createElement("textbox");
    var resultsContainerEl = document.createElement("div");

    resultsContainerEl.classList = "resultbox";
    alert.textContent = 'Enter a 3 letter airport code in the "From" and "To" bubbles.';

    flightsEl.appendChild(resultsContainerEl);
    resultsContainerEl.appendChild(alert);
};

searchBtn.addEventListener("click", getAuth);