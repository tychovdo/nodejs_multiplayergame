// GAME VARIABLES
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
	localPlayer,	// Local player
	remotePlayers,	// Remote players
	socket,			// Socket connection
	level;


var texture_player;

// GAME INITIALISATION
function init() {
	// Setting up Canvas
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");
		// canvas.width = window.innerWidth;
		// canvas.height = window.innerHeight;

	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.height = 600;
	
	canvasWidth = parseInt(canvas.width);
	canvasHeight = parseInt(canvas.height);
	canvasTop = parseInt(canvas.style.top);
	canvasLeft = parseInt(canvas.style.left);

	// Setting up Keyboard controls	
	keys = new Keys();
	
	// Level
	level = new Level();

	// Load resources
	texture_player = new Image();
	texture_player.src = "img/player.png";

	// Setting up Player start location
	var startX = Math.round(Math.random()*(canvas.width-5)),
		startY = Math.round(Math.random()*(canvas.height-5));

	// Initialise the local player
	localPlayer = new Player(startX, startY);

	// Initialise socket connection
	var serverIP = "localhost";
	socket = io.connect(serverIP , {port: 1337, transports: ["websocket"]});

	// Initialise remote players array
	remotePlayers = [];

	// Start listening for events
	setEventHandlers();
};


// GAME EVENT HANDLERS
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);

	// Socket connection successful
	socket.on("connect", onSocketConnected);

	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);

	// New player message received
	socket.on("new player", onNewPlayer);

	// Player move message received
	socket.on("move player", onMovePlayer);

	// Player removed message received
	socket.on("remove player", onRemovePlayer);

	// Player score message received
	socket.on("score player", onScorePlayer);

	// New entity message received
	socket.on("new entity", onNewEntity);

};

// Keyboard key down
function onKeydown(e) {
	if (localPlayer) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

// Socket connected
function onSocketConnected() {
	console.log("Connected to socket server");

	// Send local player data to the game server
	socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY()});
};

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

// New player
function onNewPlayer(data) {
	console.log("New player connected: "+data.id);

	// Initialise the new player
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = data.id;

	// Add new player to the remote players array
	remotePlayers.push(newPlayer);
};

// Move player
function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	// Player not found
	if (!movePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
};

// Remove player
function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	// Player not found
	if (!removePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Remove player from array
	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};
function onScorePlayer(data) {
	var scorePlayer = playerById(data.id);

	// Player not found
	if (!scorePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Update player score
	scorePlayer.setScore(data.score);
};
function onNewEntity(data) {
	var entity = new Entity(data.type, data.id, data.x, data.y);
	if(level.levelNum===data.levelNum) {
		level.addEntity(entity);
	} else {
		level.clear();
		level.levelNum = data.levelNum;
		level.addEntity(entity);
	}


};

// GAME ANIMATION LOOP
function animate() {
	update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};


// GAME UPDATE
function update() {
	// Update local player and check for change
	if (localPlayer.update(keys,level)) {
		// Send local player data to the game server
		socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
		socket.emit("score player", {score: localPlayer.getScore()});
	};
};


// GAME DRAW
function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle="#568BFF";
	ctx.fillRect(0,0,canvasWidth,canvasHeight);

	// Draw the entities
	level.draw(ctx,texture_player);

	// Draw the local player
	localPlayer.draw(ctx,texture_player);
		

	// Draw the remote players
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		remotePlayers[i].draw(ctx,texture_player);
	};

};


// GAME HELPER FUNCTIONS
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id)
			return remotePlayers[i];
	};
	
	return false;
};
