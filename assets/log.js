class GameLog{
    #n;
    #MaxN = 11;
    #msgList = new Array(this.#MaxN);
    #Label = document.getElementById("msg");
    
    constructor(){
        this.clear();
    }

    clear(){
        this.#n = 0;
        this.#msgList.fill("<br>");
        this.#print();
    }
    
    add(msg){
        console.log(msg);   // log to console

        // if the message count smaller than maximum
        if (this.#n < this.#MaxN){
            this.#msgList[this.#n] = msg + "<br>";
            this.#n++;
        } else {
            this.#msgList.shift(); // remove msg from the beginning
            this.#msgList.push(msg + "<br>");  // add msg to the end 
        }
        this.#print();
    }

    #print(){
        var html = "<b><em>Game Log</em></b><br>";
        for (let i = 0; i < this.#MaxN; i++){
            html += this.#msgList[i];
        }
        this.#Label.innerHTML = html;
    }
}