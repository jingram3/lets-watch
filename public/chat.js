function onYouTubePlayerReady(playerId) {
    ytplayer = document.getElementById("myytplayer");
    //var surl = 'http://localhost:5000/'; 
    var surl = 'http://mighty-brook-9138.herokuapp.com/';
    Video.initialize(surl);
}

function onytplayerStateChange(newState) {
    console.log('new state: ' + newState);
    Video.send(newState);
}

//Create a youtube module to use.
(function () {
  window.Video = {
    socket : null,
  
    initialize : function(socketURL) {
      this.socket = io.connect(socketURL);

      ytplayer.addEventListener("onStateChange", "onytplayerStateChange");

      //Process any incoming messages
      this.socket.on('new', this.add);
    },

    //Adds a new message to the chat.
    add : function(data) {
	console.log('we got the state: ' + data.state);
	if(data.state == 1)
	    ytplayer.playVideo();
	else
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


