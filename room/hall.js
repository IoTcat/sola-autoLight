var hall = (zone, interface) => {
    
    var o = {
        id: 'hall',
        num: 0,
        MaxNum: 2,
        LastActTime: new Date().valueOf(),
        MaxSensitTime: 1000 * 60 * 1,
        func: {
            peopleIn: [],
            peopleOut: [],
        },
        on: (event, handler)=>{
            if(event == 'peopleIn'){
                o.func.peopleIn.push(handler);
            }
            if(event == 'peopleOut'){
                o.func.peopleOut.push(handler);
            }
        }
    };


    var pLimiter = ()=>{
        if(o.num < 0) o.num = 0;
        if(o.num > o.MaxNum) o.num = o.MaxNum;
        o.LastActTime = new Date().valueOf();
    }



    var pIn = ()=>{
        o.num ++;
        pLimiter();
        console.log(new Date().toTimeString() + ' - hall = ' + o.num + '  ++');
        o.func.peopleIn.forEach((item)=>{
            item();
        });
    }

    var pOut = ()=>{
        o.num --;
        pLimiter();
        console.log(new Date().toTimeString() + ' - hall = ' + o.num + '  --');
        o.func.peopleOut.forEach((item)=>{
            item();
        });
    }






    interface.h.on('forward', ()=>{
        pIn();
    });
    
    interface.hd.on('backward', ()=>{
        pIn();
    })

    interface.h.on('backward', ()=>{
        pOut();
    })

    interface.hd.on('forward', ()=>{
        pOut();
    });

    /* 超时衰减 */
    setInterval(()=>{
        if(o.num 
        && o.LastActTime + o.MaxSensitTime < new Date().valueOf()
        && zone.hall[1].LastChangeTime + o.MaxSensitTime < new Date().valueOf()){
            pOut();
        }
    }, 1000);


    /* 意外触发 */
    zone.hall[1].on('peopleIn', ()=>{
        if(!o.num){
            if(o.LastActTime > new Date().valueOf() - o.MaxSensitTime){
                pIn();
            }
        }
    });
    /* 意外触发 */
    zone.hall[0].on('peopleIn', ()=>{
        if(!o.num){
            if(o.LastActTime > new Date().valueOf() - o.MaxSensitTime){
                pIn();
            }
        }
    });



    return o;


}

exports.hall = hall;
