function Point(x,y){
    this.x = x;
    this.y = y;
}

Point.prototype = {
    toString: function(){
	return "(" + this.x + ", " + this.y + ")";
    },

    add: function(p){
	this.x += p.x;
	this.y += p.y;
	return this;
    },

    sub: function(p){
	this.x -= p.x;
	this.y -= p.y;
	return this;
    },

    equals: function(p){
	return this.x == p.x && this.y == p.y;
    }
};
