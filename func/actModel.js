var actModel = (num) => {

    var o = 1;

    if(num < 15){
        o += num * .1 * .1;
        return o;
    } 
    if(num < 40){
        o += 1;
        o += (num - 10) * (8.5 / 30) * .1;
        return o;
    }

    if(num < 100){
        o += 9;
        o += (num - 40) * (10 / 60) * .3;
        return o;
    }

    o += 19;
    o += Math.log(num - 100);
    return o;
}


exports.actModel = actModel;
