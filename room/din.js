const actModel = require('../func/actModel.js').actModel;
var din = (zone, interface, p) => {
    
    var o = {
        id: 'din',
        num: 0,
        numAct: 0,
        state: false,
        LastSwiTime: 0,
        MaxNum: 5,
        LastActTime: new Date().valueOf(),
        MaxSensitTime: 1000 * 60 * 2,
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
        },
        act: {
           rate: 0,
           maxDetectTime: 1000 * 60 * 10,
           actTimeArray: []
        },
        extTime: 0,
        isNight: false
    };


    var pLimiter = ()=>{
        if(o.num < 0) o.num = 0;
        if(o.num > o.MaxNum) o.num = o.MaxNum;
        o.LastActTime = new Date().valueOf();
    }



    var pIn = ()=>{
        o.num = 1;
        pLimiter();
        console.log(new Date().toTimeString() + ' - din = ' + o.num + '  ++   ACT: '+o.act.rate);
        o.func.peopleIn.forEach((item)=>{
            item();
        });
    }

    var pOut = ()=>{
        o.num = 0;
        pLimiter();
        console.log(new Date().toTimeString() + ' - din = ' + o.num + '  --   ACT: '+o.act.rate);
        o.func.peopleOut.forEach((item)=>{
            item();
        });
    }






    interface.hd.on('forward', ()=>{
        //pIn();
    });
    /*
    interface.dk.on('backward', ()=>{
        pIn();
    })*/
    interface.dl.on('backward', ()=>{
        //pIn();
    })


    interface.hd.on('backward', ()=>{
        //if(!o.isNight || o.num != 1 ) pOut();
    })

   /* interface.dk.on('forward', ()=>{
        pOut();
    });*/
    interface.dl.on('forward', ()=>{
         //if(!o.isNight || o.num != 1 ) pOut();
    });



    /* 超时衰减 */
    setInterval(()=>{
        if( new Date().getHours() >= 18 && new Date().getHours() <= 20 ) o.isNight = true;
        else o.isNight = false;

        if( o.act.rate > .4){
           if(!o.num) pIn();
        }
        if(o.act.rate < .02){
//          if((o.num || o.state) && o.LastSwiTime < new Date().valueOf() - 1000*60*20) pOut();
        }
 
        o.extTime = ((o.num == 1) && o.isNight)*1000*60*1; 
        if(o.num 
        && o.LastActTime + o.MaxSensitTime * o.act.rate + o.extTime < new Date().valueOf()
        && zone.din[0].LastChangeTime + o.MaxSensitTime * o.act.rate < new Date().valueOf()
        && zone.din[1].LastChangeTime + o.MaxSensitTime * o.act.rate < new Date().valueOf()){
            //pOut();
        }
    }, 1000);


    /* 意外触发 */
    p.din[2].on('peopleIn', ()=>{
        if(o.isNight && !o.num){
            if(o.LastActTime > new Date().valueOf() - o.MaxSensitTime * o.act.rate){
                //pIn();
            }
        }
    });
    p.din[3].on('peopleIn', ()=>{
        if(o.isNight && !o.num){
            if(o.LastActTime > new Date().valueOf() - o.MaxSensitTime * o.act.rate){
                //pIn();
            }
        }
    });


    /* 门进入人 */



    /* 活跃度监测 */
    setInterval(()=>{
        if(zone.din[0].actNum || zone.din[1].actNum){
            o.act.actTimeArray.push(new Date().valueOf());
            o.numAct = 1;
        }else{
            o.numAct = 0;
        }
         while(o.act.actTimeArray[0] < new Date().valueOf() - o.act.maxDetectTime){
            o.act.actTimeArray.shift();
        }
        o.act.rate = o.act.actTimeArray.length * 1000 / o.act.maxDetectTime;
 
    }, 1000);
    /*zone.din.forEach((item)=>{
        item.on('toggle', ()=>{
            o.act.actTimeArray.push(new Date().valueOf());
        });
    });*/
   /* 
    setInterval(()=>{
        while(o.act.actTimeArray[0] < new Date().valueOf() - o.act.maxDetectTime){
            o.act.actTimeArray.shift();
        }
        o.act.rate = actModel(o.act.actTimeArray.length);

    }, 1000);
*/


    return o;

}

exports.din = din;
