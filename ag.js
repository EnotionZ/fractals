var cycles = 7,
	ctx = document.getElementById('ag').getContext('2d'),
	ag = function(){
		var bigR = this.WIDTH/2,
			r = 20,
			x = 1,
			y = 1;
			
		// big circle
		this.drawCircle(0,0,bigR);
		
		// first inner soddy circle
		this.drawCircle(x,y,r);
		
		// top circle
		var h = Math.sqrt(Math.pow(x,2) + Math.pow(y,2)),
			newR = (bigR-(h + r))/2,
			newH = h + r + newR,
			theta = 2*Math.PI*3/4 +  Math.atan(y/x),
			newX = newH*Math.cos(theta),
			newY = newH*Math.sin(-theta);
		this.drawCircle(newX,newY,newR);
		
		
		
		return false;
	};

ag.prototype = {
	WIDTH : 500,
	HEIGHT : 500,
	
	normalize: function(coord) {
		coord.x += this.WIDTH/2;
		coord.y = this.HEIGHT/2 - coord.y;
		return {x: coord.x, y: coord.y};
	},
	
	drawCircle : function(x, y, r){
		ctx.beginPath();
		var coord = this.normalize({x: x, y: y});
		
		// arc(x, y, radius, startAngle, endAngle, anticlockwise)
		ctx.arc(coord.x, coord.y, r, 0, Math.PI*2, true);
		ctx.stroke();
		ctx.closePath();
	}
}
a = new ag();