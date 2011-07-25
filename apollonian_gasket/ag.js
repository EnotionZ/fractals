!function(){
	var
	
	WIDTH = 600,
	HEIGHT = 600,
	r0 = -300,		// Radius of outer soddy circle, neg bc it's outer, for the sake of formula
	canvas = document.getElementById('ag'),
	ctx = canvas.getContext('2d'),
	
	
	drawGrid = function(){
		ctx.beginPath();
		ctx.moveTo(WIDTH/2, 0);
		ctx.lineTo(WIDTH/2, HEIGHT);
		ctx.moveTo(0, HEIGHT/2);
		ctx.lineTo(WIDTH, HEIGHT/2);
		ctx.stroke();
		ctx.closePath();
	},

	browserToGraph = function(coord) {
		coord.x -= WIDTH/2;
		coord.y = HEIGHT/2 - coord.y;
		return coord;
	},

	graphToBrowser = function(coord) {
		coord.x += WIDTH/2;
		coord.y = HEIGHT/2 - coord.y;
		return coord;
	},

	drawCurvature = function(c){
		var coord = graphToBrowser({x: c.x, y: c.y});

		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.arc(coord.x, coord.y, c.r, 0, Math.PI*2, false);
		ctx.stroke();
		ctx.closePath();
	},
	
	// gets x and y of soddy given c1, c2, and r
	getPoint = function(c1, c2, r) {
		var
		
		a = c1.r+c2.r,
		b = c1.r+r,
		c = c2.r+r,
		
		A = Math.acos((Math.pow(b,2) + Math.pow(c,2) - Math.pow(a,2))/(2*b*c)),
		B = Math.acos((Math.pow(a,2) + Math.pow(c,2) - Math.pow(b,2))/(2*a*c)),
		C = Math.acos((Math.pow(a,2) + Math.pow(b,2) - Math.pow(c,2))/(2*a*b)),
		
		x = b*Math.sin(C),
		y = -Math.sqrt(Math.pow(b,2) - Math.pow(x-c1.x, 2)) + c1.y;
		
		return { x : x, y : y }
	},
	
	// returns the two soddy curvatures
	getEdgeSoddy = function(c1, c2) {
		var 
		
		numerator = c1.r*c2.r*r0,
		denom1 = c2.r*r0 + c1.r*c2.r + c1.r*r0,
		denom2 = 2*Math.sqrt(c1.r*c2.r*r0*(c1.r+c2.r+r0)),
		
		edgeC1 = { r: numerator/(denom1+denom2) },
		edgeC2 = { r: numerator/(denom1-denom2) },
	
		point1 = getPoint(c1, c2, edgeC1.r),
		point2 = getPoint(c1, c2, edgeC2.r);

		edgeC1.x = -point1.x;
		edgeC1.y = point1.y;
		edgeC2.x = point2.x;
		edgeC2.y = point2.y;
		
		return [edgeC1, edgeC2];
	},
	
	ag = function(x, y, lvl){

		// big circle
		ctx.clearRect ( 0 , 0 , WIDTH , HEIGHT);
		drawCurvature({x: 0, y: 0, r: WIDTH/2});
		
		
		var c1 = {
				r: (300 - y)/2,
				x: 0,
				y: HEIGHT/2 - (300 - y)/2
			},
			c2 = {
				r: (300 + y)/2,
				x: 0,
				y: -c1.r
			};

		drawCurvature(c1); // top soddy circle
		drawCurvature(c2); // bot soddy circle
		
		
		
		var edgeSoddy = getEdgeSoddy(c1, c2);
		drawCurvature(edgeSoddy[0]);
		drawCurvature(edgeSoddy[1]);
		
		
		
		drawGrid();
		return false;
	},
	
	mouseMove = function(e) {
		var x = e.clientX - 38,
		y = e.clientY - 38,
		c = browserToGraph({x:x,y:y});
		x = c.x;
		y = c.y;

		//don't show anything outside of the circle
		if(Math.pow(x,2) + Math.pow(y,2)  < Math.pow(WIDTH/2 ,2))
			ag(x,y);
	};


	canvas.addEventListener('mousemove', function(e){ mouseMove(e); }, false);

}();