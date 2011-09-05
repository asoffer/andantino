function Menu(){
    this.items = new List();
    this.ctx = document.getElementById("canvas").getContext("2d");
}

Menu.prototype = {
    add: function(s, f){
	this.items.pushBack({text: s, fn: f});
    },

    draw: function(){
	this.ctx.save();
	this.ctx.fillStyle = "lightgray";
	this.ctx.lineWidth = 2;
	this.ctx.fillRect(-100,-this.items.size * 20,200,this.items.size*40);
	this.ctx.strokeRect(-100,-this.items.size * 20,200,this.items.size*40);

	this.ctx.fillStyle = "black";
	this.ctx.font = "bold 30px sans-serif";
	this.ctx.textAlign = "center";
	this.ctx.textBaseline = "middle";
	var p = this.items.head.next;
	var k = 0;
	while(p != this.items.head){
	    ++k
	    this.ctx.fillText(p.data.text,0,k*40-this.items.size*20-20);
	    p = p.next;
	}

	this.ctx.restore();
    },

    show: function(){
    },

    hide: function(){
    }
};