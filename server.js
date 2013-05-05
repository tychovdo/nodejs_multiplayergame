// SET UP NODE.JS
var util = require("util"),
	io = require("socket.io"), 				// Socket.IO
	Player = require("./Player").Player;	// Player class
	Level = require("./Level").Level;		// Level class

// SET UP GAME VARIABLES
var socket,
	players,
	levelNum = 1,
	levels;

// INIT
function init() {
	// Create player array
	players = [];

	// Create level array
	util.log("Loading levels...");
	levels = [];
	for(var i=0;i<3;i++) {
		var templevel = new Level(i);
		levels.push(templevel);
		//util.log(templevel.getEntities.length);
	}



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

	// Score player
	client.on("score player", onScorePlayer);
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
		this.emit("score player", { id: existingPlayer.id,
									score: existingPlayer.getScore()
									});
	};

	// Send level
	var currentLevel = levels[levelNum];
	var currentEntities = currentLevel.getEntities();
	for(var i=0;i<currentEntities.length;i++) {
		this.emit("new entity", {	levelNum: 	levelNum,
									type:		currentEntities[i].getType(),
									id:			currentEntities[i].getId(),
									x:			currentEntities[i].getX(),
									y:			currentEntities[i].getY()
								});	
	}
	
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
	var currentLevel = levels[levelNum];
	var currentEntities = currentLevel.getEntities();
	for(var i=0;i<currentEntities.length;i++) {
		var rectA = {
			id:		currentEntities[i].getId(),
			left:	currentEntities[i].getX(),
			top:	currentEntities[i].getY(),
			right:	currentEntities[i].getX() + 32,
			bottom:	currentEntities[i].getY() + 32
		};
		var rectB = {
			left:	data.x,
			top:	data.y,
			right:	data.x + 32,
			bottom:	data.y + 32
		};
		if(intersectRect(rectA, rectB)) {
			util.log(currentEntities[i].getId());
		};
			
	}
	

	// Broadcast player
	this.broadcast.emit("move player", {	id: movePlayer.id,
											x: movePlayer.getX(),
											y: movePlayer.getY()
										});
};
function intersectRect(r1,r2) {
	return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);

}



function onScorePlayer(data) {
	// Find player in array
	var scorePlayer = playerById(this.id);
	
	// Player not found
	if (!scorePlayer) {
		util.log("No player to score: "+this.id);
		return;
	};

	// Update player
	scorePlayer.setScore(data.score);

	// Broadcast player
	this.broadcast.emit("score player", { 	id: scorePlayer.id, 
											score: scorePlayer.getScore()
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

