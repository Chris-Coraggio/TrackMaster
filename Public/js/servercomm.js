var server = io();
//Add socket.io stuff here
var dataObj = {}

$(document).ready(function(){
	$("#create-btn").click(function(){
        if ($(".loading").length == 0) {
            var loadingGif = $("<div>")
                .addClass("loading");

            $(this).after(loadingGif);
        }

        console.log(" iam not a hauaman");
		dataObj.lyrics = $("#lyrics").val();
		dataObj.instruments = $("#instr-dropdown").val();

        var minutes = $("#minutes_song").val() !== "" ? parseInt($("#minutes_song").val()) : 3;
		dataObj.songLength =(minutes*60)+parseInt($("#seconds_song").val());

		dataObj.tempo = parseInt($("#tempo").val());

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

    server.on('playlist', function(songs) {
        $(".loading").remove();

        var index = 1;
        for (var song of songs) {
            var track = $("<div>".addClass(".playlist-row"));

            track.append($("<p>").text(index));

            track.append($("<p>").text(track.title));
            track.append($("<p>").text(track.author));

            var previewAudio = $("<audio controls>");
            previewAudio.append($("<source>").prop("src", previewAudio));

            $("#playlist-results").append(track);
            index++;
        }
    });
});
