import { Xbox } from '../controller/xbox';
import { Debug } from '../debug';
import { setInterval } from 'timers';

export class BOOST {
    private debug: Debug;

    private delay: number = 100;
    private head: number = 0;
    private distance: number;
    private tilt: any;
    private port: any;
    private rotation: any;
    private rssi: any;

    private lstick: any;

    private lock: boolean;
    private colors: string[] = ['off', 'pink', 'purple', 'blue', 'lightblue', 'cyan', 'green', 'yellow', 'orange', 'red', 'white'];

    private toggleBalance = false;

    constructor() {
        this.debug = new Debug('BOOST');
        this.debug.tint = '#00a4ce';
        this.debug.color = '#e4703c';

        this.init();
    }

    private diagnostic() {

        const distance = this.debug.out();
        const rotation = this.debug.out();
        const tilt = this.debug.out();
        const port = this.debug.out();
        const rssi = this.debug.out();
        const lstick = this.debug.out();

        var out = () => {
            distance(this.debug.log('distance', this.distance));
            rotation(this.debug.log('rotation', this.rotation));
            tilt(this.debug.log('tilt    ', this.tilt));
            port(this.debug.log('port    ', this.port));
            rssi(this.debug.log('rssi    ', this.rssi));
            lstick(this.debug.log('ls      ', this.lstick));
        };

        out();
        setInterval(out, 50);
    }

    init() {
        const boost = require('movehub');
        const xbox = new Xbox();

        const stickCenter = 127.5;
        const stickPercent = stickCenter / 100;

        // xbox.on('lstick', pos => {
        //     const x = Math.floor((pos.x - stickCenter) / stickPercent);
        //     const y = Math.floor((pos.y - stickCenter) / stickPercent);

        //     this.lstick = { x: x, y: y };

        //     if (Math.abs(x) < 20 && Math.abs(y) < 20) {
        //         console.log('stop');
        //         return;
        //     }

        //     let a = x;
        //     let b = -y;
           
        //     // if(b < 0) {
        //     //     a = -a;
        //     // }           

        //     // if(b < a) {
        //     //     console.log('down', a, b);
        //     //     return;
        //     // }

        //     // if(b > a) {
        //     //     console.log('up', a, b);
        //     //     return;
        //     // }


        //     if(Math.abs(a) < 50 && b > 50) {
        //         console.log('up', a, b);
        //         return;
        //     }

        //     if (a > 50 && Math.abs(b) < 50) {
        //         console.log('right', a, b);
        //         return;
        //     }

        //     if (Math.abs(a) < 50 && b < -50) {
        //         console.log('down', a, b);
        //         return;
        //     }           

        //     if (a < 50 && Math.abs(b) < 50) {
        //         console.log('left', a, b);
        //         return;
        //     }

        //     console.log(a, b);
        // });

        boost.on('ble-ready', status => {
            console.log(this.debug.log('ble-ready', status));
        });

        boost.on('hub-found', hubDetails => {
            console.log(this.debug.log('hub-found', hubDetails));

            boost.connect(hubDetails.address, (err, hub) => {
                if (err) {
                    throw err;
                }

                var stop = () => {
                    hub.motorAngleMulti(0, 0, 0, () => this.lock = false);
                };

                var allowDistance = () => {
                    if (this.distance <= 100) {
                        stop();
                        return false;
                    }

                    return true;
                };

                hub.on('error', (err) => {
                    console.error('[boost]: hub error', err);
                });

                hub.on('disconnect', () => {
                    console.log('[boost]: hub disconnect');
                });

                hub.on('distance', distance => {
                    this.distance = distance;

                    allowDistance();
                    // if (distance >= 120) {
                    //     this.lock = true;
                    //     hub.motorAngle('AB', 300, 50, () => setTimeout(() => this.lock = false, 1000));
                    //     return;
                    // }
                });

                // hub.on('color', color => {
                //     console.log('color', color);
                // });

                hub.on('port', port => {
                    this.port = port;
                });

                hub.on('tilt', tilt => {
                    // this.tilt = tilt;

                    // if (Math.abs(this.tilt.pitch) > 35) {
                    //     stop();
                    //     return;
                    // }

                    // if (this.tilt.pitch < 0) {
                    //     hub.motorAngle('AB', 5000, 50, () => this.lock = false);
                    //     return;
                    // }

                    // if (this.tilt.pitch > 0) {
                    //     hub.motorAngle('AB', 5000, - 50, () => this.lock = false);
                    //     return;
                    // }

                    // stop();
                });

                hub.on('rotation', rotation => {
                    this.rotation = rotation;

                    if (rotation.port === 'D') {
                        this.head = rotation.angle;
                    }
                });

                hub.on('rssi', rssi => {
                    this.rssi = rssi;
                });

                hub.on('connect', () => {
                    //console.log(this.debug.log('hub', 'connected'));
                    this.diagnostic();

                    hub.led('red');

                    xbox.on('lstick', pos => {
                        const x = Math.floor((pos.x - stickCenter) / stickPercent);
                        const y = Math.floor((pos.y - stickCenter) / stickPercent);

                        this.lstick = { x: x, y: y };

                        if (Math.abs(x) < 20 && Math.abs(y) < 20) {
                            this.lock = false;
                            stop();
                            return;
                        }

                        const a = x;
                        const b = -y;

                        this.lock = true;

                        // if (b < a || b > a) {
                        //     hub.motorAngle('AB', 5000, b, () => this.lock = false);
                        //     return;
                        // }

                        if (Math.abs(a) < 50 && b > 50) {
                            //console.log('up', a, b);
                            hub.motorAngle('AB', 5000, b, () => this.lock = false);
                            return;
                        }

                        if (a > 50 && Math.abs(b) < 50) {
                            //console.log('right', a, b);
                            hub.motorAngleMulti(5000, a, b, () => this.lock = false);
                            return;
                        }

                        if (Math.abs(a) < 50 && b < -50) {
                            //console.log('down', a, b);
                            hub.motorAngle('AB', 5000, b, () => this.lock = false);
                            return;
                        }

                        if (a < 50 && Math.abs(b) < 50) {
                            //console.log('left', a, b);
                            hub.motorAngleMulti(5000, b, Math.abs(a), () => this.lock = false);
                            return;
                        }

                        //hub.motorAngleMulti(5000, a, b, () => this.lock = false);
                    });

                    xbox.on('lb', () => {
                        if (this.lock) {
                            return;
                        }

                        if (this.head <= -35) {
                            return;
                        }

                        this.lock = true;

                        hub.motorAngle('D', 30, -50, () => this.lock = false);
                    });

                    xbox.on('lb:release', () => {
                        //hub.motorAngle('D', 100, -50, () => this.lock = false);
                        stop();
                    });

                    xbox.on('rb', () => {
                        if (this.lock) {
                            return;
                        }

                        if (this.head >= 50) {
                            return;
                        }

                        this.lock = true;
                        hub.motorAngle('D', 30, 50, () => this.lock = false);
                    });

                    xbox.on('rb:release', () => {
                        //hub.motorAngle('D', 100, 50, () => this.lock = false);
                        stop();
                    });

                    xbox.on('left', () => {
                        if (this.lock) {
                            return;
                        }

                        this.lock = true;
                        hub.motorAngleMulti(5000, -100, 100, () => this.lock = false);
                    });

                    xbox.on('left:release', () => {
                        stop();
                    });

                    xbox.on('right', () => {
                        if (this.lock) {
                            return;
                        }

                        this.lock = true;
                        hub.motorAngleMulti(5000, 100, -100, () => this.lock = false);
                    });

                    xbox.on('right:release', () => {
                        stop();
                    });

                    xbox.on('up', () => {
                        if (this.lock) {
                            return;
                        }

                        if (!allowDistance()) {
                            return;
                        }

                        this.lock = true;
                        hub.motorAngle('AB', 5000, 100, () => this.lock = false);
                    });

                    xbox.on('up:release', () => {
                        stop();
                    });

                    xbox.on('down', () => {
                        if (this.lock) {
                            return;
                        }

                        this.lock = true;
                        hub.motorAngle('AB', 5000, -100, () => this.lock = false);
                    });

                    xbox.on('down:release', () => {
                        stop();
                    });

                    xbox.on('b', () => {

                        if (this.lock) {
                            return;
                        }

                        this.lock = true;

                        var color = this.colors[Math.floor(Math.random() * this.colors.length)];
                        hub.led(color, () => this.lock = false);
                    });

                    xbox.on('y', () => {
                        // if (this.lock) {
                        //     return;
                        // }

                        // this.lock = true;
                        // this.toggleBalance = !this.toggleBalance;
                        // this.lock = false;
                    });

                    hub.led('green');
                });                
            });
        });
    }
}