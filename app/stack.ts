
export interface IStackItem {
    delay: number;
    callback: () => void;
    message?: string;
}

export class Stack {

    private _stack: IStackItem[];
    private _debug: boolean;

    constructor() { 
        this._stack = [];
        this._debug = true;
    }

    push(delay: number, callback: () => void, message?: string) {
        this._stack.push(<IStackItem>{ delay: delay, callback: callback, message: message });
    }

    start(message?: string) {
        this.debug(message);
        this.next();
    }

    listen() {
        setInterval(() => {
            var item = <IStackItem>this._stack.shift();
            if(!item) {
                return;
            }

            setTimeout(() => {
                item.callback();
            }, item.delay);
        }, 500);
    }

    clear() {
        this._stack.splice(0, this._stack.length);
    }

    private next() {
        var item = <IStackItem>this._stack.shift();

        if(!item) {
            return;
        }

        this.debug(item.message);

        setTimeout(() => {
            item.callback();
            this.next();
        }, item.delay);
    }

    debug(message: string) {
        if(!this._debug) {
            return;
        }

        console.log(message);
    }
} 

// stack.push(0, () => my.bb8.color(0xfc083d), 'color 0xfc083d');
// stack.push(delay, () => my.bb8.color(0x0830fc), 'color 0x0830fc');
// stack.push(delay, () => my.bb8.color(0x4077a6), 'color 0x4077a6');
// stack.push(delay * 2, () => {
//     my.bb8.roll(0, 180);
//     my.bb8.roll(0, 180);
// }, 'roll 180 & 180');
// stack.push(delay, () => my.bb8.color(0x2d9c52), 'color 0x2d9c52');
// stack.push(delay, () => my.bb8.color(0xd8e41e), 'color 0xd8e41e');
// stack.push(delay, () => my.bb8.randomColor(), 'color random');
// stack.push(delay, () => {
//     my.bb8.spin();
// }, 'spin');
// stack.push(delay, () => my.bb8.stop(), 'stop');
// stack.push(delay * 2, () => my.bb8.roll(0, 180), 'roll 180');
// stack.push(delay * 2, () => my.bb8.roll(0, 180), 'roll 180');

// stack.push(delay, my.bb8.randomColor, 'color random');
// stack.push(delay, my.bb8.randomColor, 'color random');
// stack.push(delay, my.bb8.randomColor, 'color random');
// stack.push(delay, my.bb8.randomColor, 'color random');
// stack.push(delay, my.bb8.randomColor, 'color random');
// stack.push(delay, my.bb8.randomColor, 'color random');
// stack.push(delay, my.bb8.randomColor, 'color random');
// stack.push(delay, my.bb8.randomColor, 'color random');
// stack.push(delay, my.bb8.randomColor, 'color random');
// stack.push(delay, my.bb8.randomColor, 'color random');
//stack.push(delay, my.bb8.randomColor, 'color random');

// stack.push(delay, () => my.bb8.roll(60, 0), 'roll 60');

// // stack.push(delay, () => my.bb8.spin('left', 0), 'spin left');
// // stack.push(delay, () => my.bb8.spin('right', 0), 'spin right');
//stack.push(delay, my.bb8.stop, 'stop');      
//stack.start('start');