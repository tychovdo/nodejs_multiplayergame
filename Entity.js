// SERVER Entity CLASS

var Entity = function(type, id, x, y) {
	this.type = type;
	this.id = id;
	this.x = x;
	this.y = y;

	function getType() {
		return type;
	};
	function getId() {
		return id;
	};		
	function getX() {
		return x;
	};
	function getY() {
		return y;
	};

	// Define variables
	return {
		getType : getType,
		getId : getId,
		getX : getX,
		getY : getY
	};

};

// Export Entity so you can use require("Entity").Entity
exports.Entity = Entity;


