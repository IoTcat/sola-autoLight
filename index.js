const mqtt = require('mqtt');
const pir = require('./people/pir.js').pir;
const zoneObj = require('./people/zone.js').zone;
const lightObj = require('./mqtt/light.js').light
const matchObj = require('./match.js').match;
const interface = require('./people/interface.js').interface;
const lightCtlObj = require('./lightCtl/core.js').core;
const peo = require('./mqtt/peo.js').peo;
const isolatObj = require('./lightCtl/isolat.js').isolat;
process.setMaxListeners(0);

var client = mqtt.connect('mqtt://127.0.0.1');
var light = {
    hall: lightObj(client, 'hall'),
    din: lightObj(client, 'din'),
    liv: lightObj(client, 'liv'),
    kit: lightObj(client, 'kit')
};

var p = {
    hall: [
        pir(client, 'hall', 0),
        pir(client, 'hall', 1),
        pir(client, 'hall', 2),
        pir(client, 'hall', 3),
    ],
    din: [
        pir(client, 'din', 0),
        pir(client, 'din', 1),
        pir(client, 'din', 2),
        pir(client, 'din', 3)
    ],
    liv: [
        pir(client, 'liv', 0),
        pir(client, 'liv', 1),
        pir(client, 'liv', 2),
        pir(client, 'liv', 3)
    ],
    livb: [
        pir(client, 'livb', 0),
        pir(client, 'livb', 1),
        pir(client, 'livb', 2),
        pir(client, 'livb', 3)
    ],
    kit: [
        pir(client, 'kit', 0),
        pir(client, 'kit', 1),
        pir(client, 'kit', 2),
        pir(client, 'kit', 3)
    ]
}



var zone = {
    hall: [
        zoneObj('h0', [p.hall[0], p.hall[1]]),
        zoneObj('h1', [p.hall[2]])
    ],
    din: [
        zoneObj('d0', [p.hall[3], p.kit[0], p.kit[1], p.din[0], p.din[1], p.livb[0]]),
        zoneObj('d1', [p.din[2], p.din[3]])
    ],
    kit: [
        zoneObj('k0', [/*p.kit[2],*/ p.kit[3]])
    ],
    liv: [
        zoneObj('l0', [p.liv[0], p.livb[1]]),
        zoneObj('l1', [p.livb[2], p.livb[3], p.liv[2], p.liv[3]])
    ]
};


client.on('connect', ()=>{


    client.subscribe('hass/snsr/#', (err)=>{
        if(!err){
            client.publish('autoLight/state', 'online');
            console.log(new Date().toTimeString() + ' - MQTT Connected!!');
        }
    });  
});


//var match = matchObj(zone, light);

var i = {
    h: interface(zone.hall[0], zone.hall[1]),
    hd: interface(zone.hall[1], zone.din[0]),
    d: interface(zone.din[0], zone.din[1]),
    dk: interface(zone.din[1], zone.kit[0]),
    dl: interface(zone.din[0], zone.liv[1]),
    l: interface(zone.liv[0], zone.liv[1])
}


/* room reg */
var room = {
    hall: require('./room/hall.js').hall(zone, i),
    din: require('./room/din.js').din(zone, i, p),
    liv: require('./room/liv.js').liv(zone, i),
    kit: require('./room/kit.js').kit(zone, i),
}

/* lightCtl reg */
var lightCtl = {
    hall: lightCtlObj(room.hall, light.hall),
    din: lightCtlObj(room.din, light.din),
    liv: lightCtlObj(room.liv, light.liv),
    kit: lightCtlObj(room.kit, light.kit)
}


/* peo mqtt */
var peo_mqtt = {
    hall: peo(client, room.hall),
    din: peo(client, room.din),
    liv: peo(client, room.liv),
    kit: peo(client, room.kit)
}

/* 走廊入口 */
var isolat = {
    hall: isolatObj(room.hall, light.hall, [p.hall[0], p.hall[1]], lightCtl.hall),
    //door: isolatObj(room.din, light.din, [p.din[0], p.livb[0]], lightCtl.din),

}
