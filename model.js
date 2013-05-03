/*var vertices = [
    	0.0,  1.0,  0.0,
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
        // Right face
         0.0,  1.0,  0.0,
         1.0, -1.0,  1.0,
         1.0, -1.0, -1.0,
        // Back face
         0.0,  1.0,  0.0,
         1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,
        // Left face
         0.0,  1.0,  0.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        //Bottom
       	-1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0, -1.0,
        
        1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
];*/
var vertices = [];
var colors = [
            // Front face
        1.0, 1.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        // Right face
        1.0, 1.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        // Back face
        1.0, 1.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        // Left face
        1.0, 1.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        
        1.0, 1.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        
        1.0, 1.0, 1.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
];
var indices = [];
var Model = function(){
		this.dirty = false;
		this.loaded = false;
    	this.position = vec3.create();
    	this.rotation = quat.create();
    	this.instances = [];
    	
    	//initialize position
    	this.matrix = mat4.create();
    	mat4.fromRotationTranslation(this.matrix, this.rotation, this.position);
    	//set up buffers
    	this.vertexbuffer = gl.createBuffer();
    	this.colorbuffer = gl.createBuffer();
    	this.normalbuffer = gl.createBuffer();
    	
       
        //console.log(this.vertexbuffer);
        
        //this.vertices.itemSize = 3;
        
		this.indexbuffer = gl.createBuffer();
		
   		 
        //gl.bindBuffer(gl.ARRAY_BUFFER, this.colorbuffer);
      	
        //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        //this.colors.itemSize = 4;
       	//this.colors.numItems = 18;
		//gl.bindBuffer(gl.ARRAY_BUFFER,null);
		console.log("model created");
};
Model.prototype.render = function(){
		//console.log("draw");
		//modelPush();
		var mat = this.matrix;
		
		if (this.dirty){
    		mat4.fromRotationTranslation(mat,this.rotation,this.position);
    	}
    	
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexbuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexbuffer);
        
        //gl.bindBuffer(gl.ARRAY_BUFFER, this.colorbuffer);
        //gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

        setMatrixUniforms(mat);
        gl.drawElements(gl.TRIANGLES, this.numItems, gl.UNSIGNED_SHORT,0);
        //gl.drawArrays(gl.TRIANGLES, 0, this.numItems);	
        //modelPop();
};
Model.prototype.update = function(elapsed) {
    	var rotation = this.rotation,
    		amount = ((elapsed)/1000.0)*3.1415,
    		dir = vec3.create();
    	if (eventHandler.keyStates[87]){
    		quat.rotateX(rotation,rotation,amount);
    		this.dirty = true;
    	}
    	if (eventHandler.keyStates[83]){
    		quat.rotateX(rotation,rotation,-amount);
    		this.dirty = true;
    	}
    	if (eventHandler.keyStates[65]){
    		quat.rotateY(rotation,rotation,amount);
    		this.dirty = true;
    	}
    	if (eventHandler.keyStates[68]){
    		quat.rotateY(rotation,rotation,-amount);
    		this.dirty = true;
    	}
    	if (eventHandler.keyStates[69]){
    		quat.rotateZ(rotation,rotation,amount);
    		this.dirty = true;
    	}
    	if (eventHandler.keyStates[81]){
    		quat.rotateZ(rotation,rotation,-amount);
    		this.dirty = true;
    	}
    	if (eventHandler.keyStates[32]){
    		dir[1]+=0.25;
    		this.dirty = true;
    	}
    	if (eventHandler.keyStates[16]){
    		dir[1]-=0.25;
    		this.dirty = true;
    	}
    	if (eventHandler.keyStates[39]){
    		dir[0]+=0.25;
    		this.dirty = true;
    	}
    	if (eventHandler.keyStates[37]){
    		dir[0]-=0.25;
    		this.dirty = true;
    	}
    	if (eventHandler.keyStates[40]){
    		dir[2]+=0.25;
    		this.dirty = true;
    	}
    	if (eventHandler.keyStates[38]){
    		dir[2]-=0.25;
    		this.dirty = true;
    	}
    	vec3.add(this.position,this.position,dir);
};
Model.prototype.createInstance = function(){
		var inst = new Instance(this);
		this.instances.push(inst);
		return inst;
};
Model.prototype.load = function(fil){
	var oReq = new XMLHttpRequest();
	var self = this;
	oReq.open("GET", "assets/"+fil+".v", true);
	oReq.responseType = "arraybuffer";
 	
	oReq.onload = function (oEvent) {
  		var arrayBuffer = this.response; // Note: not oReq.responseText
  		//if (arrayBuffer) {
    		self.vertices = new Float32Array(arrayBuffer);
    	///}
    	console.log(self.vertices);
    	gl.bindBuffer(gl.ARRAY_BUFFER, self.vertexbuffer);
    	gl.bufferData(gl.ARRAY_BUFFER, self.vertices, gl.STATIC_DRAW);
    	self.vertexdone = true;
   		if (self.normaldone&&self.indexdone){
   			self.loaded= true;
   		}
  	};
  	oReq.send();
	
	var req = new XMLHttpRequest();
	req.open("GET", "assets/"+fil+".n", true);
	req.responseType = "arraybuffer";
 
	req.onload = function (oEvent) {
  		var arrayBuffer = this.response; // Note: not oReq.responseText
  		if (arrayBuffer) {
    		self.normals = new Float32Array(arrayBuffer);
    		//console.log("buffer");
    	}
    	//console.log(self.normals);
    	gl.bindBuffer(gl.ARRAY_BUFFER, self.normalbuffer);
    	gl.bufferData(gl.ARRAY_BUFFER, self.normals, gl.STATIC_DRAW);
    	self.normaldone = true;
   		if (self.indexdone&&self.vertexdone){
   			self.loaded= true;
   		}
  	};
  	req.send();
  	
  	var req2 = new XMLHttpRequest();
	req2.open("GET", "./assets/"+fil+".i", true);
	req2.responseType = "arraybuffer";
 
	req2.onload = function (oEvent) {
  		var arrayBuffer = this.response; // Note: not oReq.responseText
  		if (arrayBuffer) {
    		self.indices = new Uint16Array(arrayBuffer);
    	}
    	console.log(self.indices);
    	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self.indexbuffer);
   		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, self.indices, gl.STATIC_DRAW);
   		self.numItems = self.indices.length;  
   		self.indexdone = true;
   		if (self.normaldone&&self.vertexdone){
   			self.loaded= true;
   		}
  	};
  	req2.send();
  	
 

};
Model.prototype.renderInstances = function(){
	if (this.loaded){
		var instance;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexbuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalbuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, true, 0, 0);
        
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexbuffer);
		        //gl.bindBuffer(gl.ARRAY_BUFFER, this.colorbuffer);
        //gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
		for(var i in this.instances){
			instance = this.instances[i];
			setMatrixUniforms(instance.matrix);
			 gl.drawElements(gl.TRIANGLES, this.numItems, gl.UNSIGNED_SHORT,0);
			//gl.drawArrays(gl.TRIANGLES, 0, this.numItems);
		}
	}
		
};
var Instance = function(model){
	this.parent = model;
	this.position = vec3.create();
	this.matrix = mat4.create();
};

Instance.prototype = {
	update:function(){}
};