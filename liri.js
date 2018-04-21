const dotenv = require("dotenv").config();
const fs = require('fs');
const request = require('request');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');

// Get user input from terminal
let argOne = process.argv[2];
let argTwo = process.argv[3];
let inputArray = process.argv;

// Main function
function liri(argOne) {
	// If command is my-tweets, run twitter
	if (argOne === "my-tweets") {
		myTweets();
	}

	// If command is spotify-this-song, run spotify 
	else if (argOne === "spotify-this-song") {
		let song = "";
		// If no song is given, Play "The Sign by Ace of Base" and run spotify 
		if (inputArray.length < 4) {
			song = "The Sign Ace of Base";
			spotifyThisSong(song);
		}
		// Run spotify with inputted name
		else{
			song = argTwo;
			spotifyThisSong(song);
		}
	}

	// If command is movie-this, show movie
	else if (argOne === "movie-this") {
		let movie = "";
		// If no movie is given, show Mr. Nobody
		if (inputArray.length < 4) {
			movie = "Mr. Nobody.";
			movieThis(movie);
		}
		// Show movie with inputted name
		else{
			movie = argTwo;
			movieThis(movie);
		}
	}

	// If command is do-what-it-says, run doWhatItSays
	else if (argOne === "do-what-it-says") {
		doWhatItSays();
	}

	// If no command is given display "Please put" phrase
	else{
		console.log("Please put either 'my-tweets', 'spotify-this-song', 'movie-this', or 'do-what-it-says'");
	}

}

// Twitter Function 
function myTweets() {
	const keys = require('./keys.js');
	const twitterID = keys.twitter;
	let client = new Twitter({
        consumer_key: twitterID.consumer_key,
        consumer_secret: twitterID.consumer_secret,
        access_token_key: twitterID.access_token_key,
        access_token_secret: twitterID.access_token_secret
    });

    // name of user twitter account
	let params = {
		LuisvonAhn: 'cnn'
	};

	// Access and display tweets
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            if (tweets.length < 5) {
                var numberTweets = tweets.length;
            } 
			else {
                var numberTweets = 20;
            }
            for (let i = 0; i < numberTweets; i++) {
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
                console.log('*******************');
            }
        } else {
            console.log('Error occurred: ' + error);
        }
    });

}

// Spotify Function 
function spotifyThisSong(song) {
	// Get spotify validation information
	const keys = require('./keys.js');
	const spotify = new Spotify(keys.spotify);
    // Search for song 
    spotify.search({ type: 'track', query: song }, function(error, response) {

        // Display song details and show error if there is an error
        if (!error) {
            console.log('*******************');
            console.log('Artist Name: ' + response.tracks.items[0].artists[0].name);
            console.log('Song Name: ' + response.tracks.items[0].name);
            console.log('Preview URL: ' + response.tracks.items[0].preview_url);
            console.log('Album Name: ' + response.tracks.items[0].album.name);
            console.log('*******************');
        } else {
            console.log('Error occurred: ' + error);
        }
    });
}

// Function to access OMDB and display necessary content
function movieThis(movie){
	// Search for movie
	request("https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        // Display song details and show error if there is an error
        if (!error && response.statusCode == 200) {
        	body = JSON.parse(body);
        	console.log('*******************');
            console.log('Movie Title: ' + body.Title);
            console.log('Year Released: ' + body.Released);
            console.log('IMDB Rating: ' + body.Ratings[0].Value);
            console.log('Rotten Tomatoes Rating: ' + body.Ratings[1].Value);
            console.log('Production Country: ' + body.Country);
            console.log('Language: ' + body.Language);
            console.log('Plot: ' + body.Plot);
            console.log('Actors: ' + body.Actors);
            console.log('*******************');
        } 
        else {
            console.log('Error occurred: ' + error);
        }
    });
}

// Random.txt Function 
function doWhatItSays(){
	// Read the random.txt file and take the necessary information
	fs.readFile("random.txt", "utf8", function(error, data) {
		// If the code experiences any errors it will log the error to the console.
		if (error) {
			return console.log(error);
		}
		// Split the contents of random.txt into command and user input
		var dataArr = data.split(",");
		// Run necessary function that correspond to what is provided in random.txt
		if (dataArr[0]==="spotify-this-song"){
			spotifyThisSong(dataArr[1]);
		}

		if (dataArr[0]==="movie-this"){
			movieThis(dataArr[1]);
		}

		if (dataArr[0]==="my-tweets"){
			myTweets();
		}
	});
}

// Run liri
liri(argOne);