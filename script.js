$(document).ready(function() {

    //function for searching the name of the cities in the API and logging the response
    function citysearch(nameOfCity) {

      var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + nameOfCity + "&units=imperial&appid=9c596b570aec8a175e86b3272dcaa420";
      
      $.ajax({
        url: queryURL,
          method: 'GET'
        }).then(function (response) {
          console.log(response);
          
         $("#currentDate").empty();
         var firstDate = moment().format('L');
         console.log(firstDate)
         
        // function to display name, date, wind speed, temp and humidity and UV index    
        var cityHeader = $("<h2>").text(response.name);
        var displayfirstDate = cityHeader.append(" " + firstDate);
        var windP = $("<p>").text("Wind Speed: " + response.wind.speed);
        var tempP = $("<p>").text("Temperature: " + response.main.temp);
        var humidityP = $("<p>").text("Humidity: " + response.main.humidity);
        var currentWeather = response.weather[0].main;
        // if/then statement for which icon should be used based on the weather response    
        if (currentWeather === "Rain") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
              currentIcon.attr("style", "height: 60px; width: 60px");
              
            } else if (currentWeather=== "Clouds") {
              var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
              currentIcon.attr("style", "height: 60px; width: 60px");
              
            } else if (currentWeather === "Clear") {
              var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
              currentIcon.attr("style", "height: 60px; width: 60px");

            } else if (currentWeather === "Drizzle") {
              var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
              currentIcon.attr("style", "height: 60px; width: 60px");
              
            } else if (currentWeather === "Snow") {
              var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
              currentIcon.attr("style", "height: 60px; width: 60px");
            }
            
            
            var newDiv = $('<div>');
            newDiv.append(displayfirstDate, currentIcon, tempP, humidityP, windP);
            $("#current-weather").html(newDiv);
            
            
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            var uviQuery = "https://api.openweathermap.org/data/2.5/uvi?&appid=9c596b570aec8a175e86b3272dcaa420&lat=" + lat  + "&lon=" + lon;
            
            $.ajax({
              url: uviQuery,
              method: 'GET'
            }).then(function (response) {
              $("#uvi").empty();
              var uvlEl = $("<button class='btn bg-success'>").html("UV Index: " + response.value);
              $('#uvi').html(uvlEl);
              
            });
          });
          
       //function for calling on the API to retrieve 5-day forecast as well   
          
      var queryForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + nameOfCity + "&units=imperial&appid=9c596b570aec8a175e86b3272dcaa420";
      
      $.ajax({
          url: queryForecast,
          method: 'GET'
      }).then(function (response) {
          console.log(response)
          var results = response.list;
          $("#fiveForecast").empty();
          for (var i = 0; i < results.length; i += 8) {
              var fiveDayDiv = $("<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem;'>");
              
              // cards listing the temp, humidity and date based on the results
              var temp = results[i].main.temp;
              var hum = results[i].main.humidity;
              var date = results[i].dt_txt;
              var dateResults = date.substr(0,10)
     
              var dateHeader = $("<h5 class='card-title'>").text(dateResults);
              var tempTag = $("<p class='card-text'>").text("Temp: " + temp);;
              var humidityTag = $("<p class='card-text'>").text("Humidity " + hum);;
  
              var weather = results[i].weather[0].main
            // if/then statement on which icon to use depending on the data
              if (weather === "Rain") {
                  var newIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
                  newIcon.attr("style", "height: 40px; width: 40px");
              } else if (weather === "Clouds") {
                  var newIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
                  newIcon.attr("style", "height: 40px; width: 40px");
              } 
               else if (weather === "Clear") {
                  var newIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
                  newIcon.attr("style", "height: 40px; width: 40px");
              }
               else if (weather === "Drizzle") {
                  var newIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
                  newIcon.attr("style", "height: 40px; width: 40px");
              }
               else if (weather === "Snow") {
                  var newIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
                  newIcon.attr("style", "height: 40px; width: 40px");
              }
  
              fiveDayDiv.append(dateHeader);
              fiveDayDiv.append(newIcon);
              fiveDayDiv.append(tempTag);
              fiveDayDiv.append(humidityTag);
              $("#fiveForecast").append(fiveDayDiv);
          }
  
      });
  
  }
  storedItems();
  // saving the data to local storage
  $("#searchButton").on("click", function (event) {
      event.preventDefault();
      var cityInput = $("#userInput").val().trim();
      var textContent = $(this).siblings("input").val();
      var array = [];
      array.push(textContent);
      localStorage.setItem('cityName', JSON.stringify(array));
    
      citysearch(cityInput);
      storedItems();
  });
  
  
  function storedItems () {
      var lastSearch = JSON.parse(localStorage.getItem("cityName"));
      var searchDiv = $("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded' style='width: 12rem;'>").text(lastSearch);
      var lastDiv = $("<div>");
      lastDiv.append(searchDiv)
      $("#historySearch").prepend(lastDiv);
  }
  
  $("#historySearch").on('click', '.btn', function(event) {
      event.preventDefault();
      citysearch($(this).text());
  
  });
})