function Hex(p){
    //the hexagonal coordinate of the hex
    this.p = p;

    //the color hex: white for 1, gray for more than one, red and blue for colored
    this.color = "white";

    //counts the number of hexes it touches
    this.touching = 0;

    //pointers to the neighbors
    this.ptrs= new Array(null, null, null, null, null, null);
}

Hex.prototype = {
    //to make iteration easier
    dirList: new Array(-1, -1, 0, 1, 1, 0),

    toString: function(){
	return "[" + this.color + " hex at " + this.p + "]";
    },

    buildNeighbors: function(gm){
	for(var i = 0; i<6; ++i){
	    
	    var newPt, ptr, goodBreak, h;
	    if(this.ptrs[i] == null){
		newPt = new Point(this.p.x + Hex.prototype.dirList[i],
				  this.p.y + Hex.prototype.dirList[(i+5)%6])

		ptr = gm.unplayedHexes.head.next;
		goodBreak = false;

		//iterate over unplayed hexes to check if its already been created.
		while(ptr != gm.unplayedHexes.head){
		    if(ptr.data.p.equals(newPt)){
			goodBreak = true;
			break;
		    }
		    ptr = ptr.next;
		}

		//if it has been been created, use it. otherwise, make a new one.
		if(goodBreak)
		    h = ptr.data;
		else{
		    h = new Hex(newPt);
		    gm.unplayedHexes.pushBack(h);
		}

		//set up the pointers properly
		if(this.ptrs[(i+5)%6] != null){
		    this.ptrs[(i+5)%6].ptrs[(i+1)%6] = h;
		    h.ptrs[(i+4)%6] = this.ptrs[(i+5)%6];
		}
		if(this.ptrs[(i+1)%6] != null){
		    this.ptrs[(i+1)%6].ptrs[(i+5)%6] = h;
		    h.ptrs[(i+2)%6] = this.ptrs[(i+1)%6];
		}

		this.ptrs[i] = h;
		h.ptrs[(i+3)%6] = this;
	    }

	    //show the ones you can click on
	    this.ptrs[i].touching++;

	    if(this.ptrs[i].touching == 2 && !this.ptrs[i].p.equals(new Point(0,0)) && !this.ptrs[i].p.equals(new Point(0,1))){
		this.ptrs[i].color = "lightgray";
		this.ptrs[i].draw(gm.ctx,20);

		gm.grayHexes.pushBack(this.ptrs[i]);
	    }
	}
    },

    draw: function(ctx,s){
	if(this.color == "white")
	    return;
	ctx.save();
	ctx.translate(1.5*this.p.x*s,(this.p.y*1.732-0.866*this.p.x)*s);
	ctx.beginPath();
	ctx.moveTo(-0.5*s,-0.866*s);
	ctx.lineTo(0.5*s,-0.866*s);
	ctx.lineTo(s,0);
	ctx.lineTo(0.5*s,0.866*s);
	ctx.lineTo(-0.5*s,0.866*s);
	ctx.lineTo(-s,0);
	ctx.closePath();
	ctx.stroke();
	ctx.fillStyle = this.color;
	ctx.fill();
	ctx.restore();
    },

    equals: function(h){
	return this.p.x == h.p.x && this.p.y == h.p.y;
    }
};
