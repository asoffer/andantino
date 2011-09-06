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
	$.extend(true, this.gameCopy, this.game);
	this.gameValue(1);

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
	if(this.gameCopy.winner != null)
	    return -1000;

	if(d == 0)
	    return 0;

	var vals = new List();
	var ptr = this.gameCopy.grayHexes.head.next;
	//look at all possible moves
	while(ptr != this.gameCopy.grayHexes.head){
	    this.point = ptr.data.p;
	    this.makeMove(this.gameCopy);
	    vals.pushBack(this.gameValue(d-1));
	    ptr = ptr.next;
	    alert(vals);
	}
    },

    makeMove: function(g){
	var hex = null;

	var ptr = g.grayHexes.head.next;

	while(ptr != g.grayHexes.head){
	    if(this.point.equals(ptr.data.p))
		hex = ptr.data;
	    ptr = ptr.next;
	}

	if(hex == null)
	    return;

	g.play(hex);
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

/*    test: function(){
	var list = new List();
	var ptr = this.game.grayHexes.head.next;

	while(ptr != this.game.grayHexes.head){
	    list.pushBack(ptr.data);
	    ptr = ptr.next;
	}

	ptr = list.head.next;


	while(ptr != list.head){
	    this.point = ptr.data.p;
	    var h = this.move();

	    if(this.game.checkWin(h))
		alert("???");

	    alert("");

	    this.game.undo();

	    ptr = ptr.next;
	}
    }
*/
};