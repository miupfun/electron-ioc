import {MiupApplication} from '../../ioc';
import * as Schedule from 'node-schedule';


export function MiupSchedule(time: any) {
    return (target: any, methodName: string, desc: PropertyDescriptor) => {
        Schedule.scheduleJob(time, () => {
            const who = MiupApplication.container.get(target.constructor);
            desc.value.apply(who);
        });
    };
}

