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
        $("#playlist-results").empty();

        songs.sort(function(a, b) {
            if (a.score < b.score) {
                return -1;
            } else if (a.score > b.score) {
                return 1;
            } else {
                return 0;
            }
        });

        console.log(songs);

        songs = songs.slice(0, parseInt($("#numtracks").val()));

        var index = 1;
        for (var song of songs) {
            var track = $("<div>").addClass("playlist-row");

            track.append($("<p>").text(index).addClass("row-number"));

            track.append($("<p>").text(song.title).addClass("song-title"));
            track.append($("<p>").text(song.author).addClass("song-author"));

            var player = $("<div>")
                .addClass("player")
                .append($("<audio>").append(
                    $("<source>").prop("src", song.preview_url).prop("type", "audio/mpeg")
                ));

            track.append(player);

            $("#playlist-results").append(track);
            index++;
        }

        $(".player").each(function() {
            var ply = $(this);
            ply.addClass("off");

            var audio = ply.children("audio").get(0);
            var img = ply.children("img");

            console.log(audio);
            console.log(img);

            ply.click(function() {
                console.log("HELLO");
                if (audio.paused) {
                    audio.play();

                    ply.removeClass("off");
                    ply.addClass("on");
                } else {
                    audio.pause();
                    audio.currentTime = 0;

                    ply.removeClass("on");
                    ply.addClass("off");
                }
            });
        });
    });
});
