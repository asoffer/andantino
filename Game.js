function Game(){
    this.canvas = document.getElementById("canvas");

    //make it full screen
    this.canvas.width = document.width;
    this.canvas.height = document.height;

    //get the context to draw in
    this.ctx = this.canvas.getContext("2d");

    //put the origin at the center of the screen
    this.ctx.translate(document.width/2,document.height/2);

    //list of all built hexes
    this.hexes = new List();
    
    this.iter = new ListIterator(this.hexes,function(h){h.draw(document.getElementById("canvas").getContext("2d"),gSize);});


    //this.highlightHex = mouseX*2/(3*gSize)
}

Game.prototype.extend({
    init: function(){
	h1 = new Hex(0,0);
	this.hexes.pushBack(h1);
	h2 = new Hex(0,1);
	this.hexes.pushBack(h2);
	h1.ptrs[5] = h2;
	h2.ptrs[2] = h1;
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
    },

});