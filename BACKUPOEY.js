var express = require('express');
var app = require('express')();
var http =require('http').Server(app);
var io = require('socket.io')(http);
var request = require("request");

var url = "http://api.musixmatch.com/ws/1.1/track.search?apikey=239ae28847825fe0dd9589afd57032c1&page_size=100&s_artist_rating=desc&s_track_rating=desc";
var firstTime = true;
var outOfReg = false;
var remove;
var compiledList = [];
startQuery("this is my fight song");
//console.log(createURL("this is my fight song",1));
function createURL(lyrics,page){
	var lyricKey = lyrics.replace(/ /g, '%');
	return url +  "&q_lyrics=" + lyricKey + "&page="+page;
}
function startQuery(lyrics){
	var page = 1;
	while(page <= 5){
		console.log("iterating");
		if(makeRequest(createURL(lyrics,page),compileToList)==400){
			console.log("out of stuff");
		}
		page++;
	}
	while(page <= 10){
		var newLyricOne = lyrics.substring(0,lyrics.indexOf(" "));
		var trimmed = lyrics.substring(lyrics.indexOf(" ")+1);
		var newLyricTwo = trimmed.substring(0,trimmed.indexOf(" "));
		var newLyrics = newLyricOne + " " + newLyricTwo;
		console.log(newLyrics);
		makeRequest(createURL(newLyrics, page),compileToList);
		page++;
	}
	console.log("Finished");
	printList();
}
function makeRequest(urlCall,callback){
	console.log("Requesting");
	var returnData;
	var songList = [];
	var code=0;
	request({
		url: urlCall,
		json: true
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
		//console.log(songList);
		callback(songList);
	});
}
function compileToList(songs){
	console.log("compiling");
	//console.log(songs);
	for(var i=0;i<songs.length;i++){
		compiledList.push(songs[i]);
		console.log(songs[i].track_name);
	}
}
function printList(){
	console.log("Printing");
	for(var i=0;i<compiledList.length;i++){
		console.log(compiledList[i].track_name);
	}
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
io.on('connection',function(client){
	console.log("user connected");
});

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
});
app.use(express.static('Public'));

http.listen(process.env.PORT || 81, function(){
	console.log("Listening on *:81");
});