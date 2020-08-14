var peo = (client, room)=>{
   
    let lastAct = '';

setInterval(()=>{
    let act = '';
    if(typeof room.act != "undefined") act = (room.act.rate.toString().length>4?room.act.rate.toString().substring(0, 4):room.act.rate.toString());
    else act = room.num.toString();

    if(act != lastAct){
        client.publish('peo/'+room.id, act);
        lastAct = act;
    }
}, 500);
/*
    room.on('peopleIn', ()=>{
        client.publish('peo/'+room.id, room.num.toString());
        if(typeof room.act != "undefined") client.publish('act/'+room.id, (room.act.rate.toString().length>4?room.act.rate.toString().substring(0, 4):room.act.rate.toString()));
    });

    room.on('peopleOut', ()=>{
        client.publish('peo/'+room.id, room.num.toString());
        if(typeof room.act != "undefined") client.publish('act/'+room.id, (room.act.rate.toString().length>4?room.act.rate.toString().substring(0, 4):room.act.rate.toString()));
    });

*/
}

exports.peo = peo;
