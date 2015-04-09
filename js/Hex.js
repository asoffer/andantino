(function(A){
    var neighborPositions = function(x, y){
        return [
            {x: (x) , y:  + (y + 1)},
            {x: (x + 1) , y:  + (y)},
            {x: (x + 1) , y:  + (y - 1)},
            {x: (x) , y:  + (y - 1)},
            {x: (x - 1) , y:  + (y)},
            {x: (x - 1) , y:  + (y + 1)}
        ];
    };

    var neighbors = function(x, y){
        var nbrs = [];
        neighborPositions(x, y).forEach(function(el){
            nbrs.push(A.theGame.hexes['' + el.x + ',' + el.y]);
        });
        return nbrs;

    };

    var hexColors = ['#aaa', '#833', '#338', '#338'];

    //to make direction iteration easier
    var dirList = [-1, -1, 0, 1, 1, 0];

    A.Hex = function(pt, colorNum){
        this.pt = pt; //hexagonal coordinates
        this.draw(A.theGame);

        this.setColor(colorNum);

        this.registerHex();
    };

    A.Hex.prototype = {
        registerHex: function(){
            A.theGame.hexes['' + this.pt.x + ',' + this.pt.y] = this;
        },

        draw: function(game){
            var hex = this;

            var s = 30;
            var pt = {
                x: A.theGame.totalTranslate.x + 1.5 * (s + 5) * this.pt.x,
                y: A.theGame.totalTranslate.y + 1.732 * (s + 5) * this.pt.y + 0.866 * (s + 5) * this.pt.x
            };

            this.visual = game.paper.path('M' + (pt.x + s) + ',' + pt.y + 
                                          'L' + (pt.x + s/2) + ', ' + (pt.y + s * 0.866) + 
                                          'L' + (pt.x - s/2) + ', ' + (pt.y + s * 0.866) +
                                          'L' + (pt.x - s) + ', ' + pt.y +
                                          'L' + (pt.x - s/2) + ', ' + (pt.y - s * 0.866) +
                                          'L' + (pt.x + s/2) + ', ' + (pt.y - s * 0.866) + 'Z')
            .attr({fill: this.color, stroke: 'black', 'stroke-width': 3, 'stroke-linejoin': 'round' })
            .click(function(){ return hex.click(); })
            .hover(function(){ hex.glow = this.glow({color: hex.color}); },
                   function(){ hex.glow.remove(); delete hex.glow; });
        },

        setColor: function(num){
            this.color = hexColors[num];
            this.visual.attr({fill: this.color});
        },

        checkWin: function(){
            return this.linearWin() || this.surroundingWin();
        },

        surroundingWin: function(){
            //FIXME
            return false;
        },

        linearWin: function(){
            return this.checkLine(0, 1) || this.checkLine(1, 0) || this.checkLine(1, -1);
        },

        checkLine: function(dx, dy){
                var x = this.pt.x;
                var y = this.pt.y;

                var counter = -1;
                do{
                    ++counter;
                    x += dx;
                    y += dy;
                    if(counter >= 5) return true;
                } while(typeof(A.theGame.hexes['' + x + ',' + y]) !== 'undefined' && this.color === A.theGame.hexes['' + x + ',' + y].color);

                x = this.pt.x;
                y = this.pt.y;
                do{
                    ++counter;
                    x -= dx;
                    y -= dy;
                    if(counter >= 5) return true;
                } while(typeof(A.theGame.hexes['' + x + ',' + y]) !== 'undefined' && this.color === A.theGame.hexes['' + x + ',' + y].color);

                return counter >= 5;
        },

        click: function(){
            if(this.color !== hexColors[0])
                return;

            this.setColor(++A.theGame.playerTurn);
            console.log(this.checkWin());
            A.theGame.playerTurn %= 2;
            //set color to be something

            var nbrPos = neighborPositions(this.pt.x, this.pt.y);

            var newHexLocs = [];
            nbrPos.forEach(function(el){
                var nbrs = neighbors(el.x, el.y);
                var nbrCounter = 0;
                for(var i = 0; i < 6; ++i){
                    if(typeof(nbrs[i]) !== 'undefined' && nbrs[i].color !== hexColors[0]){
                        ++nbrCounter;
                    }
                }

                var elStr = '' + el.x + ',' + el.y;
                if(nbrCounter === 2 && typeof(A.theGame.hexes[elStr]) === 'undefined'){
                    newHexLocs.push(el);
                }
            });

            newHexLocs.forEach(function(el){
                new A.Hex(el, 0);
            });
        }
    };
})(window.Andantino = window.Andantino || {});
/*

    function Hex(p){
        //the hexagonal coordinate of the hex
        this.p = p;

        //the color hex: white for 1, gray for more than one, red and blue for colored
        this.color = "white";

        //counts the number of hexes it touches
        this.touching = 0;

        //pointers to the neighbors
        this.ptrs= new Array(null, null, null, null, null, null);
    }

    Hex.prototype = {
        //to make iteration easier
        dirList: new Array(-1, -1, 0, 1, 1, 0),

        toString: function(){
            return "[" + this.color + " hex at " + this.p + "]";
        },

        buildNeighbors: function(gm){
            for(var i = 0; i<6; ++i){

                var newPt, ptr, goodBreak, h;
                if(this.ptrs[i] == null){
                    newPt = new Point(this.p.x + Hex.prototype.dirList[i],
                                      this.p.y + Hex.prototype.dirList[(i+5)%6])

                    ptr = gm.unplayedHexes.head.next;
                    goodBreak = false;

                    //iterate over unplayed hexes to check if its already been created.
                    while(ptr != gm.unplayedHexes.head){
                        if(ptr.data.p.equals(newPt)){
                            goodBreak = true;
                            break;
                        }
                        ptr = ptr.next;
                    }

                    //if it has been been created, use it. otherwise, make a new one.
                    if(goodBreak)
                        h = ptr.data;
                    else{
                        h = new Hex(newPt);
                        gm.unplayedHexes.pushBack(h);
                    }

                    //set up the pointers properly
                    if(this.ptrs[(i+5)%6] != null){
                        this.ptrs[(i+5)%6].ptrs[(i+1)%6] = h;
                        h.ptrs[(i+4)%6] = this.ptrs[(i+5)%6];
                    }
                    if(this.ptrs[(i+1)%6] != null){
                        this.ptrs[(i+1)%6].ptrs[(i+5)%6] = h;
                        h.ptrs[(i+2)%6] = this.ptrs[(i+1)%6];
                    }

                    this.ptrs[i] = h;
                    h.ptrs[(i+3)%6] = this;
                }

                //show the ones you can click on
                this.ptrs[i].touching++;

                if(this.ptrs[i].touching == 2 && !this.ptrs[i].p.equals(new Point(0,0)) && !this.ptrs[i].p.equals(new Point(0,1))){
                    this.ptrs[i].color = "lightgray";
                    this.ptrs[i].draw(gm.ctx,20);

                    gm.grayHexes.pushBack(this.ptrs[i]);
                }
            }
        },

        draw: function(ctx,s){
            if(this.color == "white")
                return;
            ctx.save();
            ctx.translate(1.5*this.p.x*s,(this.p.y*1.732-0.866*this.p.x)*s);
            ctx.beginPath();
            ctx.moveTo(-0.5*s,-0.866*s);
            ctx.lineTo(0.5*s,-0.866*s);
            ctx.lineTo(s,0);
            ctx.lineTo(0.5*s,0.866*s);
            ctx.lineTo(-0.5*s,0.866*s);
            ctx.lineTo(-s,0);
            ctx.closePath();
            ctx.stroke();
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        },

        equals: function(h){
            return this.p.x == h.p.x && this.p.y == h.p.y;
        }
    };*/
