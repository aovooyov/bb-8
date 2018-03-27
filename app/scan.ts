let noble = require('noble');
let util = require('util');

noble.on('stateChange', (state) => {
    console.log('[BLE] BLE state @ ', state);

    noble.startScanning();
});

noble.on('discover', (peripheral) => {
    console.log('[BLE] Discover @ ', util.inspect(peripheral, {
        showHidden: true,
        colors: true,
        depth: 1
    }));
});

process.on('beforeExit', () => { noble.stopScanning(); });