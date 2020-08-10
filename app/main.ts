
require('draftlog').into(console);

import { BOOST } from './robot/boost';
import { BB8 } from './robot/bb8';
import { Xbox } from './controller/xbox';
import { Debug } from './debug';

//const xbox = new Xbox();  
//const boost = new BOOST();
//const bb8 = new BB8();


var noble = require('noble');



const debug = new Debug('XBOX');
debug.tint = '#00a4ce';
debug.color = '#e4703c';

const deviceOut = debug.out();
const controllerOut = debug.out();
const buttonOut = debug.out();
//const keyboardOut = debug.out();

const hid = require('node-hid');
const devices = hid.devices();
const device = devices.find((d) => {
    var product = (typeof d === 'object' && d.product) || '';

    console.log(product);

    return product.indexOf('Xbox Wireless') !== -1;
});

deviceOut(debug.log('device: ', device));
if(!device) {
    process.exit(0);
}

//BUG 0.7.2
const controller = new hid.HID(device.path);

controller.on('data', function (data) {
    //controllerOut(debug.log('data: ', data));
    console.log(data);
    var button = data[14];

    if (button == 1) {
        buttonOut(debug.log('A: ', data))
    }

    if(button == 2) {
        buttonOut(debug.log('B: ', data))
    }
});

controller.on('error', function(error) {
    console.log(error);
});

console.log('features', controller.getFeatureReport(0, 8));

const readline = require('readline');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {

    //keyboardOut(debug.log('keypress:', { str, key }));

    if(key.name == 'a') {

        var buffer = Buffer.from([0x01, 0x5a, 0x85, 0x9f, 0x87, 0x3e, 0x81, 0x43, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        //var buffer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        
        buffer.writeInt8(1, 14);
        console.log(buffer);

        var result = controller.sendFeatureReport(buffer);
        console.log(result);
    }

    if (key.name == 'escape') {
        process.exit(0);
    }
})
