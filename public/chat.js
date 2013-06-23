function onYouTubePlayerReady(playerId) {
    ytplayer = document.getElementById("myytplayer");
    var id = getYoutubeID($('#myytplayer').attr('data'));
    getTitle(id);
    ytplayer.playVideo();
    ytplayer.pauseVideo();
    var surl = 'http://localhost:5000/'; 
    //var surl = 'http://mighty-brook-9138.herokuapp.com/';
    Video.initialize(surl);
}

function onytplayerStateChange(newState) {
    console.log('new state: ' + newState);
    Video.send(newState);
}

function getYoutubeID(url) {
    var video_id = url.split('v=')[1];
    if(!video_id) //differently formatted
	video_id = url.split('/v/')[1].substring(0,11);
    var ampersandPosition = video_id.indexOf('&');
    if(ampersandPosition != -1) {
	video_id = video_id.substring(0, ampersandPosition);
    }
    return video_id;
}

function getTitle(id) {
    $.ajax({
	url: 'http://gdata.youtube.com/feeds/api/videos/'+id
    }).done(function ( data ) {
	$('#vidtitle').text($(data.getElementsByTagName('title')[0]).text());
    });
}

//Create a youtube module to use.
(function () {
    window.Video = {
	socket : null,
	
	initialize : function(socketURL) {
	    this.socket = io.connect(socketURL);
	    
	    ytplayer.addEventListener("onStateChange", "onytplayerStateChange");

  	    $('#send').click(function() {
		Video.loadVideo(getYoutubeID($('#vidurl').val()));
	    });
	    //Process any incoming messages
	    this.socket.on('newState', this.changeState);
	    this.socket.on('newVideo', this.changeVideo);
	},
	
	loadVideo : function(id) {
	    this.socket.emit('vid', {
		videoID: id
	    });
	},

	changeVideo : function(data) {
	    url = 'http://www.youtube.com/v/' + data.videoID;
	    console.log(url);
	    ytplayer.cueVideoByUrl(url);
	    getTitle(data.videoID);
	},
	
	//Changes video state
	changeState : function(data) {
	    console.log('we got the state: ' + data.state);
	    if(data.state == 1)// && ytplayer.getPlayerState != 1)
		ytplayer.playVideo();
	    else if(data.state == 2)// && ytplayer.getPlayerState != 2)
		ytplayer.pauseVideo();
	},
	
	//Sends a message to the server,
	send : function(newState) {
	    this.socket.emit('msg', {
		state: newState
	    });
	    
	    return false;
	}
    };
}());


