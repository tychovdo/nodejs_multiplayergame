// SET UP NODE.JS
var util = require("util"),
	io = require("socket.io"), 				// Socket.IO
	Player = require("./Player").Player;	// Player class

// SET UP GAME VARIABLES
var socket,
	players;

// INIT
function init() {
	// Create player array
	players = [];

	// Set up Socket.IO
	var port = 1337;
	socket = io.listen(port);
	
	socket.configure(function() {
		socket.set("transports", ["websocket"]);

		socket.set("log level", 2);
	});

	// Set up EventHandlers
	setEventHandlers();
};

// SET UP EVENT HANDELRS
var setEventHandlers = function() {
	socket.sockets.on("connection", onSocketConnection); // Listen to Socket.IO
};

// New Socket connection
function onSocketConnection(client) {
	util.log("New connection: "+client.id);

	// Disconnect
	client.on("disconnect", onClientDisconnect);

	// New player
	client.on("new player", onNewPlayer);

	// Move player
	client.on("move player", onMovePlayer);
};

// Disconnect
function onClientDisconnect() {
	util.log("Player has disconnected: "+this.id);

	var removePlayer = playerById(this.id);

	// Player not found
	if(!removePlayer) {
		util.log("No player to remove: "+this.id);
		return;
	};

	// Remove player from array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast disconnected playerID
	this.broadcast.emit("remove player", {id: this.id});
};

// New player
function onNewPlayer(data) {
	// Create new player
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = this.id;

	// Broadcast new player
	this.broadcast.emit("new player", {	id: newPlayer.id, 
										x: newPlayer.getX(), 
										y: newPlayer.getY()
	});
	
	// Send update to new player
	var i, existingPlayer;
	for(i=0;i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {	id: existingPlayer.id,
									x: existingPlayer.getX(),
									y: existingPlayer.getY()
								});
	};

	// Add new player to players array
	players.push(newPlayer);
};


// Move player
function onMovePlayer(data) {
	// Find layer in array
	var movePlayer = playerById(this.id);

	// Player not found
	if (!movePlayer) {
		util.log("No player to move: "+this.id);
		return;
	};

	// Update player 
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);

	// Broadcast player
	this.broadcast.emit("move player", {	id: movePlayer.id,
											x: movePlayer.getX(),
											y: movePlayer.getY()
										});

};

// GAME FUNCTIONS

// Find player by ID
function playerById(id) {
	var i;
	for (i=0; i< players.length; i++) {
		if (players[i].id == id)
			return players[i];
	};

	return false;
};

// START THE SERVER

init();	
