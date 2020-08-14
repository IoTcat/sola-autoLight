const actModel = require('../func/actModel.js').actModel;

var liv = (zone, interface) => {
    
    var o = {
        id: 'liv',
        num: 0,
        numAct: 0,
        MaxNum: 5,
        LastActTime: new Date().valueOf(),
        MaxSensitTime: 1000 * 60 * 2,
        extTime: 0,
        isNight: false,
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
           maxDetectTime: 1000 * 60 * 30,
           actTimeArray: []
        }
    };


    var pLimiter = ()=>{
        if(o.num < 0) o.num = 0;
        if(o.num > o.MaxNum) o.num = o.MaxNum;
        o.LastActTime = new Date().valueOf();
    }



    var pIn = ()=>{
        o.num  = 1;
        pLimiter();
        console.log(new Date().toTimeString() + ' - liv = ' + o.num + '  ++   ACT: '+o.act.rate);
        o.func.peopleIn.forEach((item)=>{
            item();
        });
    }

    var pOut = ()=>{
        o.num = 0;
        pLimiter();
        console.log(new Date().toTimeString() + ' - liv = ' + o.num + '  --   ACT: '+o.act.rate);
        o.func.peopleOut.forEach((item)=>{
            item();
        });
    }





    /* 正常触发 */
    interface.dl.on('forward', ()=>{
        //pIn();
    });

    interface.dl.on('backward', ()=>{
        //if(!o.isNight || o.num != 1 ) pOut();
    })


    /* 超时衰减 */
    setInterval(()=>{
        if( new Date().getHours() >= 19 && new Date().getHours() <= 21 ) o.isNight = true;
        else o.isNight = false;
        

        let r = 0.3;

       if(new Date().getHours() == 19) {
           r = 0.1;
           o.act.maxDetectTime = 1000 * 60 * 15;
       }else if(new Date().getHours() == 20) {
           r = 0.05;
           o.act.maxDetectTime = 1000 * 60 * 30;
       }else if(new Date().getHours() == 21) {
           r = 0.05;
           o.act.maxDetectTime = 1000 * 60 * 15;
       }else{
           r = 0.3;
           o.act.maxDetectTime = 1000 * 60 * 10;
       }
       
        if(o.numAct || o.act.rate > r){
           if(!o.num) pIn();
        }else{
            if(o.num) pOut();
        }
      

        o.extTime = ((o.num == 1) && o.isNight)*1000*60*12; 
        if(o.num 
        && o.LastActTime + o.MaxSensitTime * o.act.rate + o.extTime< new Date().valueOf()){
            //pOut();
        }
    }, 1000);


    /* 意外触发 */
    zone.liv[1].on('peopleIn', ()=>{
        if(o.isNight && !o.num){
            if(o.LastActTime > new Date().valueOf() - o.MaxSensitTime * o.act.rate){
                //pIn();
                //pIn();
            }
        }
    });


    /* 活跃度监测 */
    /*zone.liv.forEach((item)=>{
        item.on('toggle', ()=>{
            o.act.actTimeArray.push(new Date().valueOf());
        });
    });*/
    setInterval(()=>{
        if(zone.liv[0].actNum || zone.liv[1].actNum){
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
 
    return o;

}

exports.liv = liv;
