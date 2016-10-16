
$(document).ready(function() {
    $(".player").each(function() {
        var ply = $(this);

        var audio = ply.children("audio").get(0);
        var img = ply.children("img");

        console.log(audio);
        console.log(img);

        ply.click(function() {
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
