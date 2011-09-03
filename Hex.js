function Hex(x,y){
    this.x = x;
    this.y = y;
    this.color = "gray";

    this.ptrU=null;
    this.ptrD=null;
    this.ptrUL=null;
    this.ptrDL=null;
    this.ptrUR=null;
    this.ptrDR=null;
}

Hex.prototype.extend({
    toString: function(){
	return "[" + this.color + " hex at (" + this.x + "," + this.y + ")]";
    },

    buildNeighbors: function(gm){
	if(this.ptrU != null && this.ptrUL == null){
	    var h = new Hex(this.x-1,this.y-1);
	    h.ptrUR = this.ptrU;
	    h.ptrDR = this;
	    this.ptrU.ptrDL = h;
	    this.ptrUL = h;

	    gm.hexes.pushBack(h);
	}

	if(this.ptrU != null && this.ptrUR == null){
	    var h = new Hex(this.x+1,this.y);
	    h.ptrUL = this.ptrU;
	    h.ptrDL = this;
	    this.ptrU.ptrDR = h;
	    this.ptrUR = h;

	    gm.hexes.pushBack(h);
	}

	if(this.ptrD != null && this.ptrDL == null){
	    var h = new Hex(this.x-1,this.y);
	    h.ptrUR = this;
	    h.ptrDR = this.ptrD;
	    this.ptrD.ptrUL = h;
	    this.ptrDL = h;

	    gm.hexes.pushBack(h);
	}

	if(this.ptrD != null && this.ptrDR == null){
	    var h = new Hex(this.x+1,this.y+1);
	    h.ptrUL = this;
	    h.ptrDL = this.ptrD;
	    this.ptrD.ptrUR = h;
	    this.ptrDR = h;

	    gm.hexes.pushBack(h);
	}

	// repeat for all possibilities
    },

    draw: function(ctx,s){
	ctx.save();
	ctx.fillStyle = this.color;
	ctx.translate(100+1.5*this.x*s,(this.y*1.732-0.866*this.x)*s+100);
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(s,0);
	ctx.lineTo(s*1.5,s*0.866);
	ctx.lineTo(s,s*1.732);
	ctx.lineTo(0,s*1.732);
	ctx.lineTo(-s/2,s*0.866);
	ctx.closePath();
	ctx.fill();
	ctx.restore();
    }

    
});