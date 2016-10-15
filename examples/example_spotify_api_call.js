const api_token = "BQDN-2O72sTUuuBOSBCaQCABs2_bsHTZggHmyUspSGppq6in1qgeZx_HSTPw_diN_T6HhKqgaYhymtWRdgD4kTZjH3VLFI0uE5VtCJp3tOqndYrWRgGz5SjPfiOjtz7geJTpSCExBwaxIYOK";

function getAudioFeatures(spotify_song_id, callback){

	$.get({
		url: "https://api.spotify.com/v1/audio-features/" + spotify_song_id + "?access_token=" + api_token
	})
	.then(function(res){
		callback(res);
	})
}

function convertMillisToSeconds(millis){

  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
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