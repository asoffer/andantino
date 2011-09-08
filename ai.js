function AI(c){
    this.game = null;
    this.color = c;
    this.point = new Point(0,0);

    this.thinking = false;

}

AI.prototype = {
    toString: function(){
	return "[" + this.color + " computer]";
    },

    move: function(){

	var hex = null;

	var ptr = this.game.grayHexes.head.next;

	while(ptr != this.game.grayHexes.head){
	    if(this.point.equals(ptr.data.p))
		hex = ptr.data;
	    ptr = ptr.next;
	}

	if(hex == null)
	    return;

	this.game.play(hex);

    },

    think: function(){
	this.game.winner = null;
	var end = false;
	this.thinking = true;
	var n = this.game.grayHexes.size;
	var ptr = this.game.grayHexes.head.next;

	for(var i = 0; i < n; ++i){
	    this.point = this.game.grayHexes.first().p;
	    this.move();
	    if(this.game.winner != null){
		end = true;
		this.game.undo();
		break;
	    }
	    this.game.undo();
	}
	if(end){
	    this.thinking = false;
	    return;
	}

	this.game.nextTurn();
	for(i = 0; i < n; ++i){
	    this.point = this.game.grayHexes.first().p;
	    this.move();
	    if(this.game.winner != null){
		end = true;
		this.game.undo();
		break;
	    }
	    this.game.undo();
	}
	//alert(this.game.currentPlayer.color);
	this.game.nextTurn();

	if(end){
	    this.thinking = false;
	    return;
	}
	
	this.thinking = false;
    },

    drawMouse: function(){
	mouseHex = new Hex(this.point);

	//cursor color
	if(this.color == "blue")
	    mouseHex.color = "rgba(100,100,250,0.4)";
	else
	    mouseHex.color = "rgba(250,100,100,0.4)";

	this.game.draw();
	mouseHex.draw(this.game.ctx, g_size);

    },

};