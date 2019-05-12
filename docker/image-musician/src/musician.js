//Including standard and third-party npm modules
const ADDRESS_MULTICAST = "239.255.22.5"
const UDP_PORT          = 2207;
var uuid                = require('uuid');
var net                 = require('net');
var async               = require("async");
var expect              = require('chai').expect;

//we use a standard Node.js module to works with UDP
var dgram = require('dgram');

//Datagram socket which will be use to send music
var dgramSocket = dgram.createSocket('udp4');

//Determinating sound according to the instrument
var sound = function(instru){
    var theSound = null;
    switch(instru){

        case "piano"   : theSound = "ti-ta-ti";
            break;

        case "trumpet" : theSound = "pouet";
            break;

        case "flute"   : theSound = "trulu";
            break;

        case "violon"  : theSound = "gzi-gzi";
            break;

        case "drum"    : theSound = "boum-boum";
            break;

        default:
            console.log("The instrument is not available");      
    }
    return theSound;
}

//This function define a musician 
function Musician(instrument){

    this.uuid       = uuid();
    this.instrument = instrument;
    this.sound      = sound(instrument);

    Musician.prototype.createMessage = function (){

        var play = { uuid: this.uuid, sound: this.sound };
        var payload = JSON.stringify(play);
        msg = new Buffer(payload);

        dgramSocket.send(msg, 0, msg.length, UDP_PORT, ADDRESS_MULTICAST, function(err, byte){
            console.log("Sending sound : " + payload + " via port " + dgramSocket.address().port)
        });
    }

    //We send a soun every 400 ms
    setInterval(this.createMessage.bind(this), 400);
}
//Getting a musician property(instrument)
var instrument = process.argv[2];

//Creating a new musician
var musician = new Musician(instrument);
