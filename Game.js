function Game(){
    this.canvas = document.getElementById("canvas");

    //make it full screen
    this.canvas.width = document.width;
    this.canvas.height = document.height;

    //get the context to draw in
    this.ctx = this.canvas.getContext("2d");


    this.hexes = new List();
    this.h1 = new Hex(0,0);
    this.h2 = new Hex(0,1);
    this.h3 = new Hex(1,1);
}

Game.prototype.extend({
    init: function(){
	//this.h1 = Hex(0,0);
	this.h1.color = "blue";
	this.hexes.pushBack(this.h1);

	//this.h2 = Hex(0,1);
	this.h2.color = "red";
	this.hexes.pushBack(this.h2);


	this.h3.color = "gray";
	this.hexes.pushBack(this.h3);
    },

    draw: function(){
	this.h1.draw(this.ctx,20);
	this.h2.draw(this.ctx,20);
	this.h3.draw(this.ctx,20);
    }
});