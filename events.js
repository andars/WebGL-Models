var eventHandler = {
	keyStates:[],
	self: this,
	dirty: 0,
	setup: function(){
		//this.keyStates[87] = true;
		console.log("setup");
		//document.getElementById('canvas').addEventListener('mousemove', this.onMouseMove);
		document.getElementById('canvas').addEventListener('keyup', function(event){
		
        	eventHandler.keyStates[(event.keyCode)] = false;
		
		});
		document.getElementById('canvas').addEventListener('keydown', function(event){
			console.log(event.keyCode);
			if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        		event.preventDefault();
    		}
        	eventHandler.keyStates[(event.keyCode)] = true;
        });
		document.getElementById('canvas').setAttribute('tabindex','0');
		document.getElementById('canvas').focus();
	
	},
	
	onMouseMove: function(event){
		//console.log(event);
	}
};