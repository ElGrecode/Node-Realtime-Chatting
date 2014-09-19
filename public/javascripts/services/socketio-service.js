$(function(){ // Wait until the entire DOM is loaded - so we have jQuery and everything here
	var socket = io.connect('http://localhost');

	// Declaring vars for page elements
	var messageForm = $('#send-message');
	var messageBox = $('#message');
	var name = $('#name');
	var chat = $('#chat');

	// Go and grab existing messages from the API
	$.get("/message", function(allMessages){
		console.log(allMessages);
		for(var i = 0; i < allMessages.length; i++){
			printMessage(allMessages[i]);
		}
	});

	messageForm.submit(function(event){
		event.preventDefault();
		var messageBoxVal = messageBox.val();
		var nameVal = name.val();
		var messageObject = {
			name: nameVal,
			message: messageBoxVal
		};
		// To see that it's working
		console.log('Submit button working');


		socket.emit('send message', messageObject);

		messageBox.val('');

		// jQuery AJAX call to POST message to mongo database
		$.ajax({
			type: "POST",
			url: "/message",
			data: messageObject
		});

		// name.val(''); // (unecessary?)
	});

	socket.on('new message', function(data){
		printMessage(data);
	});	

	function printMessage(data){
		chat.append(data.name + ' - ' + data.message + '<br>');
	}

});