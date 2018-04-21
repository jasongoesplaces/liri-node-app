require('dotenv').config();

var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require ('node-spotify-api');
var request = require ('request');
var fs = require ('fs');
var spotifyKey = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var command = process.argv[2];

	// commands for app
	switch(command) {
		case "my-tweets": myTweets(); break;
		case "spotify-this-song": spotifyThisSong(); break;
		case "movie-this": movieThis(); break;
		case "do-what-it-says": doWhatItSays(); break;
		// if no command is given show the command options to user
		default: console.log("\r\n" +"Use one of the commands!");
	};

    // displays the tweets for handle the user input
	function myTweets() {
		var handle = process.argv[3];
		if(!handle){
			handle = "orlandocitysc"; //if no handle is give @orlandocitysc will be used. Vamos Orlando!
		}
		var params = {screen_name: handle};
		client.get('statuses/user_timeline', params, function(error, tweets, response){
			if (!error) {
					console.log(tweets);
			}  else {
				console.log("Error :"+ error);
			}
		});
    }
    
	// searches for song input by user
	function spotifyThisSong(song) {
		var song = process.argv[3];
		if(!song){
			song = "the sign";
		}
		var search = song;
		spotifyKey.search({ type: "track", query: search }, function(err, data) {
			if(err){
				console.log('Error occured: ' + err);
            }	
            else {
                var songInfo = data.tracks.items;
				for (var i = 0; i < 5; i++) {
					if (songInfo[i] != undefined) {
						var spotifyResults =
						"Artist: " + songInfo[i].artists[0].name + "\r\n" +
						"Song: " + songInfo[i].name + "\r\n" +
						"Preview Url: " + songInfo[i].preview_url + "\r\n" +
						"Album the song is from: " + songInfo[i].album.name + "\r\n" + 
						"============================================" + "\r\n";
						console.log(spotifyResults);
					}
				}				
			}
		});
    };
    
	// returns info about a movie searched for by the user
	function movieThis(){
		var movie = process.argv[3];
		if(!movie){
			movie = "mr nobody";
		}
		var search = movie;
		request("http://www.omdbapi.com/?apikey=8014fdbf&t=" + search + "&y=&plot=short&r=json&tomatoes=true", function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var movieObject = JSON.parse(body);
				var movieResults =
				"================================" + "\r\n"
				"Title: " + movieObject.Title+"\r\n"+
				"Year: " + movieObject.Year+"\r\n"+
				"Imdb Rating: " + movieObject.imdbRating+"\r\n"+
				"Country: " + movieObject.Country+"\r\n"+
				"Language: " + movieObject.Language+"\r\n"+
				"Plot: " + movieObject.Plot+"\r\n"+
				"Actors: " + movieObject.Actors+"\r\n"+
				"Rotten Tomatoes Rating: " + movieObject.tomatoRating+"\r\n"+
				"Rotten Tomatoes URL: " + movieObject.tomatoURL + "\r\n" + 
				"================================" + "\r\n";
				console.log(movieResults);
			} else {
				console.log("Error :"+ error);
				return;
			}
		});
	};
	
	// uses info the random.txt file to run the spotify function based on terms in the txt file
	function doWhatItSays() {
		fs.readFile("random.txt", "utf8", function(error, data){
			if (!error) {
				doWhatItSaysResults = data.split(",");
				spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
			} else {
				console.log("Error occurred" + error);
			}
		});
	};
