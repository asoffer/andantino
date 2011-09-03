function Game(){
    this.canvas = document.getElementById("canvas");

    //make it full screen
    this.canvas.width = document.width;
    this.canvas.height = document.height;

    //get the context to draw in
    this.ctx = this.canvas.getContext("2d");


    this.hexes = new List();
}

Game.prototype.extend({
    init: function(){
	h1 = new Hex(0,0);
	h1.color = "blue";
	this.hexes.pushBack(h1);

	h2 = new Hex(0,1);
	h2.color = "red";
	this.hexes.pushBack(h2);

	h3 = new Hex(1,1);
	h3.color = "gray";
	this.hexes.pushBack(h3);
    },

    draw: function(){
	var iter = new ListIterator(this.hexes,function(h){h.draw(document.getElementById("canvas").getContext("2d"),20);});
	iter.apply();
//	this.h1.draw(this.ctx,20);
//	this.h2.draw(this.ctx,20);
//	this.h3.draw(this.ctx,20);
    }
});