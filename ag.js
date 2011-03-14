var radius = 10,
	canvas = document.getElementById('ag'),
	ctx = canvas.getContext('2d'),
	
	
	
	wheelCatch = function(e) {
        var delta = 0;
		if(!e) e = window.event;
		
        if (e.wheelDelta) { /* IE/Opera. */
                delta = e.wheelDelta/120;
                if (window.opera)
                        delta = -delta;
        } else if (e.detail) { /** Mozilla case. */
                /** In Mozilla, sign of delta is different than in IE.
                 * Also, delta is multiple of 3. */
                delta = -e.detail/3;
        }
        /** If delta is nonzero, handle it.
         * Basically, delta is now positive if wheel was scrolled up,
         * and negative, if wheel was scrolled down.
         */
        if (delta) mouseScroll(delta, e);
        /** Pre default actions caused by mouse wheel.
         * That might be ugly, but we handle scrolls somehow
         * anyway, so don't bother here..
         */
        if (e.preDefault) e.preDefault();
		e.returnValue = false;	
	},
	mouseScroll = function(delta, e) {
		if( radius < 3 && delta < 0 || radius > ag.prototype.WIDTH/2 - 40 && delta > 0) return;
		if(delta < 0) radius--;
		else radius++;
		
		mouseMove(e);
	},
	mouseMove = function(e) {
		var x = e.clientX - 38,
		y = e.clientY - 38,
		c = ag.prototype.browserToGraph({x:x,y:y});
		x = c.x;
		y = c.y;

		//don't show anything outside of the circle
		if(Math.pow(x,2) + Math.pow(y,2)  < Math.pow(ag.prototype.WIDTH/2 - radius,2))
			new ag(x,y);
	},
	
	
	
	ag = function(x, y){
		
		var bigR = this.WIDTH/2,
			r = radius,
			x = x || 0,
			y = y || 0;
		
		x = (x==0 ? 1 : x);
		y = (y==0 ? 1 : y);
		
		// big circle
		this.drawCircle(0,0,bigR, true);
		
		try {
			// first inner soddy circle
			this.drawCircle(x,y,r);
			//console.log(x + '|' + y);
			
			// top circle
			var h = Math.sqrt(Math.pow(x,2) + Math.pow(y,2)),
				newR = (bigR-(h + r))/2,
				newH = h + r + newR,
				theta = Math.atan(y/x),
				newX = newH*Math.cos(theta) * ( x<0 ? -1 : 1),
				newY = newH*Math.sin( theta) * (x<0 ? -1 : 1);
			this.drawCircle(newX,newY,newR);
			
		} catch(e) {
		
		}
		
		this.drawGrid();
		return false;
	};

ag.prototype = {
	WIDTH : 600,
	HEIGHT : 600,
	
	drawGrid: function(){
		ctx.beginPath();
		ctx.moveTo(this.WIDTH/2, 0);
		ctx.lineTo(this.WIDTH/2, this.HEIGHT);
		ctx.moveTo(0, this.HEIGHT/2);
		ctx.lineTo(this.WIDTH, this.HEIGHT/2);
		ctx.stroke();
		ctx.closePath();
	},
	
	browserToGraph: function(coord) {
		coord.x -= this.WIDTH/2;
		coord.y = this.HEIGHT/2 - coord.y;
		return coord;
	},
	
	graphToBrowser: function(coord) {
		coord.x += this.WIDTH/2;
		coord.y = this.HEIGHT/2 - coord.y;
		return coord;
	},
	
	drawCircle : function(x, y, r, fill){
		ctx.beginPath();
		if(fill) ctx.fillStyle = "white";
		ctx.lineWidth = 2;
		var coord = this.graphToBrowser({x: x, y: y});
		
		// arc(x, y, radius, startAngle, endAngle, anticlockwise)
		ctx.arc(coord.x, coord.y, r, 0, Math.PI*2, false);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
	}
	
}

canvas.addEventListener('mousemove', function(e){ mouseMove(e); }, false);
canvas.addEventListener('DOMMouseScroll', wheelCatch, false);
window.onmousewheel = document.onmousewheel = wheelCatch;