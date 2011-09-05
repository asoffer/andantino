function Player(c){
    this.color = c;
}

Player.prototype = {
    toString: function(){
	return "[" + this.color + "player]";
    }
}