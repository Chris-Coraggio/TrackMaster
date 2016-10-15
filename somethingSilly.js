var scraper = require('google-search-scraper');
var request = require('request');
var reader = require('node-readability');
var realLimit = 1;
var currentScrapes = 0;
fs = require('fs');
var instrumentList

var options = {
    query: 'Instruments used in heathens by the 21 pilots wikipedia',
    limit: 1
};

var songList = [{
    title: "Heathens",
    author: "21 Pilots",
    score: 0
}]

function loadInstruments(callback){
     fs.readFile('instruments.txt','utf8', function(err, data){
	if(err){
	    return console.log(err)
	}
	instrumentList = data.split('\n');
	 callback();
     });
    
}

function checkSongs(songList, songMultiplier){

    for(var song of songList){
	
	var search = {
	    query: 'Instruments used in ' + song.title + ' by ' + song.author,
	    limit: 1
	};
	scraper.search(options, function(err, url){
	if(realLimit > currentScrapes){
	    if(err) throw err;
	    console.log(url);
	    
	    request(url, function(error, response, body){
		//console.log(body);
		var instrCount = 0;
		instrumentTxt = body.slice(body.indexOf("Edit section: Personnel"));
		console.log(instrumentTxt);
		for(var i in instrumentList){
		    console.log(instrumentList[i]);
		    if(instrumentTxt.includes(instrumentList[i])){
			instrCount ++;
		    }
		    
		   
		    
		}
		song.score += instrCount * songMultiplier;
		//	    var articleData = unfluff.lazy(body, 'en');
//	    console.log(articleData.text());
		console.log(songList);
	    });
	    
	}
	    currentScrapes ++;
	    
	});
    }
//    sleep(20);
    
}
loadInstruments(function(){
    checkSongs(songList, 1);}
);
   







/*var request = require("request"),
    cheerio = require("cheerio"),
    url = "https://www.google.com/#q=instruments+used+in+hey+jude+by+the+beatles+wikipedia";

request(url, function (error, response, body){
    if(error){
	console.log("Couldn't get page because of error: " + error);
	return;
    }
    var $ = cheerio.load(body);
    link = $("div.s").html();
    console.log(link);

/*    var $ = cheerio.load(body),
	links = $(".r a");
    links.each(function (i, link){
	console.log(link);
	var url = $(link).attr("href");
	console.log(url);
	url = url.replace("/url?q=", "").split("&")[0];

	if(url.charAt(0) == "/"){
	    return;
	}

	totalResults ++;
    });
});
*/
