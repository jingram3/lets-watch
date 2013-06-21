//Create a video module to use.
(function () {
  window.Chat = {
    socket : null,
  
    initialize : function(socketURL) {
      this.socket = io.connect(socketURL);
	
      var init = new Date().getTime(); 
      $('#message').keyup(function(evt) {
	Chat.send();
      });

      //Process any incoming messages
      this.socket.on('new', this.add);
    },

    //Adds a new message to the chat.
    add : function(data) {
      var name = data.name || 'anonymous';
      var msg = $('<div class="msg"></div>')
        //.append('<span class="name">' + name + '</span>: ')
        .append('<span class="text">' + data.msg + '</span>');
	  
	  //$('#textarea').val('');

      $('#message')
        .val(data.msg);
        //.animate({scrollTop: $('#messages').prop('scrollHeight')}, 0);
    },
 
    //Sends a message to the server,
    //then clears it from the textarea
    send : function() {
      this.socket.emit('msg', {
        name: $('#name').val(),
        msg: $('#message').val()
      });

      //$('#message').val('');

      return false;
    }
  };
}());
