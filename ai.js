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
	this.thinking = true;
	var n = this.game.grayHexes.size;
	var list = new List();

	//win if you can, at the same time, build a list of moves and how good they are
	for(var i = 0; i < n; ++i){
	    this.point = this.game.grayHexes.first().p;
	    this.move();
	    list.pushBack({len: this.game.getLongestFromLastPlay(), p: this.point});
	    if(this.game.winner != null){
		this.game.undo();
		this.thinking = false;
		return
	    }
	    this.game.undo();
	}

	//play a forced move if you must
	this.game.nextTurn();
	for(i = 0; i < n; ++i){
	    this.point = this.game.grayHexes.first().p;
	    this.move();
	    if(this.game.winner != null){
		this.game.undo();
		this.game.nextTurn();
		this.thinking = false;
		return;
	    }
	    this.game.undo();
	}
	this.game.nextTurn();

	
	//take the first move you can find where playing it doesn't give next player a win
	var oldPt, end, ptr2;
	var ptr = this.game.grayHexes.head.prev;
	while(ptr != this.game.grayHexes.head){
	    this.point = ptr.data.p;
	    this.move();
	    ptr2 = this.game.grayHexes.head.prev;
	    oldPt = this.point;
	    while(ptr2 != this.game.grayHexes.head){
		this.game.winner = null;
		this.point = ptr2.data.p;
		this.move();
		if(this.game.winner != null){
		    list.remove(ptr.data);
		    this.game.undo();
		    break;
		}
		this.game.undo();
		ptr2 = ptr2.prev;
	    }

	    this.point = oldPt;

	    ptr = ptr.prev;
	    this.game.undo();
	}
	
	//make it play offensively based on some heuristic
	//this belongs elsewhere
	var m = 0;
	ptr = list.head.next;
	while(ptr != list.head){
	    if(ptr.data.len > m){
		m = ptr.data.len;
		this.point = ptr.data.p;
	    }
	    ptr = ptr.next;
	}

	this.thinking = false;
    },

    thinkAndMove: function(){
	this.think();
	this.move();
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