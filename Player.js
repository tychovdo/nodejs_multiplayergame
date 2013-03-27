// SERVER PLAYER CLASS

var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		id;

	// Getters and setters
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	
	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	// Define variables
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		id: id
	}
};

// Export player so you can use require("Player").Player
exports.Player = Player;


