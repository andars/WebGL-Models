function checkUndefined(e,t){for(var n=0;n<t.length;++n){if(t[n]===undefined){console.error("undefined passed to gl."+e+"("+WebGLDebugUtils.glFunctionArgsToString(e,t)+")")}}}function initGL(e){try{gl=e.getContext("experimental-webgl");gl.viewportWidth=e.width;gl.viewportHeight=e.height}catch(t){}if(!gl){alert("Could not initialise WebGL, sorry :-(")}}function getShader(e,t){var n=document.getElementById(t);if(!n){return null}var r="";var i=n.firstChild;while(i){if(i.nodeType==3){r+=i.textContent}i=i.nextSibling}var s;if(n.type=="x-shader/x-fragment"){s=e.createShader(e.FRAGMENT_SHADER)}else if(n.type=="x-shader/x-vertex"){s=e.createShader(e.VERTEX_SHADER)}else{return null}e.shaderSource(s,r);e.compileShader(s);if(!e.getShaderParameter(s,e.COMPILE_STATUS)){alert(e.getShaderInfoLog(s));return null}return s}function initShaders(){var e=getShader(gl,"shader-fs");var t=getShader(gl,"shader-vs");shaderProgram=gl.createProgram();gl.attachShader(shaderProgram,t);gl.attachShader(shaderProgram,e);gl.linkProgram(shaderProgram);if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)){alert("Could not initialise shaders")}gl.useProgram(shaderProgram);shaderProgram.vertexPositionAttribute=gl.getAttribLocation(shaderProgram,"aVertexPosition");gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);shaderProgram.vertexColorAttribute=gl.getAttribLocation(shaderProgram,"aVertexColor");gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);shaderProgram.pMatrixUniform=gl.getUniformLocation(shaderProgram,"uPMatrix");shaderProgram.mMatrixUniform=gl.getUniformLocation(shaderProgram,"uMMatrix");shaderProgram.vMatrixUniform=gl.getUniformLocation(shaderProgram,"uVMatrix");console.log(shaderProgram.mMatrixUniform)}function modelPush(){var e=mat4.clone(modelMatrix);modelMatrixStack.push(e)}function modelPop(){modelMatrix=modelMatrixStack.pop()}function setMatrixUniforms(e){gl.uniformMatrix4fv(shaderProgram.mMatrixUniform,false,e);gl.uniformMatrix4fv(shaderProgram.pMatrixUniform,false,pMatrix);gl.uniformMatrix4fv(shaderProgram.vMatrixUniform,false,viewMatrix)}function initModels(){pyramid=new Model;mat4.perspective(pMatrix,45,gl.viewportWidth/gl.viewportHeight,.1,100);mat4.lookAt(viewMatrix,[0,0,-15],[0,0,0],[0,1,0])}function drawScene(){gl.viewport(0,0,gl.viewportWidth,gl.viewportHeight);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);mat4.identity(modelMatrix);pyramid.render()}function update(){if(update.lasttime===undefined)update.lasttime=0;webkitRequestAnimationFrame(update);drawScene();update.currtime=(new Date).getTime();update.elapsed=update.currtime-update.lasttime;pyramid.update(update.elapsed);update.lasttime=update.currtime}function webGLStart(){var e=document.getElementById("canvas");eventHandler.setup();initGL(e);initShaders();initModels();gl.clearColor(0,0,0,1);gl.enable(gl.DEPTH_TEST);update()}var eventHandler={keyStates:[],self:this,setup:function(){console.log("setup");document.getElementById("canvas").addEventListener("keydown",this.onKeyDown);document.getElementById("canvas").addEventListener("keyup",this.onKeyUp);document.getElementById("canvas").setAttribute("tabindex","0");document.getElementById("canvas").focus()},onKeyDown:function(e){if([32,37,38,39,40].indexOf(e.keyCode)>-1){e.preventDefault()}eventHandler.keyStates[e.keyCode]=true},onKeyUp:function(e){eventHandler.keyStates[e.keyCode]=false},onMouseMove:function(e){}};var gl;var pMatrix=mat4.create();var shaderProgram;var modelMatrix=mat4.create();var modelMatrixStack=[];var pyramid;var viewMatrix=mat4.create();var lasttime=0;var vertices=[0,1,0,-1,-1,1,1,-1,1,0,1,0,1,-1,1,1,-1,-1,0,1,0,1,-1,-1,-1,-1,-1,0,1,0,-1,-1,-1,-1,-1,1,-1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,-1,-1,-1,1,-1,1];var colors=[1,1,1,1,0,0,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,0,0,1,1,1,1,1,1,0,0,1,0,0,1,1];var Model=function(){this.position=vec3.create();vec3.set(this.position,-1.5,0,0);this.matrix=mat4.create();this.rotation=quat.create();this.vertexbuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexbuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);this.numItems=18;this.colorbuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.colorbuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colors),gl.STATIC_DRAW);console.log("model created")};Model.prototype.render=function(){modelPush();var e=this.matrix;mat4.fromRotationTranslation(e,this.rotation,this.position);gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexbuffer);gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,this.colorbuffer);gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,4,gl.FLOAT,false,0,0);setMatrixUniforms(e);gl.drawArrays(gl.TRIANGLES,0,this.numItems);modelPop()};Model.prototype.update=function(e){var t=this.rotation,n=e/1e3*3.1415,r=vec3.create();if(eventHandler.keyStates[87])quat.rotateX(t,t,n);if(eventHandler.keyStates[83])quat.rotateX(t,t,-n);if(eventHandler.keyStates[65])quat.rotateY(t,t,n);if(eventHandler.keyStates[68])quat.rotateY(t,t,-n);if(eventHandler.keyStates[69])quat.rotateZ(t,t,n);if(eventHandler.keyStates[81])quat.rotateZ(t,t,-n);if(eventHandler.keyStates[32])r[1]+=.25;if(eventHandler.keyStates[16])r[1]-=.25;if(eventHandler.keyStates[39])r[0]+=.25;if(eventHandler.keyStates[37])r[0]-=.25;if(eventHandler.keyStates[40])r[2]+=.25;if(eventHandler.keyStates[38])r[2]-=.25;vec3.add(this.position,this.position,r)}