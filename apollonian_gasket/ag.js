!function(){
	var
	
	WIDTH = 600,
	HEIGHT = 600,
	r0 = -300,		// Radius of outer soddy circle, neg bc it's outer, for the sake of formula
	canvas = document.getElementById('ag'),
	ctx = canvas.getContext('2d'),
	mx, my,

	browserToGraph = function(coord) { return { x: coord.x-WIDTH/2, y: HEIGHT/2-coord.y }; },
	graphToBrowser = function(coord) { return { x: coord.x + WIDTH/2, y: HEIGHT/2 - coord.y }; },

	drawCurvature = function(c){
		var coord = graphToBrowser({x: c.x, y: c.y});

		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.arc(coord.x, coord.y, c.r, 0, Math.PI*2, false);
		ctx.stroke();
		ctx.closePath();
	},
	
	// gets x and y of soddy given c1, c2, and r
	getPoint = function(c1, c2, r, q, lvl) {
		var
		
		x, y, hyp, theta, tc12,
		
		a = c1.r+c2.r,
		b = c1.r+r,
		c = c2.r+r,
		
		A = Math.acos((Math.pow(b,2) + Math.pow(c,2) - Math.pow(a,2))/(2*b*c)),
		B = Math.acos((Math.pow(a,2) + Math.pow(c,2) - Math.pow(b,2))/(2*a*c)),
		C = Math.acos((Math.pow(a,2) + Math.pow(b,2) - Math.pow(c,2))/(2*a*b));
		
		
		opp = c1.y-c2.y,
		adj = c1.x-c2.x;
		
		if(opp===0 || adj===0) {
			// if both points are on axis
			x = b*Math.sin(C),
			y = -Math.sqrt(Math.pow(b,2) - Math.pow(x-c1.x, 2)) + c1.y;	
		} else {
			hyp = Math.sqrt(Math.pow(opp,2) + Math.pow(adj,2));
			tc12 = Math.acos((Math.pow(hyp,2) + Math.pow(adj,2) - Math.pow(opp,2))/(2*hyp*adj));


			if(c2.x<0) {
				theta = (q==='tl' || q==='tr' ? -B : B) + (opp<0 ? tc12 : -tc12);
				x = c2.x + c*Math.cos(theta);
				y = c2.y - c*Math.sin(theta);
			} else {
				theta = (q==='tl' || q==='tr' ? -B : B) + (opp<0 ? - tc12 : tc12);
				x = c2.x + c*Math.cos(theta);
				y = c2.y + c*Math.sin(theta);
			}

		}
		
		return { x : x, y : y }
	},
	
	getSoddyEdge = function(c1, c2, q, lvl) {
		var 

		numerator = c1.r*c2.r*r0,
		denom1 = c2.r*r0 + c1.r*c2.r + c1.r*r0,
		denom2 = 2*Math.sqrt(c1.r*c2.r*r0*(c1.r+c2.r+r0)),

		edgeC = { r: numerator/(denom1-denom2) },
		point = getPoint(c1, c2, edgeC.r, q, lvl);

		edgeC.x = point.x;
		edgeC.y = point.y;

		return edgeC;
	},
	
	drawSetup = function(x, y) {
		var
		c1 = { r: (300 - y)/2, x: 0, y: HEIGHT/2 - (300 - y)/2 },
		c2 = { r: (300 + y)/2, x: 0, y: -c1.r },
		edgeCR = getSoddyEdge(c1, c2),
		edgeCL = { r: edgeCR.r, x: -edgeCR.x, y: edgeCR.y };


		ctx.clearRect ( 0 , 0 , WIDTH , HEIGHT);
	
		drawCurvature({x: 0, y: 0, r: WIDTH/2}); // outer soddy circle
		drawCurvature(c1); // top soddy circle
		drawCurvature(c2); // bot soddy circle
	
		drawCurvature(edgeCL); // left soddy circle
		drawCurvature(edgeCR); // right soddy circle
		
		return { cTop: c1, cBottom: c2, cLeft: edgeCL, cRight: edgeCR };
	},
	
	ag = function(c1, c2, c3, q, lvl){
		lvl++;
		
		if(lvl === 7) return;
		if(c3 === 'edge') {
			var c = getSoddyEdge(c1, c2, q, lvl)
			drawCurvature(c);
			ag(c1,c,'edge', q, lvl);
			ag(c,c2,'edge', q, lvl);
		}
		return false;
	};


	canvas.addEventListener('mousemove', function(e){
		var s, c = browserToGraph({x:e.clientX - 38,y:e.clientY - 38});

		mx = c.x;
		my = c.y;

		//don't show anything outside of the circle
		if(Math.pow(mx,2) + Math.pow(my,2)  < Math.pow(WIDTH/2 ,2)) {
			s = drawSetup(mx,my);
			ag(s.cTop, s.cLeft, 'edge', 'tl', 0);
			ag(s.cTop, s.cRight, 'edge', 'tr', 0);
			ag(s.cBottom, s.cLeft, 'edge', 'bl', 0);
			ag(s.cBottom, s.cRight, 'edge', 'br', 0);
		}
	}, false);

}();