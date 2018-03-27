export class Debug {
    private chalk = require('chalk');

    public tint: string = '#00a4ce';
    public color: string = '#e4703c';
    public outs: any[] = [];

    constructor(private category: string) {
        
    }

    out(): any {
        return console.draft();
    }

    log(message: string, data: any): any {
        return this.chalk.hex(this.tint)(`[${this.category}] `) + this.chalk.hex(this.color)(`${message} ${JSON.stringify(data)}`);
    }
}