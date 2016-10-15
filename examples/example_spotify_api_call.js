const api_token = "BQCNGH7fOF9RpBVtSWQ-J4fuDJntN7KGDjO5IfmOheHD24lqM-GpZKMjK-DSubczbR6nT6LTNCWbBfJ-SSELrmvAK-MOsjYk4DjvZ2T2tMa3vyFnPxPxlL_Uo61siXwtrD4iEmXBJmglbPwyxfNPW_kIcjvxkeSyA4Ag_WrMGvBeEGbLlo145Uo1WpLnWicdAAg7m-LoVBeAaZME-lFSHzEznMqHsOmk8eY7Ja6p2-h6TE4Ww0L9CM1ddlE_";

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
				"length": convertMillisToSeconds(response["duration_ms"]),
				"tempo": Math.floor(response["tempo"])
			}
			return objectToReturn;
		});
}

function getSpotifyFeatures(song_name){
	//returns the name, ID, and preview link
	return makeIDRequest(song_name)
	.then(function(response){
		var objectToReturn = {
			"name": response.tracks.items[0]["name"],
			"id": response.tracks.items[0]["id"],
			"preview_url": response.tracks.items[0]["preview_url"]
		}
		return objectToReturn;
	});
}

function test(){
	getSpotifyFeatures("Footloose").then(function(props){
		getAudioFeatures(props["id"]).then(function(properties){
			console.log(properties);
		})
	})
}

function makeAudioFeaturesRequest(spotify_song_id){

	return $.get({
			url: "https://api.spotify.com/v1/audio-features/" + spotify_song_id + "?access_token=" + api_token
			});
}

function makeIDRequest(song_name){

	return $.get({
			url: "https://api.spotify.com/v1/search/?q=" + song_name + "&type=track"
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