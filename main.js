//hex size
var gSize = 20;

//game (singleton)
var g;

//global ai
var p1 = new HumanPlayer("blue");
var p2 = new HumanPlayer("red");

$(document).ready(function(){
    g = new Game(p1,p2);
    g.init();
    g.draw();

    ai = new AI(g);

    //initialize reading mouse position


    setBindings(true);


});
