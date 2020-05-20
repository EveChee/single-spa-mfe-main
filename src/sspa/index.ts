/*
 * @Description:
 * @Version: 0.1
 * @Author: EveChee
 * @Date: 2020-05-12 09:23:27
 * @LastEditTime: 2020-05-20 19:11:26
 */
import ActivesApp from './lib/ActivesApp'
import EventBus from './lib/EventBus'
import loader, { SSpaConfig, RegisterConfig } from './lib/LoadImport'

type appName = string
// 全局标记
(<any>window).__SINGLE_SPA_MFE__ = true
/**
 * @description: sspa初始化
 * @param {config:SSpaConfig}
 * @author: EveChee
 */
export default class SSpa {
    constructor(config?: SSpaConfig) {
        this.activesApp = new ActivesApp({ limit: config?.activesLimit || 3 })
        this.store = config?.store
    }
    /* 事件总站 */
    private eventBus: EventBus = new EventBus()
    /* 活跃集成 */
    private activesApp: ActivesApp
    /* 专属状态机 */
    public store: any

    /**
     * @description: 注册应用
     * @param {name: appName}
     * @param {other?: RegisterConfig}
     * @return: Single-SPA <registerApplication>
     * @author: EveChee
     */
    register(name: appName, other?: RegisterConfig) {
        return loader.register(name, {
            eventBus: this.eventBus,
            activesApp: this.activesApp,
            store: this.store,
            ...other,
        })
    }
}
