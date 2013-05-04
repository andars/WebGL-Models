    var gl;
    var pMatrix = mat4.create();
    (function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }());
    
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
		shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
        //shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        //gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
        shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
        shaderProgram.lightingDirectionUniform= gl.getUniformLocation(shaderProgram, "uLightDirection");
        //shaderProgram.positionUniform = gl.getUniformLocation(shaderProgram, "uPosition");
        console.log(shaderProgram.vertexPositionAttribute);
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
    
   
    //gl.uniformMatrix4fv(shaderProgram.vMatrixUniform,false,cam.matrix);
}


    
var pyramid, cam;

function initScene(canvas) {
    	var instance;
    	pyramid = new Model();
    	pyramid.load('queen');
    	cam = new Camera();
    	for (var i = 0; i<100; i++){
    		instance = pyramid.createInstance();
    		//console.log(instance);
    		vec3.set(instance.position, (Math.random()-0.5) * 100.0,
                    (Math.random()-0.5) * 0.0,
                    (Math.random()-0.5) * 100.0);
			mat4.translate(instance.matrix,instance.matrix,
					instance.position);
        }
    	mat4.perspective(pMatrix,45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
		 gl.uniformMatrix4fv(shaderProgram.pMatrixUniform,false,pMatrix);
		 
    	mat4.lookAt(viewMatrix,[0.0,0.0,-15.0],[0,0,0],[0,1,0]);
    	
}

var viewMatrix = mat4.create();
function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
       var lightingDirection = [
        	parseFloat(document.getElementById("ldX").value),
        	parseFloat(document.getElementById("ldY").value),
        	parseFloat(document.getElementById("ldZ").value)
      ];
      	var adjustedLD = vec3.create();
      	vec3.normalize(adjustedLD,lightingDirection);
      	
      	vec3.scale(adjustedLD,adjustedLD, -1);
      	//console.log(adjustedLD);
      	gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
		 gl.uniformMatrix4fv(shaderProgram.vMatrixUniform,false,cam.getMatrix());
       
        mat4.identity(modelMatrix);
		
        pyramid.renderInstances();
		
		
    }
var lasttime = 0;
function update(time) {
	
    	window.requestAnimationFrame(update);
    	
    	drawScene();
    	
    	update.elapsed = time - update.lasttime||0;
    	
    	//pyramid.update(update.elapsed);
    	cam.update(update.elapsed);
    	update.lasttime = time;
}




function webGLStart() {
        var canvas = document.getElementById("canvas");
        eventHandler.setup();
        
        initGL(canvas);
        initShaders();
        initScene(canvas);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        //gl.enable(gl.CULL_FACE);
        //gl.cullFace(gl.BACK);
        //gl.disable(CULL_FACE);
		//lockPointer();
        update();
}
function lockPointer() {
		var canvas = document.getElementById("canvas");
		canvas.requestPointerLock = canvas.requestPointerLock||
									canvas.mozRequestPointerLock||
									canvas.webkitRequestPointerLock;
		canvas.requestPointerLock();
		canvas.focus();
}
    
    
