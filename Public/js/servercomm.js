var server = io();
//Add socket.io stuff here
var dataObj = {}
$(document).ready(function(){
	$("#create-btn").click(function(){
        console.log(" iam not a hauaman");
		dataObj.lyrics = $("#lyrics").val();
		dataObj.instruments = $("#instr-dropdown").val();
		dataObj.tempo = parseInt($("#tempo").val());
		dataObj.songLength =(parseInt($("#minutes_song").val())*60)+parseInt($("#seconds_song").val());
		dataObj.key = $("#key-dropdown").val();
		dataObj.dance = parseInt($("#danceAmout").val());
		//affinities
		dataObj.lyr = parseInt($("#lyricAffin").val());
		dataObj.ins = parseInt($("#instAffin").val());
		dataObj.tem = parseInt($("#tempoAffin").val());
		dataObj.len = parseInt($("#lengthAffin").val());
		dataObj.kyA = parseInt($("#keyAffin").val());
		dataObj.dan = parseInt($("#danceAffin").val());

        server.emit('songinfo', dataObj);
	});
	
});
