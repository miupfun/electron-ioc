import {Container, interfaces} from 'inversify';
import 'reflect-metadata';

export class MiupApplication {
    public static container = new Container({
        skipBaseClassChecks: true,
        defaultScope: 'Singleton',
        autoBindInjectable: true
    });

    constructor() {
    }

    get<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T {
        return MiupApplication.container.get(serviceIdentifier);
    }

    start() {
    }
}

export class MiupApplicationFactory {
    static create(module: any): MiupApplication {
        return new MiupApplication();
    }
}

export class BaseModule {
    components?: Array<any>;
    services?: Array<any>;
    routes?: Array<any>;
    views?: Array<any>;
}
