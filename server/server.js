
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json())
 
require('./app/router/router.js')(app);

const db = require('./app/config/db.config.js');
 
// Create a Server
var server = app.listen(3300, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("App listening at http://%s:%s", host, port)
});

var io = require('socket.io').listen(server);

// Socket.io operations
io.on('connection', function(socket){
  console.log('A user has connected to the server.');

  socket.on('join', function(username) {
    // Same contract as ng-chat.User
    usersCollection.push({  
      id: socket.id, // Assigning the socket ID as the user ID in this example
      displayName: username,
      status: 0, // ng-chat UserStatus.Online,
      avatar: null
    });

    socket.broadcast.emit("friendsListChanged", usersCollection);

    console.log(username + " has joined the chat room.");

    // This is the user's unique ID to be used on ng-chat as the connected user.
    socket.emit("generatedUserId", socket.id);

    // On disconnect remove this socket client from the users collection
    socket.on('disconnect', function() {
      console.log('User disconnected!');

      var i = usersCollection.findIndex(x => x.id == socket.id);
      usersCollection.splice(i, 1);

      socket.broadcast.emit("friendsListChanged", usersCollection);
   });
  });

  socket.on("sendMessage", function(message){
    console.log("Message received:");
    console.log(message);

    io.to(message.toId).emit("messageReceived", {
      user: usersCollection.find(x => x.id == message.fromId),
      message: message
    });

    console.log("Message dispatched.");
  });
});