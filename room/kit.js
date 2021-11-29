const actModel = require('../func/actModel.js').actModel;

var kit = (zone, interface) => {
    
    var o = {
        id: 'kit',
        num: 0,
        numAct: 0,
        MaxNum: 3,
        state: false,
        LastSwiTime: 0,
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
           maxDetectTime: 1000 * 60 * 7,
           actTimeArray: []
        }
    };


    var pLimiter = ()=>{
        if(o.num < 0) o.num = 0;
        if(o.num > o.MaxNum) o.num = o.MaxNum;
        o.LastActTime = new Date().valueOf();
    }



    var pIn = ()=>{
        o.num = 1;
        pLimiter();
        console.log(new Date().toTimeString() + ' - kit = ' + o.num + '  ++   ACT: '+o.act.rate);
        o.func.peopleIn.forEach((item)=>{
            item();
        });
    }

    var pOut = ()=>{
        o.num = 0;
        pLimiter();
        console.log(new Date().toTimeString() + ' - kit = ' + o.num + '  --   ACT: '+o.act.rate);
        o.func.peopleOut.forEach((item)=>{
            item();
        });
    }






    interface.dk.on('forward', ()=>{
        //pIn();
    });

    interface.dk.on('backward', ()=>{
        //pOut();
    })

    /* 超时衰减 */
    setInterval(()=>{
        if(o.act.rate > .6){
           //if(!o.num) pIn();
        }
        if(o.act.rate < .02){
            //if((o.num || o.state) && o.LastSwiTime < new Date().valueOf() - 1000*60*15) pOut();
        }
        /*if(o.num 
        && o.LastActTime + o.MaxSensitTime * o.act.rate < new Date().valueOf()
        && zone.kit[0].LastChangeTime + o.MaxSensitTime * o.act.rate < new Date().valueOf()){
            //pOut();
        }*/
    }, 1000);


    /* 意外触发 */
    zone.kit[0].on('peopleIn', ()=>{
        if(!o.num){
            if(o.LastActTime > new Date().valueOf() - o.MaxSensitTime * o.act.rate){
                //pIn();
            }
        }
    });



    /* 活跃度监测 */
    setInterval(()=>{
        if(zone.kit[0].actNum){
            o.act.actTimeArray.push(new Date().valueOf());
        };
        while(o.act.actTimeArray[0] < new Date().valueOf() - o.act.maxDetectTime){
            o.act.actTimeArray.shift();
        }
        o.act.rate = o.act.actTimeArray.length * 1000 / o.act.maxDetectTime;
        
        if(zone.kit[0].actNum){
            o.numAct = 1;
        }else{
            o.numAct = 0;
        }
    }, 1000);
    /*zone.din.forEach((item)=>{
        item.on('toggle', ()=>{
            o.act.actTimeArray.push(new Date().valueOf());
        });
    });
    */

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

exports.kit = kit;
