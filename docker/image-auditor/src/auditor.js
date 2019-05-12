//Including standard and third-party npm modules
const TCP_PORT          = 2205;
const UDP_PORT          = 2207;
const ADDRESS_MULTICAST = "239.255.22.5"
const ADDRESS_UNICAST   = "0.0.0.0"

var musicians = new Map();
var dgram = require('dgram');
var dgramSocket = dgram.createSocket('udp4');
dgramSocket.bind(UDP_PORT, function() {
    console.log("Joining multicast group");
    dgramSocket.addMembership(ADDRESS_MULTICAST);
});


/*
 * This call back is invoked when a new datagram has arrived.
 */
dgramSocket.on('message', function(msg, source) {
    console.log("Data has arrived: " + msg + ". Source port: " + source.port);
    //update or add the instrument in instruments map

    var musician_req = JSON.parse(msg);

    if (!musicians.has(musician_req.uuid)) {
        var musician_feature = {
            "uuid": musician_req.uuid,
            "instrument": DetectInstrumentUsingSound(musician_req.sound),
            "activeSince": new Date().toISOString()
        };
        musicians.set(musician_req.uuid, musician_feature);
    } else {
        var tmp = musicians.get(musician_req.uuid);
        tmp.activeSince = new Date().toISOString();
        musicians.set(musician_req.uuid, tmp);
    }
});

var net = require('net');
var server = net.createServer(function(socket){
    console.log("CONNECTED");
    musicians.forEach((value, key)=> {
        if(Date.now() - Date.parse(value.activeSince) > 5000)
            musicians.delete(key);
     });

     var tableauMusicians = new Array();
     musicians.forEach((value) => {
         tableauMusicians.push(value);
     });

    var payload =JSON.stringify(tableauMusicians) + "\r\n";
    console.log("sending payload : " + payload);

    socket.write(payload);

    console.log("CLOSE CONNEXION");
    socket.destroy();

});

server.listen(TCP_PORT, ADDRESS_UNICAST);


//detect an instrument according to the sound
var DetectInstrumentUsingSound = function(sound) {
    var instrument = null;
    switch (sound) {

        case "ti-ta-ti":
            instrument = "piano";
            break;
        case "pouet":
            instrument = "trumpet";
            break;
        case "trulu":
            instrument = "flute";
            break;
        case "gzi-gzi":
            instrument = "violin";
            break;
        case "boum-boum":
            instrument = "drum";
            break;
        default:
            console.log("not a valid sound");
    }

    return instrument;
}
