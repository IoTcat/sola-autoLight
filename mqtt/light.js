var light = (client, clientId) => {

    var o = {
        state: false,
        LastOnTime: new Date().valueOf(),
        LastOffTime: new Date().valueOf(),
        on: ()=>{
            client.publish('hass/autoLight/'+clientId, '1');
        },
        off: ()=>{
            client.publish('hass/autoLight/'+clientId, '0');
        }

    };


    client.on('message', (subject, msg)=>{
        if(subject == 'hass/snsr/'+clientId+'/lightCtl'){
            if(msg == 1) o.state = true;
            if(msg == 0) o.state = false;
        }
    });

    return o;
}


exports.light = light;
