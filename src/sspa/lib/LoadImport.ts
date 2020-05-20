import comNames from './ComponentsName'
import { registerApplication, start, ActivityFn } from 'single-spa'
import isActive from './ActivityFunctions'
import EventBus from './EventBus'
import ActivesApp from './ActivesApp'
const headElement = document.querySelector('head')

export interface SSpaConfig {
    // 活跃数限制
    activesLimit?: number
    // 状态机
    store?: any
}

export interface RegisterConfig extends SSpaConfig {
    // 保持活跃
    keepAlive?: boolean
    // 挂载在某个父节点下
    parent?: HTMLElement
    // 事件总站
    eventBus?: EventBus
    // 活跃管理
    activesApp?: ActivesApp
}

class Loader {
    private static isStarted = false
    constructor() {
        /**
         * @description: 初始化时写入importmap，并启动single-spa
         * @author: EveChee
         */
        // 暂未找到支持
        // this.initScriptImport()
        if (!Loader.isStarted) {
            start()
            Loader.isStarted = true
        }
    }

    /**
     * @description: 注册应用
     * @param {namespace 简称或全称}
     * @param {other 对应要传给子模块的属性}
     * @return: Promise
     * @author: EveChee
     */
    register(namespace: string, other?: RegisterConfig) {
        const name = comNames[namespace] || namespace
        const afn = isActive[namespace] || this.routeMatch(namespace)
        return registerApplication(
            name,
            () => this.configurableLoad({ el: `#${name}`, name, parent: other?.parent }),
            afn,
            other,
        )
    }

    routeMatch(namespace: string): ActivityFn {
        return (location) => location.pathname.startsWith(`/${namespace}`)
    }

    /**
     * @description: 配置化加载
     * @param {config:DynamicLoadConfig 加载的参数配置}
     * @return: Promise<Module>
     * @author: EveChee
     */
    configurableLoad({ el, name, parent }: DynamicLoadConfig) {
        const life = System.import(name)
        if (el && !document.querySelector(el)) {
            const ele = Loader.createElement('div', [['id', el.substr(1)]])
            if (parent && !parent.querySelector(el)) {
                // 如果目标父节点没有此子节点则生成
                parent.appendChild(ele)
            } else {
                document.body.appendChild(ele)
            }
        }
        return life.then(({ vueLifeCycles }) => {
            return vueLifeCycles({ el, namespace: name })
        })
    }

    /**
     * @description: 自动写入system-importmap
     * @param {type}
     * @return:
     * @author: EveChee
     */
    // initScriptImport() {
    //   const script = Loader.createElement('script', [
    //     ['type', 'systemjs-importmap'],
    //   ])
    //   script.innerText = JSON.stringify({
    //     imports: Object.assign(fixedModulesJson, modulesJson),
    //   })
    //   headElement?.appendChild(script)
    // }

    public static createElement(dom: string, props?: Array<any[]>): DynamicElement {
        const element: DynamicElement = document.createElement(dom)
        props?.forEach(([key, val]: any) => (element[key] = val))
        return element
    }
}
const loader = new Loader()

export default loader

export interface DynamicElement extends HTMLElement {
    [key: string]: any
}
export interface DynamicLoadConfig {
    // 挂载节点
    el?: string
    // 模块唯一名
    name: string
    // 特定挂载父级下
    parent?: HTMLElement
}
