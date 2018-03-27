//node ./node_modules/cylon-joystick/bin/cylon-joystick-explorer
//sudo DEBUG=* ./node_modules/cylon-ble/bin/blescan.js

import { Xbox } from '../controller/xbox';

export class BB8 {
    private chalk = require('chalk');

    private speed: number = 80;
    private orientation: number = 0;
    private angle: number = 0;
    private pos: any = { x: 0, y: 0 };
    private toggleCalibration: boolean = false;

    constructor() {

    }

    init() {
        const cylon = require('cylon');

        cylon.robot({
            connections: {
                bb8: { adaptor: 'central', uuid: '9f032a6fe2024b3ca524d233ae138093', module: 'cylon-ble' }
            },
            devices: {
                bb8: { driver: 'bb8', module: 'cylon-sphero-ble' }
            },
            work: function (my) {
                const xbox = new Xbox();                
                
                
            }
        }).start();
    }
}





// var date = new Date(2017, 4, 3, 14, 3, 24);

// console.log(date);
// console.log((date.getTime() * 10000) + 621355968000000000);

// console.log(new Date((636294170040000000 / 10000) - 621355968000000000));

// private speed: number = 80;
    // private orientation: number = 0;
    // private angle: number = 0;
    // private pos: any = { x: 0, y: 0 };
    // private toggleCalibration: boolean = false;

    // public stop;
    // public move;
    // public turn;
    // public color;
    // public calibration;
    // init() {

    //     this.stop = throttle(() => {
    //         console.log('[BB8] Stop movement');

    //         this.speed = 0;
    //         this.orientation = 0;

    //         this.bb8.roll(this.speed, this.orientation, 0, () => { });
    //         this.bb8.stop();
    //     }, this.delay);

    //     this.move = throttle(() => {
    //         console.log('[BB8] Move', this.speed, this.orientation);

    //         this.orientation = Helper.getAngle(this.pos.x, this.pos.y);
    //         Helper.getRadius(this.pos.x, this.pos.y);

    //         this.bb8.roll(this.speed, this.orientation, 1, () => { });
    //     }, this.delay, { 'trailing': false });

    //     this.turn = throttle(() => {
    //         console.log('[BB8] Turn', this.angle);
    //         if (orientation == this.angle) { return void 0; }

    //         this.bb8.roll(0, this.angle, 1, () => { });
    //     }, this.delay);

    //     this.color = throttle(() => {
    //         this.bb8.randomColor();
    //     }, this.delay, { 'trailing': false });

    //     this.calibration = throttle(() => {
    //         if (this.toggleCalibration) {
    //             this.bb8.randomColor();
    //             this.bb8.finishCalibration();
    //             this.toggleCalibration = false;
    //         }
    //         else {
    //             this.bb8.color(0xfc083d);
    //             this.bb8.startCalibration();
    //             this.toggleCalibration = true;
    //         }
    //     }, this.delay, { 'trailing': false });
    // }

    // bind1() {
    //     this.controller = require('xbox-controller-node');

    //     this.controller.HIDConfig.controlBtnsBlock = 14;
    //     this.controller.HIDConfig.directionalBtnsBlock = 13;     

    //     this.controller.HIDController.on('data', (data) => {
    //         // console.log(data[9]);
    //         let position = data[11];
    //         this.speed = ~~(position * 50);
    //     });

    //     this.controller.on('leftstickMove', (position) => {

    //         // const inRangeX = positionInRange(position.x, 0.3);
    //         // const inRangeY = positionInRange(position.y, 0.3);

    //         // if (!(inRangeX && inRangeY)) { return void 0; }

    //         // if (position.x > 190 || position.y > 190) {
    //         //     return;
    //         // }

    //         //orientation = getAngle(position.x, position.y);
    //         //speed = convertPositionToSpeed(position);
    //         // let radius = getRadius(position.x, position.y);
    //         // console.log('radius', radius);

    //         if (Helper.getRadius(position.x, position.y) < 60) {
    //             return;
    //         }

    //         this.pos = position;
    //         this.move();
    //     });

    //     // this.controller.on('rightstickMove', function (position) {
    //     //     // const inRange = positionInRange(position, 0.3);
    //     //     // if (!inRange) { return void 0; }

    //     //     angle = getAngle(position.x, position.y);
    //     //     throttleTurn();
    //     // });

    //     this.controller.on('a', () => this.color());
    //     this.controller.on('b', () => this.stop());
    //     this.controller.on('y', () => this.calibration());
    //     this.controller.on('x', () => {
    //         console.log('[X] button press');
    //     });

    //     this.controller.on('left', () => {
    //         throttle(() => {
    //             console.log('[LEFT] roll +45');

    //             this.angle += 45;
    //             if (this.angle >= 360) {
    //                 this.angle = 0;
    //             }

    //             this.turn();
    //         }, this.delay);
    //     });

    //     this.controller.on('right', () => {
    //         throttle(() => {
    //             console.log('[RIGHT] roll -45');

    //             this.angle -= 45;
    //             if (this.angle <= 0) {
    //                 this.angle = 359;
    //             }

    //             this.turn();
    //         }, this.delay);
    //     });
    // }