!function(){
	
	var 
		canvas = document.getElementById('ag'),
		width = canvas.parentElement.offsetWidth - 20,	// minus some padding
		height = width*Math.sqrt(3)/2,
		ctx = canvas.getContext('2d'),
		mouseMove = function(e) {
			var x = e.clientX - canvas.offsetLeft,
				y = e.clientY - canvas.offsetTop,
				x = Math.abs(screenToX(x));
			
			
			drawFirstTriangle();
			draw(x,height/2, 0, width/2, 0);
		},
		xToScreen = function(x) { return x+width/2; },
		screenToX = function(x) { return x-width/2; },
		drawFirstTriangle = function() { drawTriangle(0, height, width, true); },
		drawTriangle = function(x, y, width, upright) {

			var x = xToScreen(x),
				height = width*Math.sqrt(3)/2;
			if(upright) height = -height;

			ctx.beginPath()
			ctx.moveTo(x-width/2, y);
			ctx.lineTo(x+width/2, y);
			ctx.lineTo(x, y + height);
			ctx.lineTo(x-width/2,y);
			ctx.closePath();
			if(upright) {
				ctx.fillStyle = "white";
				ctx.fill();
			}
			ctx.stroke();
		},
		
		draw = function(x, y, lvl, maxw, xOffset ){
	
			if (lvl == 8) return; 
		
			if(x*2 <= maxw){
				drawTriangle(xOffset, y, x*2);
			} else {
				//draw base, then draw necessary subsequents
				var nx= x - maxw/2,
					maxh = maxw*Math.sqrt(3)/2;
				drawTriangle(xOffset, y, maxw);
				draw(nx, y- maxh/2, lvl+1, maxw/2, xOffset);
				draw(nx, y+ maxh/2, lvl+1, maxw/2, xOffset+maxw/2);
				draw(nx, y+ maxh/2, lvl+1, maxw/2, xOffset-maxw/2);
			}
		};

	canvas.setAttribute('width', width);
	canvas.setAttribute('height', height);

	document.addEventListener('mousemove', function(e){ mouseMove(e); }, false);
	
	drawFirstTriangle();

}();