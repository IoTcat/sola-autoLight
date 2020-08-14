const zone = (tag, pir) => {
    var o = {
       'tag': tag,
       state: false,
       rate: 0,
       fRate: 0,
       "pir": pir,
       num: pir.length,
       actNum: 0,
       threshold: 0,
       LastActTime: new Date().valueOf(),
       LastUnActTime: new Date().valueOf(),
       LastChangeTime: new Date().valueOf(),
       func: {
           peopleIn: [],
           peopleOut: [],
           toggle: []
       },
       on: (event, handler)=>{
        if(event == "peopleIn"){
            o.func.peopleIn.push(handler);
        }
        if(event == "peopleOut"){
            o.func.peopleOut.push(handler);
        }
        if(event == "toggle"){
            o.func.toggle.push(handler);
        }
    },
    };


    var peopleIn = () => {
        o.actNum ++;
        refresh();

        if(o.fRate <= o.threshold) {o.func.peopleIn.forEach((item)=>{
                item();
                });

        o.func.toggle.forEach((item)=>{
                item();
                });
                o.LastActTime = new Date().valueOf();
        }
    };

    var peopleOut = () => {
        o.actNum --;
        refresh();

        if(o.fRate > o.threshold && o.rate <= o.threshold) {o.func.peopleOut.forEach((item)=>{
                item();
                });

        o.func.toggle.forEach((item)=>{
                item();
                });
                o.LastUnActTime = new Date().valueOf();
        }
    };

    var toggle = () => {
        o.LastChangeTime = new Date().valueOf();
    };

    var refresh = () => {
        o.fRate = o.rate;
        o.rate = o.actNum * 100 / o.num;
        if(o.rate > o.threshold){
            o.state = true;
        }else{
            o.state = false;
        }
    };



    /* reg */
    o.pir.forEach((item, index)=>{
            item.on('peopleIn', ()=>{
                peopleIn();
                });
            item.on('peopleOut', ()=>{
                peopleOut();
                });
            item.on('toggle', ()=>{
                toggle();
                });
            });

    return o;
}


exports.zone = zone;
