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
	return "[" + this.color + " hex at (" + this.x + "," + this.y + "]";
    },

    buildNeighbors: function(){
	if(this.ptrU != null && this.ptrUL == null){
	    var h = new Hex(0,0);
	    h.ptrUR = this.ptrU;
	    h.ptrDR = this;
	    this.ptrU.ptrDL = h;
	    this.ptrUL = h;
	}
	// repeat for all possibilities
    },

    draw: function(ctx,s){
	ctx.save();
	ctx.fillStyle = this.color;
	ctx.translate(1.5*this.x*s,(this.y*1.732-0.866*this.x)*s);
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