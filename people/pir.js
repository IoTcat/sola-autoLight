var pir = (client, clientId, pirId) => {
    var o = {
        state: false,
        LastActTime: new Date().valueOf(),
        LastUnActTime: new Date().valueOf(),
        topic: 'hass/snsr/'+clientId+'/p'+pirId,
        func: {
            peopleIn: [],
            peopleOut: [],
            toggle: []
        },
        on: (event, handler)=>{
            if(event == 'peopleIn'){
                o.func.peopleIn.push(handler);
            }
            if(event == 'peopleOut'){
                o.func.peopleOut.push(handler);
            }
            if(event == 'toggle'){
                o.func.toggle.push(handler);
            }
        },

    };

    client.on('connect', ()=>{
        client.subscribe(o.topic);
    });

    client.on('message', (topic, msg) => {
        if(topic == o.topic){
            if(msg == 1){
                if(!o.state) {
                    o.state = true;
                    o.func.peopleIn.forEach((item)=>{
                        item();
                    });
                    o.func.toggle.forEach((item)=>{
                        item();
                    });
                }
            }
            if(msg == 0){
                if(o.state){
                    o.state = false
                     o.func.peopleOut.forEach((item)=>{
                        item();
                    });
                    o.func.toggle.forEach((item)=>{
                        item();
                    });
                }
            }
        }
    });

    return o;
};

exports.pir = pir;
