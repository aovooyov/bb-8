
export class Helper {
    static roll(q) {
        return Math.atan2(2.0 * (q.y * q.z + q.w * q.x), q.w * q.w - q.x * q.x - q.y * q.y + q.z * q.z);
    }

    static pitch(q) {
        return Math.asin(-2.0 * (q.x * q.z - q.w * q.y));
    }

    static yaw(q) {
        return Math.atan2(2.0 * (q.x * q.y + q.w * q.z), q.w * q.w + q.x * q.x - q.y * q.y - q.z * q.z);
    }

    static convertXY(x, y) {
        let max = 255.0;
        let d = max / 2;
        let dx = x - d;
        let dy = y - d;

        return { x: dx, y: dy };
    }

    static getAngle(x, y) {
        let coord = this.convertXY(x, y);
        let degrees = (Math.atan2(coord.y, coord.x) / Math.PI) * 180;
        if (degrees < 0) degrees += 360;

        console.log('degress ', ~~degrees);

        return ~~degrees;
    }

    static getRadius(x, y) {
        let max = 255.0;
        let center = max / 2;

        var radius = Math.sqrt(Math.pow(x - center, 2) + Math.pow(y - center, 2)); //Math.atan2(coord.y, coord.x) * 180 / Math.PI;
        console.log('radius ', radius);
        return radius;
    }

    static convertPositionToSpeed(pos) {
        const speed = ~~((pos + 1) * 50);
        return speed;
    }

    static positionInRange(position, threshold) {
        return (Math.abs(position) > threshold);
    }
}