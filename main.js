//hex size
var g_size = 20;

//game (singleton)
var g_game;

//global players
var g_p1, g_p2;

//clicking, dragging, and such
var g_click = new Point(0,0);
var g_trans = new Point(0,0);
var g_isMouseDown = false;

$(document).ready(function(){
    $("#cc").button({disabled: true})
    $("#howto").hide();
    $("#first").hide();
    $("button").button().css("width", 250);
    $("#menu").dialog({
	title: "Andantino",
	closeOnEscape: false,
	draggable: false,
	resizable: false,
	open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); }
    }).css("text-align", "center");

    $("#hh").click(function(event){
	$("#menu").dialog("close");

	g_p1 = new HumanPlayer("blue");
	g_p2 = new HumanPlayer("red");

	g_game = new Game(g_p1,g_p2);
	g_game.init();
	g_game.draw();
	g_game.start();
    });

    $("#cc").click(function(event){
	$("#menu").dialog("close");

	g_p1 = new AI("blue");
	g_p2 = new AI("red");

	g_game = new Game(g_p1,g_p2);
	g_game.init();
	g_game.draw();
	g_game.start();
    });


    $("#hc").click(function(event){
	$("#menu").dialog("close");

	g_p1 = new HumanPlayer("blue");
	g_p2 = new HumanPlayer("red");

	$("#first").dialog({
	    title: "Who plays first?",
	    width: 290,
	    closeOnEscape: false,
	    open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); },
	    draggable: false,
	    resizable: false
	}).css("text-align", "center");
	$("#first").show();
    });

    $("#hFirst").click(function(event){
	$("#first").dialog("close");
	g_p1 = new HumanPlayer("blue");
	g_p2 = new AI("red");
	g_game = new Game(g_p1,g_p2);
	g_game.init();
	g_game.draw();
	g_game.start();
    });

    $("#cFirst").click(function(event){
	$("#first").dialog("close");
	g_p1 = new AI("blue");
	g_p2 = new HumanPlayer("red");
	g_game = new Game(g_p1,g_p2);
	g_game.init();
	g_game.draw();
	g_game.start();
	setTimeout("g_p1.thinkAndMove()",100);
    });

    $("#rules").click(function(event){
	$("#howto").dialog({
	    title: "How to play Andantino",
	    width: 600,
	    closeOnEscape: false,
	    draggable: false,
	    resizable: false,
	    open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); }
	});
	$("#menu").dialog("close");
	$("#howto").show();
    });

    $(".backToMenu").click(function(){
	$("#howto").dialog("close");
	$("#menu").dialog("open");
    });

});

function g_zout(){
    g_size -=2;
    if(g_size <= 6)
	g_size = 6;
    g_game.draw();

}

function g_zin(){
    g_size +=2;
    if(g_size >= 40)
	g_size = 40;
    g_game.draw();

}

function g_mouseDown(event){
    g_click = new Point(event.offsetX, event.offsetY);
    g_isMouseDown = true;
}

function g_mouseUp(event){
    g_isMouseDown = false;
}

function g_keyPress(event){
    if(event.which == 49)
	g_zin();
    else if(event.which == 50)
	g_zout();
    else if(event.which == 117)
	g_game.undo();

}

function g_mouseMove(event){
    var pl = g_game.currentPlayer;
    var p = new Point(event.offsetX, event.offsetY)

    //location of mouse on the grid.
    pl.point = new Point(Math.round((p.x*2-document.width-2*g_trans.x)/(3*g_size)),0);
    pl.point.add(new Point(0,Math.round((p.y-document.height/2-g_trans.y)/(1.732*g_size)+pl.point.x/2)));

    pl.drawMouse();

    if(g_isMouseDown){
	g_game.ctx.translate(event.offsetX-g_click.x, event.offsetY-g_click.y);
	g_trans.add(p).sub(g_click);
	g_click = p;
	g_game.draw();
    }
}