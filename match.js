var match = (zone, light) => {
    


    var mObj = (zones) => {
        
        var o_O = {
            LastActTime: new Date().valueOf(),
            LastUnActTime: new Date().valueOf(),
            state: false,
            func: {
                peopleIn: [],
                peopleOut: [],
                toggle: []
            },
            on: (event, handler) => {
                if(event == "peopleIn"){
                    o_O.func.peopleIn.push(handler);
                }
                if(event == "peopleOut"){
                    o_O.func.peopleOut.push(handler);
                }
                if(event == "toggle"){
                    o_O.func.toggle.push(handler);
                }
            }
        };

        zones.forEach((item, index)=>{
            item.on('peopleIn', ()=>{
                if(!o_O.state){
                    o_O.state = true;
                    o_O.LastActTime = new Date().valueOf();
                }
                o_O.func.peopleIn.forEach((item)=>{
                    item();
                });
                 o_O.func.toggle.forEach((item)=>{
                    item();
                });
            });

            item.on('peopleOut', ()=>{
                if(o_O.state){
                    o_O.state = false;
                    o_O.LastUnActTime = new Date().valueOf();
                };
                o_O.func.peopleOut.forEach((item)=>{
                    item();
                });
                 o_O.func.toggle.forEach((item)=>{
                    item();
                });
            });
            
        });

        return o_O;
    }




    zone.hall[0].on('peopleIn', ()=>{
        light.hall.on();
    });


    var hall = mObj([zone.hall[0], zone.hall[1]]);

    hall.on('peopleIn', ()=>{
        light.hall.on();
    });

    hall.on('peopleOut', ()=>{
        light.hall.off();
    });

    var liv = mObj([zone.liv[0], zone.liv[1]]);

    liv.on('peopleIn', ()=>{
        light.liv.on();
    });

    liv.on('peopleOut', ()=>{
        light.liv.off();
    });



}

exports.match = match;
