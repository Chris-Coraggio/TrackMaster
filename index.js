var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = require('express')();

var http =require('http').Server(app);
var io = require('socket.io')(http);

var passwordHash = require('password-hash');
var passwordGen = passwordHash.generate;

var MongoClient = require('mongodb').MongoClient;
var dbUrl = 'mongodb://localhost:27017/TrackMaster';

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyId = 'a385221958aa41d28ece2005e33a9b20';
var spotifySecret = '033ff04f6e0b4157a67c1870be6f8945';

var spotify = new SpotifyWebApi({
    clientId: spotifyId,
    clientSecret: spotifySecret,
    //redirectUri: "http://trackmaster.me/authorize",
    redirectUri: "http://localhost:81/authorize",
});

MongoClient.connect(dbUrl, function(err, db) {
    if (err) {
        console.log("Unable to connect to DB: ", err);
        return;
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
        var scopes = [
            'playlist-read-private',
            'playlist-read-collaborative',
            'playlist-modify-public',
            'playlist-modify-private',
        ];

        var state = "I'm not sure what to put here";
        res.redirect(spotify.createAuthorizeURL(scopes, state));
    });

    app.get('/landing', function(req, res) {
        return res.sendFile(__dirname + '/index.html');
    });

    app.get('/authorize', function(req, res) {
        spotify.authorizationCodeGrant(req.query.code).then(function(data) {
            spotify.setAccessToken(data.body.access_token);
            spotify.setRefreshToken(data.body.refresh_token);

            res.redirect('/playlists');
        });
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
});
