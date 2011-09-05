function AI(g){
    this.game = g;
}

AI.prototype = {
    test: function(){
	var list = new List();
	var ptr = this.game.grayHexes.head.next;

	while(ptr != this.game.grayHexes.head){
	    list.pushBack(ptr.data);
	    ptr = ptr.next;
	}

	ptr = list.head.next;

	alert(list.size);

	while(ptr != list.head){
	    this.game.mouse = ptr.data.p;
	    this.game.play();

//	    if(this.game.checkWin(ptr.data))
//		alert("WIN");
//	    else
	    alert("");

	    this.game.undo();
	    //setBindings(true);
	    ptr = ptr.next;
	}
    }
};