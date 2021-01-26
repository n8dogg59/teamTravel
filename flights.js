var tokenBtn = document.querySelector("#btn-token");
var departDate = "2021-02-01";
var returnDate = "2021-02-07";
var originCode = "IAH";
var destCode = "JFK";

var getResults = function() {
    var urlencoded = new URLSearchParams();
    urlencoded.append("client_id", config.flight_api_id);
    urlencoded.append("client_secret", config.flight_api_secret);
    urlencoded.append("grant_type", "client_credentials");

    var requestOptions = {
    method: 'POST',
    body: urlencoded,
    redirect: 'follow'
    };

    fetch("https://test.api.amadeus.com/v1/security/oauth2/token", requestOptions)
    .then(response => response.json())
    .then(function(response) {
        var bearerToken = response.access_token;
        flightResults(bearerToken);
    })
    .catch(error => console.log('error', error));
};

var flightResults = function(bearerToken) {
    var myHeaders = {Authorization: "Bearer " + bearerToken};
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
      
    fetch("https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=" + originCode + "&destinationLocationCode=" + destCode + "&departureDate=" + departDate + "&returnDate=" + returnDate + "&adults=1&max=5", requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
};

tokenBtn.addEventListener("click", getResults);