// Global variables
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require('node-spotify-api')
var fs = require("fs");
var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});
var action = process.argv[2];
var nodeArg = process.argv;
var valueArray = [];
//puts any entered text after file into an array
for (var i = 3; i < nodeArg.length; i++) {
  valueArray.push((nodeArg[i]))
}
var value = (valueArray.join("+"));
var moment = require('moment')
moment().format();

//function for spotify searches
function spotifySearch(value) {
  spotify.search({
    type: 'track',
    query: value,
    market: "US"
  }, function (err, data) {
    if (err) {
        console.log("There was an error");
  
    } 
    //If the call returns nothing, call it again with a pre-defined song
    if (data.tracks.total==0){
      console.log("we couldn't find that song, what about this one?")
      spotifySearch("Ace+of+Base")
    }
    else{
      //Return the top 3 songs that are found by spotify
    for (var i = 0; i < 3; i++) {
      var trackName = data.tracks.items[i].name
      console.log("============")
      console.log("The song name is " + trackName)
      console.log(trackName + " is written by " + data.tracks.items[i].artists[0].name)
      console.log("Listen here at: " + data.tracks.items[i].preview_url)
      console.log(trackName + " is on the album " + data.tracks.items[i].album.name)
    }
  }
  //writes what the value of the call is to log.txt
  fs.appendFile("log.txt", "spotify-this-song "+value+ ", " , function(err) {
    if (err) {
      return console.log(err);
    }
  });
    console.log("============")
      });
}
//function for concert-this
function concert(value) {
  axios
    .get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp")
    .then(function (response) {
      //loops through all concert responses
      for (i = 0; i < response.data.length; i++) {
        console.log("==========");
        console.log(response.data[i].venue.name);
        console.log(response.data[i].venue.city);
        console.log(moment(response.data[i].datetime).format('LLLL'));
      }
      //writes concert calls to log.txt
      fs.appendFile("log.txt", "concert-this "+value+ ", " , function(err) {
        if (err) {
          return console.log(err);
        }
      });
      console.log("==========");
    })
    .catch(function (error) {
      console.log(error);
    });
}
//function for movie-this calls
function movie(value) {
  var queryUrl = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy";
  axios.get(queryUrl).then(
    function (response) {
     //if there is no response from the call- hard code in a new search
      if (response.data.Title== undefined){
        console.log("I couldn't find that movie. How about this one?")
        movie("Mr. Nobody")
      }
      else {
        
      console.log("=============")
      console.log("Title: " + response.data.Title)
      console.log("Release Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);
      //check if there is a rotten tomatoes rating before attempting to display t
      if (response.data.Ratings[1]){
      console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
      }
      else {
        console.log("No Rotten Tomatoes Score")
      }
      console.log("Produced by: " + response.data.Production)
      console.log("Language: " + response.data.Language)
      console.log("Plot: " + response.data.Plot)
      console.log("Actors: " + response.data.Actors)
      console.log("=============")
       fs.appendFile("log.txt", "movie-this "+value+ ", " , function(err) {
        if (err) {
          return console.log(err);
        }
      });
      }
    }
  );
}
// Function to run the random.txt file
function doThis() {
  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    // read whats in the file and split
    data = data.split(",");
    var command = (data[0])
    var valueArray = [];
    //starting with the command- push the values into an array
    for (var i = 1; i < data.length; i++) {
      valueArray.push((data[i]))
    }
    var value = (valueArray.join("+"))
    //replace all of the values and add +'s for search queries
    value = value.replace('"', "").split(' ').join('+')
     //run the normal switch with the new variables of command and value
    switch (command) {

      case "concert-this":
        concert(value);
        break;

      case "spotify-this-song":
        spotifySearch(value);
        break;

      case "movie-this":
        movie(value);
        break;
    }
  });
}


switch (action) {

  case "concert-this":
    concert(value);
    break;

  case "spotify-this-song":
    spotifySearch(value);
    break;

  case "movie-this":
    movie(value);
    break;

  case "do-what-it-says":
    doThis();

    break;
  default:
    console.log("Check your input")
}