/* Author:
	Andrea Barbadoro
*/
VectorGraphic={

	dimX:null,
	dimY:null,
	paper:null,

	siteStyle: {"fill": "red", "r":1, "stroke-opacity":0},
	cornerStyle: {"fill": "#00ff00", "r": 0.5, "stroke-opacity": 0},
	polygonStyle: {"fill-opacity": 0, "stroke-width": 0.2, "stroke": "blue"},

	init: function(elemV, dimX, dimY){
		this.dimX=dimX;
		this.dimY=dimY;
		this.paper=Raphael(elemV, dimX, dimY);
		return this;
	},

	displayPoint: function(point, style){
		style = style || this.siteStyle;
		return this.paper.circle(point[0], point[1], 60).attr(style);
	},

	displayPoints: function(pointArr, style){
		style= style || this.siteStyle;
		var sp=this.paper.set();
		for(var i=0; i<pointArr.length; i++){
			sp.push(this.paper.circle(pointArr[i][0], pointArr[i][1], 60));
		}
		sp.attr(style);
		return sp;
	},

	displayPolygon: function(poly, style){
		style = style || this.polygonStyle;
		var pathStr='M'+poly[0][0] + ' ' + poly[0][1] + 'L';
		for(var i =1; i<poly.length; i++){
			pathStr= pathStr+poly[i][0]+ ' ' + poly[i][1] + ' ';
		}
		pathStr= pathStr+'Z';
		return this.paper.path(pathStr).attr(style);
	},

	displayPolygons: function(polygons, style){
		style = style || this.polygonStyle;
		var sp=this.paper.set();
		for(var i=0; i<polygons.length; i++){
			sp.push(this.displayPolygon(polygons[i]));
		}
		sp.attr(style);
		return sp;

	},
}

function genRandPoints(rangeX, rangeY, quantity){
	var pp=new Array();
	for(var i=0; i<quantity; i++){
		pp.push([Math.random()*rangeX, Math.random()*rangeY]);
	}
	return pp;
}

var anim;
(function(){
	var graphic=VectorGraphic.init(document.getElementById("map"), 600, 600);
	var points;
	var polygons;
	var frameReqId;

	function initGui(){
		$("#go_stop_button").data("status", "go").click(function () {
			if($(this).data("status")==="go"){
				$(this).data("status", "stop").html("Stop!");
				startNewIteration( parseInt( $('#site_num').val() ) );
			}else{
				$(this).data("status", "go").html("Go!");
				stopIteration();
			}
			return false;
		});
	};

	function genVoronoi(){
		polygons=d3.geom.voronoi(points);
		var clipper=d3.geom.polygon([[0,0],[0,graphic.dimY],[graphic.dimX, graphic.dimY],[graphic.dimX,0]]);
		for(var i=0; i<polygons.length; i++){
			polygons[i]=clipper.clip(polygons[i]);
		}
	};
	function displayVoronoi(){
		graphic.displayPoints(points);
		graphic.displayPolygons(polygons);
	};
	function relaxCentroid(){
		for(var i=0; i<points.length; i++){
			points[i]=d3.geom.polygon(polygons[i]).centroid();
		}
	};

	function singleRun(){
		graphic.paper.clear();
		genVoronoi();
		displayVoronoi();
		relaxCentroid();
	};

	function animation(){
		singleRun();
		frameReqId=window.requestAnimationFrame(animation);
	};

	function startNewIteration(sites) {
		if(sites===NaN||sites<2){
			sites=2
		}
		
		points=genRandPoints(graphic.dimX, graphic.dimY, sites);
		animation();
	};

	function stopIteration(){
		window.cancelAnimationFrame(frameReqId);
		graphic.paper.clear();
		genVoronoi();
		displayVoronoi();
	}

	initGui();
//	animation();
})();


// function animation(){	graphic.paper.clear(); run(); webkitRequestAnimationFrame(animation)};

// run();