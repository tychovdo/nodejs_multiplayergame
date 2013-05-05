// SERVER LEVEL CLASS
var util = require("util"),
    Entity = require("./Entity").Entity; // Entity class

var Level = function(levelNum) {
	var levelNum = levelNum;
	var entities = [];	
	
	this.init = function(levelNum) {
		switch(levelNum) {
		case 0:
			break;
		case 1:
			var button0 = new Entity("button", 0, 32, 32);
			var button1 = new Entity("button", 1, 80, 32);	
			var button2 = new Entity("button", 2, 32, 80);
			var button3 = new Entity("button", 3, 80, 80);
			entities.push(button0, button1, button2, button3);
			break;
		case 2:
			var button0 = new Entity("button", 0, 32, 32);
			var button1 = new Entity("button", 1, 80, 32);	
			entities.push(button0, button1);
			break;
		default:
			break;
		}
		util.log("Level "+levelNum+" (" + entities.length + " entities).");
		
	}	

	// Setters and Getters	
	function getEntities() {
		return entities;
	};

	this.init(levelNum);

	// Define variables
	return {
		levelNum: levelNum,
		getEntities : getEntities
	};

};

// Export level so you can use require("Level").Level
exports.Level = Level;


