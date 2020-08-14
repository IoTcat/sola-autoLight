var isolat = (room, light, pir, lightCtl) => {
    
    /* reg */
    pir.forEach((item)=>{
         item.on('peopleIn', ()=>{
            if(!room.num){
                light.on();
            }
         });

         item.on('peopleOut', ()=>{
            if(!room.num && room.LastActTime + lightCtl.NoPeopleDelayTime < new Date().valueOf()){
                if(!pir.some((items)=>{
                    return items.state;
                })){
                    light.off();
                }
            }
         });
    });
}

exports.isolat = isolat;
