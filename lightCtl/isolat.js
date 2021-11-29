var isolat = (room, light, pir, lightCtl) => {
   

    const endDur = 120 * 1000;

    let pirStates = [false, false];
    let endT = 0;

    let getT = ()=>new Date().valueOf();

    let LightSetter = function(ind, val){
        pirStates[ind] = val;
console.log(pirStates);
        if(pirStates.every((t)=>t)) {
            light.on();
            endT = getT(); 
            return;
        }

        if(endDur + endT < getT()){
            light.off();
            return;
        }
    }


    setInterval(()=>{
        if(endDur + endT < getT()){
            light.off();
        }
    }, 1000);

    pir.forEach((item, ind)=>{
        item.on('peopleIn', ()=>{
           LightSetter(ind, true); 
        });
        item.on('peopleOut', ()=>{
           LightSetter(ind, false); 
        });
    });

    /* reg */
/*
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
*/
}

exports.isolat = isolat;
