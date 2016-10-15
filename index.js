var express = require('express');
var app = require('express')();
var http =require('http').Server(app);
var io = require('socket.io')(http);

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