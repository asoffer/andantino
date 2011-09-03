function Game(){
    this.canvas = document.getElementById("canvas");

    //make it full screen
    this.canvas.width = document.width;
    this.canvas.height = document.height;

    //get the context to draw in
    this.ctx = this.canvas.getContext("2d");


    //list of all built hexes
    this.hexes = new List();
    
    this.iter = new ListIterator(this.hexes,function(h){h.draw(document.getElementById("canvas").getContext("2d"),20);});
}

Game.prototype.extend({
    init: function(){
	h1 = new Hex(0,0);
	this.hexes.pushBack(h1);
	h2 = new Hex(0,1);
	this.hexes.pushBack(h2);
	h2.ptrU = h1;
	h1.ptrD = h2;
	this.colorHex(h1,"blue");
	this.colorHex(h2,"red");

    },

    draw: function(){
	this.iter.apply();
    },

    colorHex: function(h,c){
	h.color = c;
	h.buildNeighbors(this);
	this.draw();

    }
});