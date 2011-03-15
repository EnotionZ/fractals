var 
	canvas = document.getElementById('ag'),
	ctx = canvas.getContext('2d'),
	mouseMove = function(e) {
		var x = e.clientX - 38,
			y = e.clientY - 38,
			x = Math.abs(st.prototype.screenToX(x));
			
		// draw initial upright triangle
		st.prototype.drawTriangle(0,st.prototype.HEIGHT,st.prototype.WIDTH, true);
		new st(x,st.prototype.HEIGHT/2, 0, st.prototype.WIDTH/2, 0);
	
	},
	
	st = function(x, y, lvl, maxw, xOffset ){
	
		if (lvl == 8) return; 
		
		if(x*2 <= maxw){
			// drawing in progress
			this.drawTriangle(xOffset, y, x*2);
		} else {
			//draw base, then anim draw
			var nx= x - maxw/2,
				maxh = maxw*Math.sqrt(3)/2;
			this.drawTriangle(xOffset, y, maxw);
			new st(nx, y- maxh/2, lvl+1, maxw/2, xOffset);
			new st(nx, y+ maxh/2, lvl+1, maxw/2, xOffset+maxw/2);
			new st(nx, y+ maxh/2, lvl+1, maxw/2, xOffset-maxw/2);
		}
	};

st.prototype = {
	WIDTH: 800,
	HEIGHT: 800*Math.sqrt(3)/2,
	
	xToScreen: function(x) { return x+this.WIDTH/2; },
	screenToX: function(x) { return x-this.WIDTH/2; },
	drawTriangle: function(x, y, width, upright) {

		var x = st.prototype.xToScreen(x),
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
	}

};
document.addEventListener('mousemove', function(e){ mouseMove(e); }, false);
st.prototype.drawTriangle(0,st.prototype.HEIGHT,st.prototype.WIDTH, true);
