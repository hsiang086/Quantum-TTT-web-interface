class Game{
    // Global Variables
    #graph = new Graph(); // for checking cycle
    #log = new GameLog(); // for print and log game status
    #turn;                // current sign
    #round;               // round count
    #choice;              // save player choices
    #isMeasurement;       // true if measurement occurs
    #isNotCollapse;       // record the collapse status of each block
    #isCorrelated;        // true if the block is collapsing
    #TicTacToe;           // classical tic tac toe

    // HTML elements
    #Cells;
    #OBtn   = document.getElementById("OBtn");
    #XBtn   = document.getElementById("XBtn");
    #OLabel = document.getElementById("OLabel");
    #XLabel = document.getElementById("XLabel");
    #RoundLabel = document.getElementById("RoundLabel");
    #Block = [
        document.getElementById("block_0"),
        document.getElementById("block_1"),
        document.getElementById("block_2"),
        document.getElementById("block_3"),
        document.getElementById("block_4"),
        document.getElementById("block_5"),
        document.getElementById("block_6"),
        document.getElementById("block_7"),
        document.getElementById("block_8")
    ];

    constructor(){
        this.#Setup();
        console.log('Game initiallized');
    }

    #Setup(){
        // initialize game variables
        this.#graph.init();
        this.#turn = "";
        this.#round = 0;
        this.#choice = new Array(0);
        this.#isMeasurement = false;
        this.#isNotCollapse = new Array(9).fill(true);
        this.#isCorrelated  = new Array(9).fill(false);
        this.#TicTacToe = new Array(9).fill({sign : "", round: 0})
        
        // setup html display
        this.#enable(this.#OBtn);
        this.#enable(this.#XBtn);
        this.#OBtn.innerHTML = "Go First";
        this.#XBtn.innerHTML = "Go First";
        this.#OLabel.style.color = "blue";
        this.#XLabel.style.color = "red";
        this.#RoundLabel.innerHTML = "Round: 0";
        this.#log.clear();
        this.#log.add("Select player . . .");
        this.#Cells = new Array(9);
        for (let i = 0; i < 9; i++){
            this.#Cells[i] = new Array(9);
        }

        // Draw Game table
        for (let i = 0; i < 9; i++){
            this.#Block[i].innerHTML =  '<tr><td><button class="cell" type="button" id="cell_' + i + '_0" disabled onclick="cell_click(this, ' + i + ')"></button></td>'+
                                            '<td><button class="cell" type="button" id="cell_' + i + '_1" disabled onclick="cell_click(this, ' + i + ')"></button></td>'+
                                            '<td><button class="cell" type="button" id="cell_' + i + '_2" disabled onclick="cell_click(this, ' + i + ')"></button></td></tr>'+
                                        '<tr><td><button class="cell" type="button" id="cell_' + i + '_3" disabled onclick="cell_click(this, ' + i + ')"></button></td>'+
                                            '<td><button class="cell" type="button" id="cell_' + i + '_4" disabled onclick="cell_click(this, ' + i + ')"></button></td>'+
                                            '<td><button class="cell" type="button" id="cell_' + i + '_5" disabled onclick="cell_click(this, ' + i + ')"></button></td></tr>'+
                                        '<tr><td><button class="cell" type="button" id="cell_' + i + '_6" disabled onclick="cell_click(this, ' + i + ')"></button></td>'+
                                            '<td><button class="cell" type="button" id="cell_' + i + '_7" disabled onclick="cell_click(this, ' + i + ')"></button></td>'+
                                            '<td><button class="cell" type="button" id="cell_' + i + '_8" disabled onclick="cell_click(this, ' + i + ')"></button></td></tr>';
        }
        this.#setOnClick();
    }

    #setOnClick(){
        var self = this;
        
        // player buttons
        this.#OBtn.onclick = function() {self.#player_button_click(this, 'O')};
        this.#XBtn.onclick = function() {self.#player_button_click(this, 'X')};

        // 9 * 9 = 81 cells
        for (let i = 0; i < 9; i++){
            for (let j = 0; j < 9; j++){
                this.#Cells[i][j] = document.getElementById('cell_' + i + '_' + j);
                this.#Cells[i][j].onclick = function() {self.#cell_click(this, i)};
            }
        }
    }

    #player_button_click(btn, sign){
        this.#disable(btn);

        // get game status
        var status;
        if (sign == "O"){
            status = OBtn.innerHTML;
        } else {
            status = XBtn.innerHTML;
        }

        if (status == "Go First"){
            this.#game_start(sign);
        } else if (status == "PASS"){
            this.#next_turn(sign)
        } else if (status == "Measure"){
            this.#measure(sign)
        } else if (status == "Restart"){
            this.#Setup()
            console.log("Game restart")
        }
    }

    #game_start(sign){
        // record the turn info, and fade another color
        if (sign == "O"){
            this.#turn = "O";
            this.#XLabel.style.color = "gray";
        } else {
            this.#turn = "X";
            this.#OLabel.style.color = "gray";
        }
    
        // change text into pass, add round counts, and enable all blank cells
        this.#OBtn.innerHTML = "PASS";
        this.#XBtn.innerHTML = "PASS";
        this.#round++;
        this.#RoundLabel.innerHTML = "Round: " + this.#round;
        this.#EnableBlankCell();
        this.#log.clear();
        this.#log.add("Game starts . . .");
        
        // disable pass button
        this.#disable(this.#OBtn);
        this.#disable(this.#XBtn);
    }

    #next_turn(sign){
        var id_0 = Html2Marker(this.#choice[0]).id;
        var id_1 = Html2Marker(this.#choice[1]).id;
        // if the edge exists => self-cycle
        if (this.#graph.isEdge(id_0, id_1)){
            this.#graph.addEdge(id_0, id_1, this.#turn, this.#round);
            this.#isMeasurement = true;
        } else{   // add edge and check cyclic
            this.#graph.addEdge(id_0, id_1, this.#turn, this.#round);
            if (this.#graph.isCyclic()){   // check if measurement occur
                this.#isMeasurement = true;
            }
        }
        
        // log block connection
        if (id_0 < id_1){
            this.#log.add("Connection " + this.#turn + this.#round + ": [ " + (id_0 + 1) + " ↔ " + (id_1 + 1) + " ]");
        } else {
            this.#log.add("Connection " + this.#turn + this.#round + ": [ " + (id_1 + 1) + " ↔ " + (id_0 + 1) + " ]");
        }

        // update button and turn
        if (sign == "O"){
            this.#turn = "X";
            this.#OLabel.style.color = "gray";
            this.#XLabel.style.color = "red";
            if (this.#isMeasurement){
                this.#XBtn.innerHTML = "Measure";
            }
        } else{
            this.#turn = "O";
            this.#OLabel.style.color = "blue";
            this.#XLabel.style.color = "gray";
            if (this.#isMeasurement){
                this.#OBtn.innerHTML = "Measure";
            }
        }

        // after checking the cycle exist or not
        // if measurement occur
        if (this.#isMeasurement){
            // check correlated blocks
            this.#isCorrelated = this.#graph.DFS(Html2Marker(this.#choice[0]).id);

            // collapse the blocks which is not in the cyclic loop
            var branch = new Array(9).fill(false);
            this.#log.clear();
            this.#log.add("Cyclic loop occurs!!");
            for (let i = 0; i < 9; i++){
                if (this.#isCorrelated[i]){
                    let ls = this.#graph.getADJ(i);
                    if (ls.length == 1){
                        this.#Collapse(marker(ls[0].sign, ls[0].round, i), -1);
                    }
                }
            }
            this.#EnableCorrelatedCell(); // enable all correlated cell, and disable others
        } 
        // if measurement didn't occur
        // add round counts, and enable all blank cells
        else {    
            this.#round++;
            this.#RoundLabel.innerHTML = "Round: " + this.#round;
            this.#EnableBlankCell();
        }
        // disable pass button, and clean choice list
        this.#disable(this.#OBtn);
        this.#disable(this.#XBtn);
        this.#choice = [];
    }

    #measure(sign){
        this.#isMeasurement = false;
        this.#Collapse(Html2Marker(this.#choice[0]), -1);

        // if gameover
        if (this.#isGameOver()){
            this.#DisableAllCell();
            this.#log.add("Game Over !!");
            this.#OBtn.innerHTML = 'Restart';
            this.#XBtn.innerHTML = 'Restart';
            this.#enable(this.#OBtn);
            this.#enable(this.#XBtn);
        } else {
            // add round counts, and enable all blank cells
            this.#round++;
            this.#RoundLabel.innerHTML = "Round: " + this.#round;
            this.#EnableBlankCell();
            this.#log.add("Game Continue . . .");

            // update button and turn
            if (sign == "O"){
                this.#OBtn.innerHTML = "PASS";
            } else {
                this.#XBtn.innerHTML = "PASS";
            }
            // disable pass button, and clean choice list
            this.#disable(this.#OBtn);
            this.#disable(this.#XBtn);
            this.#choice = [];
        }
    }

    #Collapse(mark, parent){
        // collapse
        var idx = mark.id;
        var nextId = this.#graph.removeVertex(mark);
        for (let c of this.#Cells[nextId]){     // also blank the same display in the neighbor cell
            if (Html2Marker(c).round == mark.round){
                c.innerHTML = "";
                this.#changeColor(c);
            }
        }
        this.#isCorrelated[idx] = false;
        this.#isNotCollapse[idx] = false;
        this.#TicTacToe[idx] = ({sign: mark.sign, round: mark.round});
        this.#ShowBlock(idx);
        if (parent == -1){
            if (this.#isMeasurement){ // branch blocks (not in cyclic)
                this.#log.add("Block_" + (idx + 1) + " collapsed");
            } else {    // measured by player
                this.#log.add("Block_" + (idx + 1) + " collapsed (Measure)");
            }
        } else {
            this.#log.add("Block_" + (idx + 1) + " collapsed ( " + mark.sign + mark.round + " : [" + (parent + 1) + " → " + (idx + 1) + "] )");
        }

        // recur collapse if the removed edge makes another vertex become only one neighbor
        let ls = this.#graph.getADJ(nextId);
        if (ls.length == 1){
            this.#Collapse(marker(ls[0].sign, ls[0].round, nextId), idx);
        }
    }

    #ShowBlock(idx){
        this.#Block[idx].innerHTML = '<button class="collapse" type="button" id="collapse_' + idx + '" disabled>' + Marker2Html(this.#TicTacToe[idx].sign, this.#TicTacToe[idx].round) + '</button>';
        var el = document.getElementById("collapse_" + idx);
        if (this.#TicTacToe[idx].sign == "O"){
            el.style.color = "blue";
        } else {
            el.style.color = "red";
        }
    }

    #cell_click(btn, blkID){
        this.#disable(btn);
        var mark = Html2Marker(btn);

        // measurement didn't happen
        if (!this.#isMeasurement){
            // new choice
            if (mark.sign == ""){
                btn.innerHTML = Marker2Html(this.#turn, this.#round);
                for (let b of this.#Cells[blkID]){
                    if (b == btn){
                        this.#enable(btn);
                        this.#changeColor(btn);
                        this.#choice.push(btn);
                    } else{
                        this.#disable(b);
                    }
                }
                console.log('Choose Block' + (blkID + 1));
            }

            // cancel choice
            else if ((mark.sign == "O") || (mark.sign == "X")){
                btn.innerHTML = "";
                this.#changeColor(btn);
                this.#EnableBlankCell();

                // remove choice from list
                if (this.#choice.length == 2){
                    if (this.#choice[0] == btn){
                        this.#choice = [this.#choice[1]];
                    } else if (this.#choice[1] == btn){
                        this.#choice = [this.#choice[0]];
                    }

                    // disable the block of remain choice
                    let id = Html2Marker(this.#choice[0]).id
                    for (let c of this.#Cells[id]){
                        if (c == this.#choice[0]){
                            this.#enable(c);
                        } else {
                            this.#disable(c);
                        }
                    }
                } else if (this.#choice.length == 1){
                    this.#choice = [];
                }
                console.log('Cancel Block_' + (blkID + 1));
            }

            // the player haven't finish this round
            if ((this.#choice.length == 0) || (this.#choice.length == 1)){
                this.#disable(this.#OBtn);
                this.#disable(this.#XBtn);
            }
            // choosed two choice, enable press button
            else if (this.#choice.length == 2){
                // enable pass button
                if (this.#turn == "O"){
                    this.#enable(this.#OBtn);
                } else{
                    this.#enable(this.#XBtn);
                }
                // disable all cells except the two chosen cell
                this.#DisableAllCell();
                this.#enable(this.#choice[0]);
                this.#enable(this.#choice[1]);
            }
        }
        // measurement happens
        else{
            // new choice to collapse
            if (this.#choice.length == 0){
                this.#choice.push(btn);
                this.#DisableAllCell();
                this.#enable(btn);
                if (this.#turn == "O"){
                    this.#enable(this.#OBtn);
                } else{
                    this.#enable(this.#XBtn);
                }
            }
            // cancel choice
            else if (this.#choice.length == 1){
                this.#choice = [];
                this.#EnableCorrelatedCell() // enable all correlated cell, and disable others
                if (this.#turn == "O"){
                    this.#disable(this.#OBtn)
                } else{
                    this.#disable(this.#XBtn)
                }
            }
        }
    }

    #EnableBlankCell(){
        for (let i = 0; i < 9; i++){
            if (this.#isNotCollapse[i]){
                for(let c of this.#Cells[i]){
                    if (c.innerHTML == ""){
                        this.#enable(c);
                    } else {
                        this.#disable(c);
                    }
                }
            }
        }
    }

    #DisableAllCell(){
        for (let i = 0; i < 9; i++){
            if (this.#isNotCollapse[i]){
                for(let c of this.#Cells[i]){
                    this.#disable(c);
                }
            }
        }
    }

    #EnableCorrelatedCell(){
        // disable all cells except correlated cells
        for (let i = 0; i < 9; i++){
            if (this.#isCorrelated[i] && this.#graph.isLegal(i)){
                for (let c of this.#Cells[i]){
                    if (Html2Marker(c).sign == ""){  // disable blank cell
                        this.#disable(c);
                    } else{                          // enable correlated cells
                        this.#enable(c);
                    }
                }
            } else{
                for (let c of this.#Cells[i]){
                    this.#disable(c);
                }
            }
        }
    }

    #enable(btn){
        btn.disabled = false;
    }

    #disable(btn){
        btn.disabled = true;
    }

    #changeColor(btn){
        var s = Html2Marker(btn).sign;
        if (s == ""){
            btn.style.color = "white";
        } else {
            if (s == "O"){
                btn.style.color = "blue";
            } else {
                btn.style.color = "red";
            }
        }
    }

    #equals3(a, b, c){
        return (a == b) && (b == c) && (a != "");
    }

    #isGameOver(){
        // TicTacToe must have result after five rounds
        if ((this.#round >= 5) && (this.#round < 8)){
            // across the top
            if (this.#equals3(this.#TicTacToe[0].sign, this.#TicTacToe[1].sign, this.#TicTacToe[2].sign)){
                return true;
            }
            // across the middle
            else if (this.#equals3(this.#TicTacToe[3].sign, this.#TicTacToe[4].sign, this.#TicTacToe[5].sign)){
                return true;
            }
            // across the bottom
            else if (this.#equals3(this.#TicTacToe[6].sign, this.#TicTacToe[7].sign, this.#TicTacToe[8].sign)){
                return true;
            }
            // down the left
            else if (this.#equals3(this.#TicTacToe[0].sign, this.#TicTacToe[3].sign, this.#TicTacToe[6].sign)){
                return true;
            }       
            // down the middle
            else if (this.#equals3(this.#TicTacToe[1].sign, this.#TicTacToe[4].sign, this.#TicTacToe[7].sign)){
                return true;
            }
            // down the right
            else if (this.#equals3(this.#TicTacToe[2].sign, this.#TicTacToe[5].sign, this.#TicTacToe[8].sign)){
                return true;
            }
            // diagonal \
            else if (this.#equals3(this.#TicTacToe[0].sign, this.#TicTacToe[4].sign, this.#TicTacToe[8].sign)){
                return true;
            }       
            // diagonal /
            else if (this.#equals3(this.#TicTacToe[2].sign, this.#TicTacToe[4].sign, this.#TicTacToe[6].sign)){
                return true;
            }
        }
        else if (this.#round == 8){
            var idx;        // record index of the only uncollapsed block
            var count = 0;  // count number of not collapsed block
            for (let i = 0; i < 9; i++){
                if (this.#isNotCollapse[i]){
                    count++;
                    idx = i
                }
            }
            if (count == 1){
                this.#TicTacToe[idx] = ({sign: this.#turn, round: (this.#round + 1)});
                this.#isNotCollapse[idx] = false;
                this.#ShowBlock(idx);
                this.#RoundLabel.innerHTML = "Round: " + (this.#round + 1);
                this.#log.add("Block" + (idx + 1) + " collapsed ( " + this.#turn + "'s turn )");
                return true;
            } else {
                return false;
            }
        }
        else if (this.#round == 9){
            return true;
        } else {
            return false;
        }
    }
}

/******************************
 * Main Function
 ******************************/
game = new Game();