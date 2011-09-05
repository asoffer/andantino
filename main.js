//hex size
var gSize = 20;

//mouse data
var isMouseDown = false;

//game (singleton)
var g;

//global players
var p1 = new HumanPlayer("blue");
var p2 = new AI("red");

$(document).ready(function(){
    g = new Game(p1,p2);
    g.init();
    g.draw();


    $("#canvas").mousemove(function(event){
	var pl = g.currentPlayer;
	var p = new Point(event.offsetX, event.offsetY)

	//location of mouse on the grid.
	pl.point = new Point(Math.round((p.x*2-document.width-2*g.trans.x)/(3*gSize)),0);
	pl.point.add(new Point(0,Math.round((p.y-document.height/2-g.trans.y)/(1.732*gSize)+pl.point.x/2)));

	pl.drawMouse();

	if(isMouseDown){
	    g.ctx.translate(event.offsetX-g.click.x, event.offsetY-g.click.y);
	    g.trans.add(p).sub(g.click);
	    g.click = p;
	    g.draw();
	}
    });

    $("#canvas").mousedown(function(event){
	g.click = new Point(event.offsetX, event.offsetY);
	isMouseDown = true;
    });

    $("#canvas").mouseup(function(event){
	isMouseDown = false;
    });

    $("#canvas").click(function(event){ g.currentPlayer.move(); });


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
	    p2.test();

	g.draw();
    });


});
