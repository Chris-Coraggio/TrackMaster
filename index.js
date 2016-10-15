var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = require('express')();
var scraper = require('google-search-scraper');
var request = require('request');

var http =require('http').Server(app);
var io = require('socket.io')(http);

var passwordHash = require('password-hash');
var passwordGen = passwordHash.generate;

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyId = 'a385221958aa41d28ece2005e33a9b20';
var spotifySecret = '033ff04f6e0b4157a67c1870be6f8945';

var spotify = new SpotifyWebApi({
    clientId: spotifyId,
    clientSecret: spotifySecret,
    //redirectUri: "http://trackmaster.me/authorize",
    redirectUri: "http://localhost:81/authorize",
});

var url = "http://api.musixmatch.com/ws/1.1/track.search?apikey=239ae28847825fe0dd9589afd57032c1&page_size=100&s_track_rating=desc";
var firstTime = true;
var outOfReg = false;
var remove;
var compiledList = [];

// Joey's stuff
function createURL(lyrics,page){
	var lyricKey = lyrics.replace(/ /g, '%');
	return url +  "&q_lyrics=" + lyricKey + "&page="+page;
}
//startQuery("This is my fight song");//test statement
function startQuery(lyrics){
	var page = 1;
	while(page <= 3){
		console.log("iterating");
		if(makeRequest(createURL(lyrics,page),convertJToC)==400){
			console.log("out of stuff");
		}
		page++;
	}
	while(page <= 5){
		var newLyricOne = lyrics.substring(0,lyrics.indexOf(" "));
		var trimmed = lyrics.substring(lyrics.indexOf(" ")+1);
		var newLyricTwo = trimmed.substring(0,trimmed.indexOf(" "));
		var newLyrics = newLyricOne + " " + newLyricTwo;
		//console.log(newLyrics);
		makeRequest(createURL(newLyrics, page),convertJToC);
		page++;
	}
}
function makeRequest(urlCall,callback){
	var returnData;
	var songList = [];
	var code=0;
	request({
		url: urlCall,
		json: true,
        async: false
	}, function(error,response,body){
		code=response.statusCode;
		if(!error&&code === 200){
			returnData = JSON.parse(JSON.stringify(body));
		}
		if(code == 400 || returnData.message.body.track_list.length==0)
			return 400;
		if(firstTime){
			remove = trimName(returnData.message.body.track_list[0].track.track_name);
			songList.push(returnData.message.body.track_list[0].track);
		}
		for(var i=1;i<returnData.message.body.track_list.length;i++){
			if(!returnData.message.body.track_list[i].track.track_name.includes(remove)){
				songList.push(returnData.message.body.track_list[i].track);
			}
		}
		callback(songList);
	});
}

function trimName(song){
	var remove = song;
	if(remove.includes('('))
		remove = remove.substring(0,remove.indexOf("("));
	if(remove.includes('['))
		remove = remove.substring(0,remove.indexOf("["));
	if(remove.charAt(remove.length-1) == ' ')
		remove = remove.substring(0,remove.length-1);
	return remove;
}

// Calvin's stuff
var realLimit = 1;
var currentScrapes = 0;
var fs = require('fs');
var instrumentList

var options = {
    query: 'Instruments used in heathens by the 21 pilots wikipedia',
    limit: 1
};
var song = {
    title: "Heathens",
    author: "21 Pilots",
    score: 0,
    previewLink: ""
};
var songList = [];
function convertJToC(songs){
    var song = {
        title: "Heathens",
        author: "21 Pilots",
        score: 0,
        previewLink: ""
    };

    for(var i=0;i<songs.length;i++){
        var songToAdd = Object.create(song);
        var songName = songs[i].track_name;

        if(songName.includes(' (')){
            songName = songName.substring(0,songName.indexOf(' ('));
        }else if(songName.includes('(')){
            songName = songName.substring(0,songName.indexOf('('));
        }
        songToAdd.title = songName;
        songToAdd.author = songs[i].artist_name;
        songList.push(songToAdd);

        console.log(songList[i]);
    }
}
function loadInstruments(callback){
     fs.readFile('instruments.txt','utf8', function(err, data){
	if(err){
	    return console.log(err)
	}
	instrumentList = data.split('\n');
	 callback();
     });
    
}

function checkSongs(songList, songMultiplier){
    for(var song of songList) {
        var search = {
            query: 'Instruments used in ' + song.title + ' by ' + song.author,
            limit: 1
        };
        scraper.search(options, function(err, url){
            if(realLimit > currentScrapes){
                if(err) throw err;
                console.log(url);
                
                request(url, function(error, response, body){
                    var instrCount = 0;
                    instrumentTxt = body.slice(body.indexOf("Edit section: Personnel"));
                    console.log(instrumentTxt);
                    for(var i in instrumentList){
                        console.log(instrumentList[i]);
                        if(instrumentTxt.includes(instrumentList[i])){
                        instrCount ++;
                        }
                    }

                    song.score += instrCount * songMultiplier;
                    //console.log(songList);
                });
                
            }
            currentScrapes ++;
            
        });
    }
}

io.on('connection',function(client){
    console.log("user connected");
});

// Set up session
app.use(session({
    secret: 'TrackMasterIsTheBombFuckItShipItImNotGonnaMakeARandomString',
    cookie: {
        maxAge: 60000
    }
}));

// Set up body parser
app.use(bodyParser.urlencoded({
    extended: true
}));

// Basic pages
app.get('/', function(req, res){
    return res.sendFile(__dirname + '/index.html');
});

app.get('/login', function(req, res) {
    var scopes = [
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private',
    ];

    var state = "I'm not sure what to put here";

    spotify.setRedirectURI(req.query.redirect);
    res.redirect(spotify.createAuthorizeURL(scopes, state));
});

app.get('/authorize', function(req, res) {
    spotify.authorizationCodeGrant(req.query.code).then(function(data) {
        spotify.setAccessToken(data.body.access_token);
        spotify.setRefreshToken(data.body.refresh_token);

        res.redirect('/playlists');
    });
});

app.get('/create', function(req, res) {
    return res.sendFile(__dirname + '/create.html');
});

app.get('/playlists', function(req, res) {
    spotify.getMe().then(function(data) {
        console.log(data);
    });
});

app.use(express.static('Public'));

http.listen(process.env.PORT || 81, function(){
    console.log("Listening on *:81");
});
