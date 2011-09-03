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
	h = new Hex(0,0);
	h.color = "blue";
	this.hexes.pushBack(h);
	h = new Hex(0,1);
	h.color = "red";
	this.hexes.pushBack(h);
	h = new Hex(1,1);
	h.color = "gray";
	this.hexes.pushBack(h);
	h = new Hex(1,2);
	h.color = "green";
	this.hexes.pushBack(h);
	h = new Hex(4,2);
	h.color = "green";
	this.hexes.pushBack(h);

    },

    draw: function(){
	this.iter.apply();
    }
});