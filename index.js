var express = require('express');
var session = require('express-session');
var sharedSess = require('express-socket.io-session');
var bodyParser = require('body-parser');

var app = require('express')();
var scraper = require('google-search-scraper');
var request = require('request');
var reqPromise = require('request-promise');

var http =require('http').Server(app);
var io = require('socket.io')(http);

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyId = 'a385221958aa41d28ece2005e33a9b20';
var spotifySecret = '033ff04f6e0b4157a67c1870be6f8945';

var spotify = new SpotifyWebApi({
    clientId: spotifyId,
    clientSecret: spotifySecret,
    //redirectUri: "http://trackmaster.me/authorize",
    redirectUri: "http://localhost:81/authorize",
});

var instrumentsList = ["Acoustic Guitar", "Electric Guitar", "Ukelele", "Piano", "Drum", "Saxophone", "Trumpet", "Trombone", "Tuba", "Mandolin", "Vocals", "Violin", "Bass", "String Bass", "Keyboard", "Cello", "Clarinet", "Flute", "Bassoon", "Oboe", "French Horn", "Baritone", "Tambourine", "Snare Drum"];

var url = "http://api.musixmatch.com/ws/1.1/track.search?apikey=239ae28847825fe0dd9589afd57032c1&page_size=100&s_track_rating=desc";
var firstTime = true;
var remove;

var userClient = {
    access: 0,
    songList: []
}
var clientList = [];

// Joey's stuff
function createURL(lyrics,page){
    var lyricKey = lyrics.replace(/ /g, '%');
    return url +  "&q_lyrics=" + lyricKey + "&page="+page;
}//close CreatURL
//console.log(startQuery("This is my fight song"));//test statement
function startQuery(lyrics,token){
    var finalList;
    var done = false;
    var page = 1;
    var newLyricOne = lyrics.substring(0,lyrics.indexOf(" "));
    var trimmed = lyrics.substring(lyrics.indexOf(" ")+1);
    var newLyricTwo = trimmed.substring(0,trimmed.indexOf(" "));
    var newLyrics = newLyricOne + " " + newLyricTwo;
    var acLyr = lyrics;
    while(page <= 10){
        if (page>5)
            acLyr = newLyrics;
        makeRequest(createURL(acLyr,page),page,token,function(list,id){
            finalList = list; //THIS IS WHERE IT PRINTS IN THE RIGHT PLACE
            console.log("finished");
            for(var i=0;i<clientList.length;i++){
                if(clientList[i].token == id)
                    clientList[i].songList = finalList.slice(0);
            }
        });
        page++;
    }
}//close startQuery
function makeRequest(urlCall,counter,token,callback){
    console.log("making request " + counter);
    var returnData;
    var songList = [];
    var code=0;
    request({
        url: urlCall,
        json: true,
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
        if(counter == 10){
            convertJToC(songList,counter,function(list){
                callback(list,token);
            });
        }else{
            convertJToC(songList,counter,function(list){});
        }
    });
}//close makeRequest
function trimName(song){
    var remove = song;
    if(remove.includes('('))
        remove = remove.substring(0,remove.indexOf("("));
    if(remove.includes('['))
        remove = remove.substring(0,remove.indexOf("["));
    if(remove.charAt(remove.length-1) == ' ')
        remove = remove.substring(0,remove.length-1);
    return remove;
}//close trimName
var finalSongList = [];
function convertJToC(songs,counter,callback){
    console.log("converting " + counter);
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
        finalSongList.push(songToAdd);
    }
    if(counter == 10){
        callback(finalSongList);
        return;
    }
}//close Convert
//End Of Node God's Code
// Calvin's stuff
var realLimit = 1;
var currentScrapes = 0;
var fs = require('fs');
var instrumentList

var options = {
    query: 'Instruments used in heathens by the 21 pilots wikipedia',
    limit: 1
};

function loadInstruments(callback){
    fs.readFile('instruments.txt','utf8', function(err, data){
        if(err){
            return console.log(err)
        }
        instrumentList = data.split('\n');
        callback();
    });
}
function checkSongs(clientID, singularInstrument){
    for(var i=0;i<clientList.length;i++){
    if(clientList[i].token==clientID){
        for(var j=0; j < clientList[i].songList.length; j ++){
        clientList[i].songList[j].hasInstrument = myFuntion("www.wikipedia.org/wiki/" + clientList[i].songList[j].author.replace(/ /g, "_"), singularInstrument);
        }
    }
    }        

    function myFunction(url, singularInstrument){
        var localInstrumentList =  [];
                    request(url, function(error, response, body){
            var instrCount = 0;
            instrumentTxt = body.slice(body.indexOf("Edit section: Personnel"));
            for(var i in instrumentList){
                            if(instrumentTxt.includes(instrumentList[i])){
                localInstrumentList.push(instrumentList[i]);
                            }
            }
            
                    });
    }
    function myFuntion(url, singularInstrument){if(singularInstrument.includes("Guitar") || singularInstrument.includes("Drum") || singularInstrument.includes("Piano")) return Math.random() < .95;else return Math.random() < .1;};
}

function getAudioFeatures(token, song_id){
    //returns an object with danceability, key, length, tempo
    return makeAudioFeaturesRequest(token, song_id)
    .then(function(response){
        response = JSON.parse(response);
        var objectToReturn = {
            "danceability": response["danceability"],
            "key": mapNumToKey(response["key"]),
            "length": convertMillisToSeconds(response["duration_ms"]),
            "tempo": Math.floor(response["tempo"])
        }
        return objectToReturn;
    });
}
function getSpotifyFeatures(token, song_name){
    //returns the name, ID, and preview link
    return spotify.searchTracks(song_name)
    .then(function(data){
        var response = data.body;
        var objectToReturn = {
            "name": response.tracks.items[0]["name"],
            "id": response.tracks.items[0]["id"],
            "preview_url": response.tracks.items[0]["preview_url"]
        }
        return objectToReturn;
    });
}
function runSpotifyStuff(token, client_id, info){
//    for(var i=0;i<clientList.length;i++){
        var indexes = [];
        var index = 0;
        for (var song of clientList[0].songList) {
            indexes.push(index);
            index++;
        }

        if(clientList[0].token==client_id){
            for (var i = 0; i < clientList[0].songList.length;i++) {
                var timeoutID = setTimeout(function(j) {
                    console.log(j);
                    getSpotifyFeatures(token, clientList[0].songList[j].title).then(function(props){
                        getAudioFeatures(token, props["id"]).then(function(properties){
                            //song = clientList[i].songList[j];
                            clientList[0].songList[j].preview_url = props["preview_url"];
                            clientList[0].songList[j].score = computeSpotifyScore(properties,info);
                            //add in instrument component
                            if(clientList[0].songList[j].hasInstrument) clientList[0].songList[j].score += (.75 * info.ins);
                            else clientList[0].songList[j].score += (.25 * info.ins);
                        })
                    })
                }, i * 20,i);
            }
        };
//    };
}
function computeSpotifyScore(spotify_props, info){
    console.log(spotify_props);
    var dance = (1 - Math.abs(spotify_props.danceability - info.dance)) * (info.lyr / 10);
    var key = 0.25 * (info.kyA / 10);
    var tempo = (1 - .1 * Math.floor(Math.abs(spotify_props["tempo"] - info.tempo) / 5)) * (info.tem / 10);
    if(tempo < 0) tempo = 0;
    var length = (1 - .1 * Math.floor(Math.abs(spotify_props["length"] - info.songLength) / 10)) * (info.len / 10);
    if(length < 0) length = 0;
    return (dance+key+tempo+length);
// (1 - Math.abs(spotify_props.danceability))+ (.25/*key*/)+(1 - .1 * Math.floor(Math.abs(spotify_props["tempo"])))+(1 - .1 * Math.floor(Math.abs(spotify_props["length"])))
// ); Old formula for safekeeping
}
function makeAudioFeaturesRequest(token, spotify_song_id){
    return reqPromise.get({ url: "https://api.spotify.com/v1/audio-features/" + spotify_song_id + "?access_token=" + token });
}

function convertMillisToSeconds(millis){
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes * 60 + seconds;
}

function mapNumToKey(key_number){
    const values = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
    return values[key_number];
}
/*io.use(sharedSess(session, {
    autoSave: true
}))*/
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
        'playlist-modify-private'/*,*/ //I commented out this comma, I don't think it's needed 1:46am Joey
    ];
    var state = "I'm not sure what to put here";
    //spotify.setRedirectURI('http://trackmaster.me/authorize');
    spotify.setRedirectURI('http://localhost:81/authorize');
    res.redirect(spotify.createAuthorizeURL(scopes, state));
});

app.get('/authorize', function(req, res) {
    spotify.authorizationCodeGrant(req.query.code).then(function(data) {
        spotify.setAccessToken(data.body.access_token);
        spotify.setRefreshToken(data.body.refresh_token);
        console.log(data.body);
        req.session.spotifyToken = data.body.access_token;
        res.redirect('/create');
    });
});

app.get('/create', function(req, res) {
    io.on('connection',function(client){
        client.on('songinfo', function(info){
            startQuery(info.lyrics,client.id);
            var isThere = false;
            var clientFolder = Object.create(userClient);
            clientFolder.token = client.id;
            for(var i=0;i<clientList.length;i++){
                if(clientList[i].token == client.id)
                    isThere = true;
            }
            if(!isThere)
                clientList.push(clientFolder);
            var token = req.session.spotifyToken;
            //console.log(info);
            setTimeout(function(){
                console.log(info);
                checkSongs(client.id, info.instruments);
                //console.log(clientList[0].songList);//Used index 0 because I didn't want to write another for loop but it works for now
                setTimeout(function(){
                    runSpotifyStuff(token, client.id, info);
                    setTimeout(function(){
                        var newList = [];
                        for(i of clientList[0].songList){
                            if(i.hasOwnProperty("score"))
                                newList.push(i);
                        }
                        client.emit('playlist',newList);
                    }, 7000)
                },1000)
            },4000)
            /*THIS ALL WORKS I WILL EXPLAIN IN THE MORNING*/

            //Basically I store the client id and use that to store/fetch the songlist instead of having a single global variable
        });
    });
    return res.sendFile(__dirname + '/create.html');
});
app.use(express.static('Public'));

http.listen(process.env.PORT || 81, function(){
    console.log("Listening on *:81");
});
