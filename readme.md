### 1  启动


```typescript

// bootstrap.ts

async function bootstrap() {
    // 设置插件
    const miupContainer = MiupApplicationFactory.create(AppModule);
    miupContainer.start();
}

bootstrap().then();

```


### 2 主模块

```typescript

// app.module.ts 
@MiupModule({
    components: [
        AppLogger,
    ],
    services: [
        AppService,
    ],
    views: [
        ConnectView,
    ],
    routes: [
        AppRoute,
    ]
})
export class AppModule extends BaseModule {

}

```


### 3 service

```typescript

@MiupInjectable()
export class AppService {
    @MiupInject(AppLogger) logger: AppLogger;

    async setMenu() {
        const template: Array<MenuItemConstructorOptions> = [
            {
                label: AppConfig.appName,
                submenu: [
                    {
                        label: '关于',
                        click: () => {
                            this.logger.debug('AppService:[setMenu]:关于');
                            ipcMain.emit('show_about_window');
                        }
                    },
                    {
                        label: '退出',
                        click: () => {
                            this.logger.debug('AppService:[setMenu]:退出软件');
                            ipcMain.emit('exit_app');
                        }
                    }
                ]

            }
        ];
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }

    async setAppUserModelId() {
        app.setAppUserModelId(AppConfig.appId);
    }

    async printBanner() {
        const info = CommonUtil.runTimeInfo();
        this.logger.debug(`============================================================`);
        this.logger.debug(`============================================================`);
        this.logger.debug(`============================================================`);
        this.logger.debug(`================electron版本：${info.electronVersion}`);
        this.logger.debug(`================chrome内核版本：${info.chromeVersion}`);
        this.logger.debug(`================结构：${info.arch}`);
        this.logger.debug(`================源码路径：${info.basePath}`);
        this.logger.debug(`================执行路径：${info.cwdPath}`);
        this.logger.debug(`============================================================`);
        this.logger.debug(`============================================================`);
        this.logger.debug(`.`);
        this.logger.debug(`.`);
        this.logger.debug(`.`);
        this.logger.debug(`.`);
    }
}
```


### 4 controller



- MiupElectronAppOn

- MiupElectronIpcMainOn

- MiupSchedule

```typescript

@MiupInjectable()
export class AppRoute {
    @MiupInject(AppLogger) logger: AppLogger;
    @MiupInject(ConnectView) connectView: ConnectView;
    @MiupInject(ScreenView) screenView: ScreenView;
    @MiupInject(SocketServer) socketServer: SocketServer;
    @MiupInject(AppUpdateService) appUpdateService: AppUpdateService;
    @MiupInject(AppService) appService: AppService;


    @MiupElectronAppOn('ready')
    async startInformation() {
        await this.appService.printBanner();

        // 设置menu
        await this.appService.setMenu();
        // 设置用户模型ID
        await this.appService.setAppUserModelId();

        // 显示连接窗口
        await this.connectView.init();
        this.connectView.instance.once('ready-to-show', () => {
            this.connectView.show();
            this.connectView.instance.webContents.openDevTools();
        });

        this.connectView.instance.on('close', () => {
            ipcMain.emit('exit_app');
        });
        this.connectView.instance.focus();
        this.logger.debug('显示连接窗口');
        // 注册websocket事件
    }

    @MiupElectronIpcMainOn('exit_app')
    async exitApp() {
        this.logger.debug('退出软件');
        app.exit();
    }
}

```
