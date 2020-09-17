import {BrowserWindow, BrowserWindowConstructorOptions} from 'electron';
import {WindowException} from './exceptions';

export class MiupElectronWindowManager implements MiupElectronWindowManagerInterface {

    private _instance: BrowserWindow;

    async init(config?: WindowInitConfig): Promise<void> {
        this._instance = new BrowserWindow(config);
        await this._instance.loadURL(config.url);
    }

    get instance(): BrowserWindow {
        return this._instance;
    }

    public destroy() {
        if (this.isDestroy()) {
            return;
        }
        this.instance.close();
        this.instance.destroy();
        this._instance = null;
    }

    public show() {
        this.isDestroy();
        this.instance.show();
    }

    public close() {
        this.isDestroy();
        this.instance.close();
    }

    public hide() {
        this.isDestroy();
        this.instance.hide();
    }

    public focus() {

        this.instance.focus();
    }

    public blur() {
        this.isDestroy();
        this.instance.blur();
    }

    public isDestroy(): boolean {
        if (!this.instance) {
            return false;
        }
        return this._instance.isDestroyed();
    }

    private _isDestroy() {
        if (this.isDestroy()) {
            throw new WindowException('window instance is destroy');
        }
    }
}

export interface MiupElectronWindowManagerInterface {

    init(config?: WindowInitConfig): void

    destroy(): void

    isDestroy(): boolean
}

export interface WindowInitConfig extends BrowserWindowConstructorOptions {
    url: string
}
