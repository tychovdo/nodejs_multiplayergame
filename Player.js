// SERVER PLAYER CLASS

var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		score = 0,
		id;

	// Getters and setters
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var getScore = function() {
		return score;
	};

	
	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};
	var setScore = function(newScore) {
		score = newScore;
	};

	// Define variables
	return {
		getX: getX,
		getY: getY,
		getScore: getScore,
		setX: setX,
		setY: setY,
		setScore: setScore,	
		id: id
	}
};

// Export player so you can use require("Player").Player
exports.Player = Player;


