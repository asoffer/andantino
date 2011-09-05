function HumanPlayer(c){
    this.game = null;
    this.color = c;
    this.current = null;
}

//HumanPlayer.prototype = new Player();
HumanPlayer.prototype = {
    toString: function(){
	return "[" + this.color + " human]";
    },

    move: function(){
	this.game.play();
    },

    drawMouse: function(){
	this.mouseHex = new Hex(this.mouse);

	//cursor color
	if(this.color == "blue")
	    this.mouseHex.color = "rgba(100,100,250,0.4)";
	else
	    this.mouseHex.color = "rgba(250,100,100,0.4)";

	this.game.draw();
	this.game.mouseHex.draw(this.game.ctx, gSize);

    }
};