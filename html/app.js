//Code located at https://github.com/pgwest/newsAndWeather


var main = function (){
    $('.article').click(function(){
        $('.article').removeClass('current');
        $('.description').hide();
        
        $(this).addClass('current');
        $(this).children('.description').show();
        });
    $(document).keypress(function(event){
        if (event.which === 111){
            $('.current').children('.description').toggle();
        }
        else if (event.which ===110){
               var currentArticle = $('.current');
               var nextArticle = currentArticle.next();
               currentArticle.removeClass('current');
               nextArticle.addClass('current');
        }
        
        
        });    
    
$('#button').click(function(event){
    var cityName = $('#cityfield').val();
    $('#dispcity').text(cityName);
    event.preventDefault();
    
    var cityTemp;
    var cityWeather;

//    $.ajax({
////    url :
////"http://api.wunderground.com/api/7efbca1bd04ac9f3/forecast/geolookup/conditions/q/UT/" + cityName + ".json ", 
//        
//    url :
//"http://api.wunderground.com/api/7efbca1bd04ac9f3/forecast/geolookup/conditions/q/UT/Sandy.json ", 
//  dataType : "jsonp",
//  success : function(parsed_json) {
////  var location = parsed_json['location']['city'];
//  var temp_f = parsed_json['current_observation']['temp_f'];
//      cityTemp = temp_f;
//  var weather = parsed_json['current_observation']['weather'];
//      cityWeather = weather;
//  alert("Current temperature in " + location + " is: " + temp_f);
//  }
//  });
//    http://api.wunderground.com/api/7efbca1bd04ac9f3/forecast/geolookup/conditions/q/UT/Sandy.json
    
      var myurl= "https://api.wunderground.com/api/7efbca1bd04ac9f3/conditions/q/UT/";
  myurl += cityName;
  myurl += ".json";
  console.log(myurl);
  $.ajax({
    url : myurl,
    dataType : "jsonp",
    success : function(parsed_json) {
//      var location = parsed_json['display_location']['city'];
      var temp_string = parsed_json['current_observation']['temperature_string'];
      var current_weather = parsed_json['current_observation']['weather'];
      everything = "<ul>";
      everything += "<li>Location: "+cityName;
      everything += "<li>Temperature: "+temp_string;
      everything += "<li>Weather: "+current_weather;
      everything += "</ul>";
      $("#weather").html(everything);
    }
  });
     
//
//      $('#weather').html("City: " + cityName + "/n" + "Temperature: " + cityTemp + "/n" + "Weather: " + cityWeather);
    
});
    
}



$(document).ready(main);