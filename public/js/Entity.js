// SERVER Entity CLASS

var Entity = function(type, id, x, y) {
	this.type = type;
	this.id = id;
	this.x = x;
	this.y = y;

	function draw(ctx, entity_texture) {
		ctx.drawImage(entity_texture,x-16,y-16);
	}
	// Define variables
	return {
		draw : draw
	};

};



