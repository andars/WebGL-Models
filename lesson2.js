
    var gl;
    var pMatrix = mat4.create();
    
    function checkUndefined(functionName, args) {
  		for (var ii = 0; ii < args.length; ++ii) {
    		if (args[ii] === undefined) {
     		 console.error("undefined passed to gl." + functionName + "(" +
                     WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
    		}
  		}
	} 
	
	function logGLCall(functionName, args) {   
  		 console.log("gl." + functionName + "(" + 
      	WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");   
	} 
	function throwOnGLError(err, funcName, args) {
  		throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
	};
	
    function initGL(canvas) {
        try {
        	 gl = canvas.getContext("experimental-webgl");
        	 
        	//gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError, checkUndefined);
           
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
        
    }
	

    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }


    var shaderProgram;

    function initShaders() {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
        shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
        //shaderProgram.positionUniform = gl.getUniformLocation(shaderProgram, "uPosition");
        console.log(shaderProgram.mMatrixUniform);
    }
	
	
	var modelMatrix = mat4.create();
	var modelMatrixStack = [];
    
	
	function modelPush(){
		var copy = mat4.clone(modelMatrix);
		modelMatrixStack.push(copy)
	}
	function modelPop(){
		modelMatrix = modelMatrixStack.pop();
	}

    
function setMatrixUniforms(modelmat) {
    //gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, p);
    gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, modelmat);
    
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform,false,pMatrix);
    gl.uniformMatrix4fv(shaderProgram.vMatrixUniform,false,viewMatrix);
}


    
var pyramid;
function initModels() {
    	var instance;
    	pyramid = new Model();
    	
    	for (var i = 0; i<1000; i++){
    		instance = pyramid.createInstance();
    		console.log(instance);
			mat4.translate(instance.matrix,instance.matrix,
					[(Math.random()-0.5) * 100.0,
                    (Math.random()-0.5) * 100.0,
                    (Math.random()-0.5) * 100.0]);
        }
    	mat4.perspective(pMatrix,45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

    	mat4.lookAt(viewMatrix,[0.0,0.0,-15.0],[0,0,0],[0,1,0]);
    	
}

var viewMatrix = mat4.create();
function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

       
        mat4.identity(modelMatrix);
		
        pyramid.renderInstances();
		
		
    }
var lasttime = 0;
function update() {
		if (update.lasttime === undefined)
			update.lasttime = 0;
	
    	webkitRequestAnimationFrame(update);
    	drawScene();
    	update.currtime = new Date().getTime();
    	update.elapsed = update.currtime - update.lasttime;
    	
    	//pyramid.update(update.elapsed);
    	if (eventHandler.keyStates[87]){
    		mat4.translate(viewMatrix,viewMatrix,
    			[0,0,0.1*update.elapsed]);
    	}
    	if (eventHandler.keyStates[83]){
    		mat4.translate(viewMatrix,viewMatrix,
    			[0,0,-0.1*update.elapsed]);
    	}
    	update.lasttime = update.currtime;
}




function webGLStart() {
        var canvas = document.getElementById("canvas");
        eventHandler.setup();
        initGL(canvas);
        
        initShaders();
        initModels();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        update();
}
    
    