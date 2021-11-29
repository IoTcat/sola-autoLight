var isolat = (room, light, pir, lightCtl) => {
   

    const endDur = 120 * 1000;

    let pirStates = [false, false];
    let endT = 0;
    let TO = {};

    let getT = ()=>new Date().valueOf();


    let LightEnder = function(){
        console.log(new Date() + ' - Hall light off in trigger.');
        light.off();
    }




    let LightSetter = function(ind, val){
        pirStates[ind] = val;
console.log(new Date() + ' - Hall 0,1 change: ' + pirStates);
        if(pirStates.every((t)=>t)) {
console.log(new Date() + ' - Hall light on in trigger.');
            clearTimeout(TO);
            light.on();
            endT = getT();
            TO = setTimeout(LightEnder, endDur);
            return;
        }

    }

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
