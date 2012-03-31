function Game(p1,p2){
    this.initGraphics();

    this.p1 = p1;
    this.p2 = p2;
    this.p1.game = this;
    this.p2.game = this;
    this.winner = null;

    this.currentPlayer = p1;
    this.otherPlayer = p2;


    //lists of all built hexes
    this.playedHexes = new List();
    this.unplayedHexes = new List();
    this.grayHexes = new List();

    //for dragging the canvas
    this.mouse = new Point(0,0);
}

Game.prototype = {
    init: function(){
        h1 = new Hex(new Point(0,0));
        h2 = new Hex(new Point(0,1));

        h1.ptrs[5] = h2;
        h2.ptrs[2] = h1;
        this.colorHex(h1,"blue");
        this.colorHex(h2,"red");

    },

    initGraphics: function(){
        this.canvas = document.getElementById("canvas");

        //make it full screen
        this.canvas.width = $(document).width();
        this.canvas.height = $(document).height();

        //get the context to draw in
        this.ctx = this.canvas.getContext("2d");

        //put the origin at the center of the screen
        this.ctx.translate($(document).width()/2,$(document).height()/2);
    },

    start: function(){
        $("#canvas").mousedown(g_mouseDown);
        $("#canvas").mouseup(g_mouseUp);
        $("#canvas").click(function(event){g_game.currentPlayer.move();});
        $("#canvas").mousemove(g_mouseMove);
        $(document).keypress(g_keyPress);

        $("#zin").click(g_zin);
        $("#zout").click(g_zout);
        $("#undo").click(function(event){ g_game.undo(); g_game.draw() });

    },

    stop: function(){
        $("#canvas").unbind();
        $(document).unbind();
        $("#zin").unbind();
        $("#zout").unbind();
        $("#undo").unbind();
    },

    draw: function(){
        //clear the screen
        this.ctx.save();
        this.ctx.translate(-g_trans.x, -g_trans.y);
        this.ctx.clearRect(-$(document).width()/2, -$(document).height()/2,
                $(document).width(), $(document).height());
        this.ctx.restore();

        //iterate over all visible hexes, and draw them.
        this.playedHexes.iterate(function(h){h.draw(document.getElementById("canvas").getContext("2d"), g_size);});
        this.grayHexes.iterate(function(h){h.draw(document.getElementById("canvas").getContext("2d"), g_size);});

        //point out the last play
        this.ctx.save();
        var p = this.playedHexes.last().p;
        this.ctx.translate(1.5*p.x*g_size,(p.y*1.732-0.866*p.x)*g_size);
        this.ctx.beginPath();
        this.ctx.arc(0,0,g_size/3,0,Math.PI*2, true);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    },

    colorHex: function(h,c){
        h.color = c;
        this.unplayedHexes.remove(h);
        this.playedHexes.pushBack(h);

        h.buildNeighbors(this);
        this.draw();
    },

    undo: function(event){
        //can't go back further than the start of the game
        if(this.playedHexes.size <= 2)
            return;

        //remove the last play
        var h = this.playedHexes.popBack();

        for(var i = 0; i < 6; ++i){
            if(h.ptrs[i] != null){
                --h.ptrs[i].touching;
                if(h.ptrs[i].touching == 1 && !h.ptrs[i].p.equals(new Point(0,0)) && !h.ptrs[i].p.equals(new Point(0,1))){
                    h.ptrs[i].color = "white";
                    this.grayHexes.remove(h.ptrs[i]);
                }
            }

        }

        //send the turn back one. mod two, just go forward
        this.nextTurn();

        this.grayHexes.pushBack(h);
        h.color = "lightgray";

        //so you can undo a win
        this.winner == null;
    },

    setTurn: function(p){
        if(this.otherPlayer == p){
            this.otherPlayer = this.currentPlayer;
            this.currentPlayer = p;
        }
    },

    nextTurn: function(){
        this.setTurn(this.otherPlayer);

        if(this.currentPlayer instanceof AI && !this.currentPlayer.thinking){
            if(this.currentPlayer.color == g_p1.color)
                setTimeout("g_p1.thinkAndMove()",100);
            else
                setTimeout("g_p2.thinkAndMove()",100);
        }

    },

    play: function(hex){
        //remove hex from grayhexes
        this.grayHexes.remove(hex);

        //update the board
        this.colorHex(hex,this.currentPlayer.color);

        //check for a win
        if(this.checkWin(hex)){
            this.winner = this.currentPlayer;
            if(!this.currentPlayer.thinking && !this.otherPlayer.thinking)
                this.win();
            else
                this.nextTurn();
        }
        else
            //set next turn
            this.nextTurn();
    },

    getLongestFromLastPlay: function(){
        var m = 0;
        var counter = 0;
        var ptr;
        for(var i = 0; i < 3; ++i){
            ptr = this.playedHexes.last();
            counter = 1;
            while(ptr.ptrs[i] != null && ptr.ptrs[i].color == this.otherPlayer.color){
                counter += 1;
                ptr = ptr.ptrs[i];
            }
            ptr = this.playedHexes.last();;
            while(ptr.ptrs[i+3] != null && ptr.ptrs[i+3].color == this.otherPlayer.color){
                counter += 1;
                ptr = ptr.ptrs[i+3];
            }

            m = Math.max(m,counter);
        }
        return m;
    },

    checkWin: function(h){
        //5 in a row win condition
        var counter;
        var ptr;
        for(var i = 0; i < 3; ++i){
            ptr = h;
            counter = 1;
            while(ptr.ptrs[i] != null && ptr.ptrs[i].color == this.currentPlayer.color){
                counter += 1;
                ptr = ptr.ptrs[i];
            }
            ptr = h;
            while(ptr.ptrs[i+3] != null && ptr.ptrs[i+3].color == this.currentPlayer.color){
                counter += 1;
                ptr = ptr.ptrs[i+3];
            }

            if(counter >= 5)
                return true;
        }

        //surrounding win condition check
        var ptr, dir, initDir, found;

        for(var i = 0; i < 5; ++i){
            if(h.ptrs[i] != null && h.ptrs[i].color == this.currentPlayer.color){
                ptr = h.ptrs[i];
                found = false;
                initDir = i - 2;
                dir = i - 2;
                while(ptr != h){
                    while(ptr.ptrs[(((dir % 6) + 6) % 6)] != null && ptr.ptrs[(((dir % 6) + 6) % 6)].color != this.currentPlayer.color){
                        found |= (ptr.ptrs[(((dir % 6) + 6) % 6)].color == this.otherPlayer.color);
                        ++dir;
                    }
                    ptr = ptr.ptrs[(((dir % 6) + 6) % 6)];
                    dir -= 2;
                }

                if(dir - initDir - 3 < 0 && found)
                    return true;
            }
        }

        //surrounding win condition check
        var ptr, dir, initDir, sur;
        var surColor = "red";
        if(this.currentPlayer.color == "red")
            surColor = "blue";

        for(var i = 0; i < 5; ++i){
            if(h.ptrs[i] != null && h.ptrs[i].color == this.currentPlayer){
                ptr = h.ptrs[i];
                sur = false;
                initDir = i - 2;
                dir = i - 2;
                while(ptr != h){
                    while(ptr.ptrs[(((dir % 6) + 6) % 6)] != null && ptr.ptrs[(((dir % 6) + 6) % 6)].color != this.currentPlayer){
                        sur |= (ptr.ptrs[(((dir % 6) + 6) % 6)].color == surColor);
                        ++dir;
                    }
                    ptr = ptr.ptrs[(((dir % 6) + 6) % 6)];
                    dir -= 2;
                }

                if(dir - initDir - 3 < 0 && sur)
                    return true;
            }
        }

        return false;
    },

    win: function(){
        this.stop();
        $("#win").dialog({
            title: this.currentPlayer.color.charAt(0).toUpperCase() + this.currentPlayer.color.slice(1) + " wins!",
            resizable: false,
            width: 350,
            height: 80,
            close: function(){$("#menu").dialog("open"); }
        }).text("Hit escape to go to the main menu.");
    }
};
