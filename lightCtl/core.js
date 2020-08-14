var core = (room, light) => {
    var o = {
        NoPeopleDelayTime: 1000 * 10,
        LastOnTime: 0,
        LastOffTime: 0,
    };

    room.on('peopleIn', ()=>{
       if(room.num == 1){
            light.on();
            o.LastOnTime = new Date().valueOf();
       }
    });

    room.on('peopleOut', ()=>{
        if(room.num == 0){
            setTimeout(()=>{
                if(room.num == 0){
                    light.off();
                    o.LastOffTime = new Date().valueOf();
                }
            }, o.NoPeopleDelayTime);
        }
    });
    return o;
};


exports.core = core;
