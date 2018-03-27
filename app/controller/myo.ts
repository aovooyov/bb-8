import { Helper } from './helper';
import { throttle } from 'lodash';
import * as MYO from 'myo';

export class Myo {

    private connection;
    private quanternion;

    public vector;

    constructor(private bb8: any) {
        this.connection = MYO;
    }

    init() {
        this.connection.connect('com.localhost.myo', require('ws'));
        this.connection.on('connected', () => {
            console.log('connected!', this.connection.id)
        });

        // this.connection.on('accelerometer', function(data) {
        //     console.log('accelerometer!', data)
        // });

        this.vector = throttle(quanternion => {
            console.log(quanternion);
            if(!quanternion) {
                return;
            }

            var horizontalComponent = Math.sin(Helper.yaw(quanternion)) * Math.cos(Helper.pitch(quanternion));
            var verticalComponent = Math.sin(Helper.pitch(quanternion));
            var rawTheta = Helper.roll(this.connection.myos[0].orientationOffset);
            var vector = {
                x: Math.sin(rawTheta) * verticalComponent - Math.cos(rawTheta) * horizontalComponent,
                y: Math.cos(rawTheta) * verticalComponent + Math.sin(rawTheta) * horizontalComponent,
                theta: Math.sin(Helper.roll(quanternion))
            };

            console.log(vector);
        })

        this.connection.on('orientation', (quanternion) => {
            this.vector(quanternion);
        });
    }    
}