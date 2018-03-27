import { Helper } from './helper';
import { throttle } from 'lodash';
import { EventEmitter } from 'events';

export class Xbox extends EventEmitter {

    private controller: any;
    private delay: number = 100;
    private debug: boolean = false;

    private buttons: string[] = ['x', 'y', 'a', 'b', 'lb', 'rb', 'left', 'up', 'right', 'top', 'down'];
    
    private buttonThrottle: any;
    private stickThrottle: any;

    private leftStick = { x: 0, y: 0 };
    private rightStick = { x: 0, y: 0 };

    private leftTrigger = { x: 0 };
    private rightTrigger = { x: 0 };

    constructor() {
        super();
        this.init();
    }

    init() {
        this.controller = require('../../xbox-controller-node/lib/xbox-controller');

        this.buttonThrottle = throttle(button => {
            if(this.debug) {
                console.log('[xbox]: ', button);
                return;
            }

            this.emit(button);
        }, this.delay);

        this.stickThrottle = throttle((stick, position) => {
            if (this.debug) {
                console.log('[xbox]: ', stick, position);
                return;
            }

            this.emit(stick, position);
        }, this.delay);

        this.buttons.forEach(button => {
            this.controller.on(button, () => {
                this.buttonThrottle(button);
            });

            this.controller.on(`${button}:release`, () => {
                this.buttonThrottle(`${button}:release`);
            });
        });

        this.controller.on('leftstickMove', data => {

            if (this.leftStick.x == data.x && this.leftStick.y == data.y) {
                return;
            }

            this.leftStick = data;
            this.stickThrottle('lstick', this.leftStick);
        });

        this.controller.on('rightstickMove', data => {
            if (this.rightStick.x == data.x && this.rightStick.y == data.y) {
                return;
            }

            this.rightStick = data;
            this.stickThrottle('rstick', this.rightStick);
        });

        this.controller.on('lefttriggerMove', data => {
            if (this.leftTrigger.x == data.x) {
                return;
            }

            this.leftTrigger = data;
            this.stickThrottle('lt', this.leftTrigger);
        });

        this.controller.on('righttriggerMove', data => {
            if (this.rightTrigger.x == data.x) {
                return;
            }

            this.rightTrigger = data;
            this.stickThrottle('rt', this.rightTrigger);
        });
    }
}