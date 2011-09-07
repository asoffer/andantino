function AI(c){
    this.game = null;
    this.color = c;
    this.point = new Point(0,0);

    this.gameCopy = {};

    this.recursionDepth = 3;
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

    gameValue: function(d){
	if(this.game.winner != null)
	    return {p: this.game.grayHexes.first().p, v: -1000};

	//the above line is totally wrong


	if(d == 0)
	    return {p: this.game.grayHexes.first().p, v: 0};

	var n = this.game.grayHexes.size;
	var list = new List();

	for(var i =0; i< n; ++i){
	    this.point = this.game.grayHexes.first().p;
	    this.move(true);
	    list.pushBack(this.gameValue(d-1));
	    this.game.undo();
	}

	var m = 2000;
	var best;
	var ptr = list.head.next;
	while(ptr != list.head){
	    if(m >= ptr.data.v){
		m = ptr.data.v;
		best = ptr.data.p;
	    }
	    ptr = ptr.next;
	}

	return {p: best, v: -m};
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