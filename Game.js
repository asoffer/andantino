function Game(p1,p2){
    this.initGraphics();

    this.p1 = p1;
    this.p2 = p2;
    this.p1.game = this;
    this.p2.game = this;

    this.currentPlayer = p1;


    //lists of all built hexes
    this.playedHexes = new List();
    this.unplayedHexes = new List();
    this.grayHexes = new List();

    //for dragging the canvas
    this.mouse = new Point(0,0);
    this.click = new Point(0,0);
    this.trans = new Point(0,0);
    this.isMouseDown = false;
}

Game.prototype = {
    init: function(){
	h1 = new Hex(new Point(0,0));
	h2 = new Hex(new Point(0,1));

	h1.ptrs[5] = h2;
	h2.ptrs[2] = h1;
	this.colorHex(h1,"blue");
	this.colorHex(h2,"red");

    },

    initGraphics: function(){
	this.canvas = document.getElementById("canvas");

	//make it full screen
	this.canvas.width = document.width;
	this.canvas.height = document.height;

	//get the context to draw in
	this.ctx = this.canvas.getContext("2d");

	//put the origin at the center of the screen
	this.ctx.translate(document.width/2,document.height/2);
    },

    draw: function(){
	//clear the screen
	this.ctx.save();
	this.ctx.translate(-this.trans.x, -this.trans.y);
	this.ctx.clearRect(-document.width/2,-document.height/2,document.width,document.height);
	this.ctx.restore();

	//iterate over all visible hexes, and draw them.
	this.playedHexes.iterate(function(h){h.draw(document.getElementById("canvas").getContext("2d"), gSize);});
	this.grayHexes.iterate(function(h){h.draw(document.getElementById("canvas").getContext("2d"), gSize);});
    },

    colorHex: function(h,c){
	h.color = c;
	this.unplayedHexes.remove(h);
	this.playedHexes.pushBack(h);

	h.buildNeighbors(this);
	this.draw();
    },

    redrawMouseHex: function(){
	this.mouseHex = new Hex(this.mouse);

	//cursor color
	if(this.currentPlayer == "blue")
	    this.mouseHex.color = "rgba(100,100,250,0.4)";
	else
	    this.mouseHex.color = "rgba(250,100,100,0.4)";

	this.draw();
	this.mouseHex.draw(this.ctx,gSize);
    },

    undo: function(event){
	//can't go back further than the start of the game
	if(this.playedHexes.size <= 2)
	    return;

	//remove the last play
	var h = this.playedHexes.popBack();

	for(var i = 0; i < 6; ++i){
	    if(h.ptrs[i] != null){
		--h.ptrs[i].touching;
		if(h.ptrs[i].touching == 1 && !h.ptrs[i].p.equals(new Point(0,0)) && !h.ptrs[i].p.equals(new Point(0,1))){
		    h.ptrs[i].color = "white";
		    this.grayHexes.remove(h.ptrs[i]);
		}
	    }

	}

	this.nextTurn();

	this.grayHexes.pushBack(h);
	h.color = "lightgray";
	
	//so you can undo a win
	setBindings(true);
    },

    nextTurn: function(){
	if(this.currentPlayer == "blue")
	    this.currentPlayer = "red";
	else
	    this.currentPlayer = "blue";
    },

    play: function(){
	var hex = null;

	var ptr = this.grayHexes.head.next;

	while(ptr != this.grayHexes.head){

	    if(this.mouse.equals(ptr.data.p))
		hex = ptr.data;
	    ptr = ptr.next;
	}

	if(hex == null)
	    return;


	//remove hex from grayhexes
	this.grayHexes.remove(hex);

	this.colorHex(hex,this.currentPlayer,1);

	if(this.checkWin(hex))
	    this.win();

	this.nextTurn();
    },

    checkWin: function(h){
	//5 in a row win condition
	var counter;
	for(var i = 0; i < 3; ++i){
	    ptr = h;
	    counter = 1;
	    while(ptr.ptrs[i] != null && ptr.ptrs[i].color == this.currentPlayer){
		counter += 1;
		ptr = ptr.ptrs[i];
	    }
	    ptr = h;
	    while(ptr.ptrs[i+3] != null && ptr.ptrs[i+3].color == this.currentPlayer){
		counter += 1;
		ptr = ptr.ptrs[i+3];
	    }

	    if(counter >= 5)
		return true
	}

	//surrounding win condition check
	var ptr, dir, initDir, red;

	for(var i = 0; i < 5; ++i){
	    if(h.ptrs[i] != null && h.ptrs[i].color == this.currentPlayer){
		//alert(h.ptrs);
		ptr = h.ptrs[i];
		red = false;
		initDir = i - 2;
		dir = i - 2;
		//alert("@ "+ptr + " : "+dir);
		while(ptr != h){
		    //alert("# "+ptr + " : "+dir);
		    //alert((((dir % 6) + 6) % 6) + " : " + ptr);
		    while(ptr.ptrs[(((dir % 6) + 6) % 6)] != null && ptr.ptrs[(((dir % 6) + 6) % 6)].color != this.currentPlayer){
			red |= (ptr.ptrs[(((dir % 6) + 6) % 6)].color == "red");
			++dir;
		    }
		    ptr = ptr.ptrs[(((dir % 6) + 6) % 6)];
		    dir -= 2;
		}

		//alert((dir - initDir - 3) + " -- " + red);
		if(dir - initDir - 3 < 0 && red)
		    return true;
	    }
	}

	return false;
    },

    win: function(){
	for(var i=0; i<=100; ++i)
	    this.ctx.fillStyle = "rgba(255,255,255,0.09)";
	this.ctx.fillRect(-document.width/2,-document.height/2,document.width,document.height);
	this.ctx.font = "bold 30px sans-serif";
	this.ctx.textAlign = "center";
	this.ctx.textBaseline = "middle";
	this.ctx.fillStyle = "rgba(100,100,100,0.5)";
	this.ctx.fillRect(-100,-20,200,40);
	this.ctx.fillStyle = "black";
	this.ctx.fillText(this.currentPlayer+" wins!",0,0);

	//setBindings(false);
    }
};

function setBindings(b){
    $("#canvas").unbind('mousedown');
    $("#canvas").unbind('click');
    $("#canvas").unbind('mouseup');
    $("#canvas").unbind('keypress');

    if(!b)
	return;

    //alert("OKAY");
    $("#canvas").mousedown(function(event){
	g.click = new Point(event.offsetX, event.offsetY);
	g.isMouseDown = true;
    });

    $("#canvas").mouseup(function(event){
	g.isMouseDown = false;
    });

    $("#canvas").click(function(event){ g.play(); });

    $(document).keypress(function(event){
	if(event.which == 49)
	    gSize -= 2;
	else if(event.which == 50){
	    gSize += 2;
	    if (gSize <= 6)
		gSize = 6;
	}
	else if(event.which == 32)
	    g.undo();
	else if(event.which == 13)
	    ai.test();

	g.draw();
    });

    $("#canvas").mousemove(function(event){
	var p = new Point(event.offsetX, event.offsetY)
	g.mouse = new Point(Math.round((p.x*2-document.width-2*g.trans.x)/(3*gSize)),0);

	g.mouse.add(new Point(0,Math.round((p.y-document.height/2-g.trans.y)/(1.732*gSize)+g.mouse.x/2)));

	g.redrawMouseHex();

	if(g.isMouseDown){
	    g.ctx.translate(event.offsetX-g.click.x, event.offsetY-g.click.y);
	    g.trans.add(p).sub(g.click);
	    g.click = p;
	    g.draw();
	}
    });


}