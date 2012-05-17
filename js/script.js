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

(function(){
	var graphic=VectorGraphic.init(document.getElementById("map"), 600, 600);
	var points=genRandPoints(graphic.dimX, graphic.dimY, 2000);
	var polygons=null;
	
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
		webkitRequestAnimationFrame(animation);
	};

	function partitionateSpace(runs){
		for(var i=0; i<runs; i++){
			genVoronoi();
			relaxCentroid();
		}
		genVoronoi();
	}

	graphic.paper.clear();
	partitionateSpace(10);
	displayVoronoi();
	//animation();

})();
