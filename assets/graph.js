class Graph {
    #V;
    #disabled;
    #adjL;
    
    constructor(){}

    init(){
        this.#V = 9;
        this.#disabled = new Array(this.#V).fill(false);

        this.#adjL = new Array(this.#V);
        for (let i = 0; i < this.#V; i++){
            this.#adjL[i] = new Array(0);
        }
    }

    addEdge(v1, v2, m, r){
        this.#adjL[v1].push(marker(m, r, v2));
        this.#adjL[v2].push(marker(m, r, v1));
    }

    getADJ(v){
        var ls = [];
        for (let c of this.#adjL[v]){
            ls.push(c);
        }
        return ls;
    }

    removeVertex(mark){        
        var childID;
        var idx = mark.id;
        
        // remove mark from adjL[idx] and get ChildID
        for (let j = 0; j < this.#adjL[idx].length; j++){
            if (((this.#adjL[idx][j]).sign == mark.sign) && ((this.#adjL[idx][j]).round == mark.round)){
                childID = this.#adjL[idx][j].id;
                this.#adjL[idx].splice(j, 1);
                break;
            }
        }

        // remove mark from adjL[childID]
        for (let j = 0; j < this.#adjL[childID].length; j++){
            if ((this.#adjL[childID][j].sign == mark.sign) && (this.#adjL[childID][j].round == mark.round)){
                this.#adjL[childID].splice(j, 1);
                break;
            }
        }        

        // set Vertex_idx as disabled and return childID
        this.#disabled[idx] = true;
        return childID;
    }

    isEdge(v1, v2){/*
        for (let m of this.#adjL[v1]){
            if (v2 == m.id){
                return true;
            }
        }*/
        return false;
    }

    isLegal(v){
        if (this.#disabled[v]){
            return false;
        } else {
            return true;
        }
    }

    // A recursive function that uses visited[] and parent to detect 
    // cycle in subgraph reachable from vertex v. 
    #isCyclicUtil(v, visited, parent){
        // Mark the current node as visited  
        visited[v]= true;

        // Recur for all the vertices adjacent to this vertex 
        for (let c of this.#adjL[v]){ 
            var i = c.id;
            // If the node is not visited then recurse on it 
            if (!visited[i]){  
                if(this.#isCyclicUtil(i, visited, v)){
                    return true;
                }
            }
            // If an adjacent vertex is visited and not parent of current vertex, 
            // then there is a cycle 
            else if (parent != i){ 
                return true;
            }
        }
        return false;
    }

    // Returns true if the graph contains a cycle, else false. 
    isCyclic(){
        // Mark all the vertices as not visited 
        var visited = new Array(9).fill(false);
        
        // set disabled vertices to be visited
        for (let i = 0; i < 9; i++){
            if (this.#disabled[i]){
                visited[i] = true;
            }
        }
        // Call the recursive helper function to detect cycle in different 
        // DFS trees 
        for (let i = 0; i < 9; i++){
            if (!visited[i]){ // Don't recur for u if it is already visited 
                if(this.#isCyclicUtil(i, visited, -1)){ 
                    return true;
                }
            }
        }
        return false;
    }

    // A function used by DFS 
    #DFSUtil(v, visited, queue){
        // Mark the current node as visited
        visited[v] = true;
  
        // Recur for all the vertices  
        // adjacent to this vertex 
        for (let c of this.#adjL[v]){ 
            if (!visited[c.id]){ 
                this.#DFSUtil(c.id, visited);
            }
        }
    }

    // The function to do DFS traversal. It uses 
    // recursive DFSUtil() 
    DFS(v){
        // Mark all the vertices as not visited 
        var visited = new Array(9).fill(false);
        
        // set disabled vertices to be visited
        for (let i = 0; i < 9; i++){
            if (this.#disabled[i]){
                visited[i] = true;
            }
        }
  
        // Call the recursive helper function  
        // to print DFS traversal 
        this.#DFSUtil(v, visited);

        // reset disabled vertices to be not visited
        for (let i = 0; i < 9; i++){
            if (this.#disabled[i]){
                visited[i] = false;
            }
        }
        return visited;
    }
}