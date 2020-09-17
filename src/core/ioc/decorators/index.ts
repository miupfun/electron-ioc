import {injectable} from 'inversify';
import getDecorators from 'inversify-inject-decorators';
import {MiupApplication} from '../miupApplication';

const {lazyInject} = getDecorators(MiupApplication.container, false);

export function MiupInjectable(injectKey?: any): ClassDecorator {
    return (target) => {
        const injectableFunction: ClassDecorator = injectable();
        injectableFunction(target);
    };
}

export function MiupInject(injectKey: any) {
    return (target, propertyKey, index?: number) => {
        const injectFunction: (target, propertyKey) => void = lazyInject(injectKey);
        injectFunction(target, propertyKey);
    };
}

export function MiupModule(config: ModuleConfig): ClassDecorator {
    return (target) => {
    };
}

export class ModuleConfig {
    components?: Array<any>;
    services?: Array<any>;
    routes?: Array<any>;
    views?: Array<any>;
    modules?: Array<any>;
}
