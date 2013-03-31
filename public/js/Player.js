// GAME PLAYER CLASS
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		score = 0,
		id,
		moveAmount = 3;
	
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
		score = score;
	};

	// Update player position
	var update = function(keys) {
		// Previous position
		var prevX = x,
			prevY = y;

		// Up key takes priority over down
		if (keys.up) {
			y -= moveAmount;
			score++;
		} else if (keys.down) {
			y += moveAmount;
			score++;
		};

		// Left key takes priority over right
		if (keys.left) {
			x -= moveAmount;
			score++;
		} else if (keys.right) {
			x += moveAmount;
			score++;
		};

		return (prevX != x || prevY != y) ? true : false;
	};

	// Draw player
	var draw = function(ctx, texture_player) {
		ctx.drawImage(texture_player,x-16,y-16);
		// ctx.fillRect(x-16, y-16, 32, 32);
		ctx.fillStyle = "white";
		ctx.font = "16px Arial";
		ctx.fillText(score, x+5, y-20);
	};

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		getScore: getScore,
		setX: setX,
		setY: setY,
		setScore: setScore,
		update: update,
		draw: draw
	}
};
