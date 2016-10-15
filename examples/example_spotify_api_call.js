const api_token = "BQBn0cSSVcNaMGekA-7mdEqfNwFnYgdnVJfX8Pgk_BNIeiRa43g0UN2sgkK8seqDUGpieopYpi90Wp2Tyq5i3luYOgJVK1zWnvwkInEBKrHKgKZyiYVipI3Ccln3kVeoJydHkYSZG643QcTWsyNerenZqsoVC2LmOtUhyXvS0AUKb5_qWlBBxzaCdi74mC0raZ35x9nke2TYyP6x5UoR5Psp4lAUD7S90AujAXf09DBenS0-qrFXz-rq2Jem";

/*
Client ID
a385221958aa41d28ece2005e33a9b20

Secret
033ff04f6e0b4157a67c1870be6f8945

Sendto URL:
http://trackmaster.me/playlists
*/

function getAudioFeatures(song_id){
	//returns an object with danceability, key, length, tempo
	return makeAudioFeaturesRequest(song_id)
		.then(function(response){
			var objectToReturn = {
				"danceability": response["danceability"],
				"key": mapNumToKey(response["key"]),
				"length": response["length"],
				"tempo": Math.floor(response["tempo"])
			}
			return objectToReturn;
		});
}

//implementation
/*
getAudioFeatures(ID).then(function(props) {

});
*/

function makeAudioFeaturesRequest(spotify_song_id){

	return $.get({
			url: "https://api.spotify.com/v1/audio-features/" + spotify_song_id + "?access_token=" + api_token
			});
}

function convertMillisToSeconds(millis){

  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function mapNumToKey(key_number){
	const values = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
	return values[key_number];
}


//original url
//https://api.spotify.com/v1/audio-features/6rqhFgbbKwnb9MLmUQDhG6?access_token=BQDN-2O72sTUuuBOSBCaQCABs2_bsHTZggHmyUspSGppq6in1qgeZx_HSTPw_diN_T6HhKqgaYhymtWRdgD4kTZjH3VLFI0uE5VtCJp3tOqndYrWRgGz5SjPfiOjtz7geJTpSCExBwaxIYOK

/* Example Response
{
  "danceability" : 0.735,
  "energy" : 0.578,
  "key" : 5,
  "loudness" : -11.840,
  "mode" : 0,
  "speechiness" : 0.0461,
  "acousticness" : 0.514,
  "instrumentalness" : 0.0902,
  "liveness" : 0.159,
  "valence" : 0.624,
  "tempo" : 98.002,
  "type" : "audio_features",
  "id" : "06AKEBrKUckW0KREUWRnvT",
  "uri" : "spotify:track:06AKEBrKUckW0KREUWRnvT",
  "track_href" : "https://api.spotify.com/v1/tracks/06AKEBrKUckW0KREUWRnvT",
  "analysis_url" : "https://api.spotify.com/v1/audio-analysis/06AKEBrKUckW0KREUWRnvT",
  "duration_ms" : 255349,
  "time_signature" : 4
}
*/