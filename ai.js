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
	//this.gameValue(1,this.game);

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
	alert("");
	if(this.game.winner != null)
	    return -1000;

	if(d == 0)
	    return 0;

	var n = this.game.grayHexes.size;
	var list = new List();

	for(var i =0; i< n; ++i){
	    this.point = this.game.grayHexes.first().p;
	    this.move();
	    list.pushBack(this.gameValue(d-1));
	    this.game.undo();
	}

	var m = 1000;
	var ptr = list.head.next;
	while(ptr != list.head){
	    m = Math.min(m, ptr.data)
	    ptr = ptr.next;
	}
	
	return -m
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