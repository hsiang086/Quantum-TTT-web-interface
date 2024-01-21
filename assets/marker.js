function marker(sign, round, index){
    return {
        sign : sign,
        round: round,
        id: index
    };
}

function Marker2Html(sign, round){
    return sign + "<sub>" + round + "</sub>"
}

function Html2Marker(btn){
    var html = btn.innerHTML;
    var idstr = btn.id;
    var sign, round, id, other;
    
    if (html != ""){
        [sign, other] = html.split("<sub>", 2);
        round = parseInt((other.split("</sub>", 1))[0]);
    } else{
        sign  = "";
        round = 0;
    }
    id = parseInt((idstr.split("_", 3))[1]);
    
    return marker(sign, round, id);
}