// SERVER LEVEL CLASS

var Level = function() {
	var entities = [];	
	var levelNum = 0;
	
	
	function getEntities() {
		return entities;
	};
	function clear() {
		entities.length = 0;
	};
	function addEntity(entity) {
		entities.push(entity);
	};
	function draw(ctx,entity_texture) {
		for(var i=0;i<entities.length;i++) {
			entities[i].draw(ctx, entity_texture);
		}	
	
	};

	// Define variables
	return {
		levelNum: levelNum,
		getEntities : getEntities,
		clear : clear,
		addEntity : addEntity,
		draw : draw
	};

};



