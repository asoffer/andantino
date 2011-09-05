function Game(){
    this.currentPlayer = "blue";

    this.canvas = document.getElementById("canvas");

    //make it full screen
    this.canvas.width = document.width;
    this.canvas.height = document.height;

    //get the context to draw in
    this.ctx = this.canvas.getContext("2d");

    //put the origin at the center of the screen
    this.ctx.translate(document.width/2,document.height/2);

    //lists of all built hexes
    this.hexes = new List();
    this.unplayedHexes = new List();
    this.grayHexes = new List();

    //for dragging the canvas
    this.mouse = new Point(0,0);
    this.click = new Point(0,0);
    this.trans = new Point(0,0);
//    this.clickX = 0;
//    this.clickY = 0;
//    this.translateX = 0;
//    this.translateY = 0;
    this.isMouseDown = false;
}

Game.prototype = {
    init: function(){
	h1 = new Hex(new Point(0,0));
	this.hexes.pushBack(h1);
	h2 = new Hex(new Point(0,1));
	this.hexes.pushBack(h2);

	h1.ptrs[5] = h2;
	h2.ptrs[2] = h1;
	this.colorHex(h1,"blue");
	this.colorHex(h2,"red");
    },

    draw: function(){
	this.ctx.save();
	this.ctx.translate(-this.trans.x, -this.trans.y);
	this.ctx.clearRect(-document.width/2,-document.height/2,document.width,document.height);
	this.ctx.restore();

	this.hexes.iterate(function(h){h.draw(document.getElementById("canvas").getContext("2d"), gSize);});
    },

    colorHex: function(h,c,b){
	h.color = c;
	this.unplayedHexes.remove(h);

	h.buildNeighbors(this,b);
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

    mouseDown: function(event){
    },


    clicked: function(){
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

	if(this.currentPlayer == "red")
	    this.currentPlayer = "blue";
	else
	    this.currentPlayer = "red";
    },

    checkWin: function(h){
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
	$("#canvas").unbind();
    }
};