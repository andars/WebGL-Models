var Camera = function(){
	this.matrix = mat4.create();
	this.rotation = vec3.create();
	this.position = vec3.create();
	this.dir = vec3.create();
	this.cammat = mat4.create();
	var self = this;
	this.dirty = false;
	this.moving = false;
	document.getElementById('canvas').addEventListener('mousemove', function(e){
		if (self.moving){
		var movementX = e.movementX ||
      					e.mozMovementX||
      					e.webkitMovementX||
      					0,
      		movementY = e.movementY ||
      					e.mozMovementY      ||
     					e.webkitMovementY||
     					0;
     	self.rotation[0]+=movementY*3.1415/180*.2;
     	if(self.rotation[0]>3.1415/2){
     		self.rotation[0]-=3.1415/2;
     	}
     	self.rotation[1]+=movementX*3.1415/180*.2;
     	
     	self.dirty = true;
     	
     	}
	});
	var callback = function(){self.moving ^= true};
	document.addEventListener('webkitpointerlockchange', callback);
	document.addEventListener('mozpointerlockchange',callback);
		
};
Camera.prototype.update = function(elapsed){
	if (true){
		
		if (eventHandler.keyStates[32]){
    		this.dir[1]+=0.25;
    		this.dirty = true;
    	}
    	if (eventHandler.keyStates[16]){
    		this.dir[1]-=0.25;
    		this.dirty = true;
    	}
    	if (eventHandler.keyStates[39]||eventHandler.keyStates[68]){
    		this.dir[0]+=0.25;
    		this.dirty = true;
    	}
    	if (eventHandler.keyStates[37]||eventHandler.keyStates[65]){
    		this.dir[0]-=0.25;
    		this.dirty = true;
    	}
    	if (eventHandler.keyStates[40]||eventHandler.keyStates[83]){
    		this.dir[2]+=0.25;
    		this.dirty = true;
    	}
    	if (eventHandler.keyStates[38]||eventHandler.keyStates[87]){
    		this.dir[2]-=0.25;
    		this.dirty = true;
    	}
    	if (this.dir != [0.0,0.0,0.0]){
    		mat4.identity(this.matrix);
    		
 			mat4.rotateY(this.matrix,this.matrix,this.rotation[1]);
 			mat4.invert(this.matrix,this.matrix);
 			vec3.transformMat4(this.dir,this.dir,this.matrix);
 			vec3.add(this.position,this.position,this.dir);
 			

    		vec3.set(this.dir,0.0,0.0,0.0);
    		
		}
		//for (var i = 0; i < pyramid.instances.length;
	}
}
Camera.prototype.getMatrix= function(){
	mat4.identity(this.matrix);
 	mat4.rotateX(this.matrix,this.matrix,this.rotation[0]);
 	mat4.rotateY(this.matrix,this.matrix,this.rotation[1]);
 	mat4.translate(this.matrix,this.matrix,[-this.position[0], -this.position[1], -this.position[2]]);
	return this.matrix;
}