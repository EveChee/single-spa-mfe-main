import { unloadApplication, getAppNames } from 'single-spa'
interface App {
    name: string
    count: number
}
/**
 * @description: 活跃池 由主应用提供接口 自应用自由操作
 * @return: void
 * @author: EveChee
 */
export default class ActivesApp {
    constructor({ limit = 3 } = {}) {
        this.limit = limit
    }
    limit: number
    private activesPool: Array<string> = []

    /**
     * @description: 添加到活跃池 若是超过限制则释放最前一个
     * @param {appName 唯一应用名}
     * @return: void
     * @author: EveChee
     */
    push(appName: string) {
        if (this.activesPool.length >= this.limit) {
            const app = this.activesPool.shift()
            app && getAppNames().includes(app) && unloadApplication(app)
        }
        this.activesPool.push(appName)
    }

    /**
     * @description:查询活跃池中是否存在应用
     * @param {appName 唯一应用名}
     * @return: App | undefined
     * @author: EveChee
     */
    has(appName: string) {
        return !!this.activesPool.find((app) => app === appName)
    }

    /**
     * @description:释放
     * @param {appName 唯一应用名}
     * @return: void
     * @author: EveChee
     */
    delete(appName: string) {
        const index = this.activesPool.findIndex((app) => app === appName)
        if (index < 0) return false
        const app = this.activesPool.splice(index, 1)[0]
        getAppNames().includes(app) && unloadApplication(app)
    }
}
