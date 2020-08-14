var interface = (z0, z1) => {
    var o = {
        state: 'null',
        func: {
            forward: [],
            backward: [],
        },
        on: (event, handler)=>{
            if(event == 'forward'){
                o.func.forward.push(handler);
            }
            if(event == 'backward'){
                o.func.backward.push(handler);
            }
        },

    };


    z0.on('peopleIn', ()=>{
        if(z1.state){
            o.state = "forward";
            console.log(new Date().toTimeString() + ' - ' + z1.tag + ' to ' + z0.tag);
            o.func.backward.forEach((item)=>{
                item();
            });
        }
    });

    z1.on('peopleIn', ()=>{
        if(z0.state){
            o.state = "backward";
            console.log(new Date().toTimeString() + ' - ' + z0.tag + ' to ' + z1.tag); 
            o.func.forward.forEach((item)=>{
                item();
            });
        }
    })

    z1.on('peopleOut', ()=>{
        if(!z0.state){
            o.state = "null";
        }
    });

    z0.on('peopleOut', ()=>{
        if(!z1.state){
            o.state = "null";
        }
    });



    return o;
}



exports.interface = interface;
