var server = io();
//Add socket.io stuff here
var dataObj = {}

function makePlayers() {
    $(".player").each(function(ply) {
        ply = $(ply);
        var audio = ply.find("audio");
        var btn = ply.find("img");

        console.log(btn);

        btn.click(function() {
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        });
    });
}

$(document).ready(function(){
    makePlayers();

	$("#create-btn").click(function(){
        console.log(" iam not a hauaman");
		dataObj.lyrics = $("#lyrics").val();
		dataObj.instruments = $("#instr-dropdown").val();
		dataObj.tempo = parseInt($("#tempo").val());
		dataObj.songLength =(parseInt($("#minutes_song").val())*60)+parseInt($("#seconds_song").val());
		dataObj.key = $("#key-dropdown").val();
		dataObj.dance = parseInt($("#danceAmount").val());
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
