/* eslint-disable */
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame
    // Older versions Chrome/Webkit
    window.webkitRequestAnimationFrame ||
        // Firefox < 23
        (<any>window).mozRequestAnimationFrame ||
        // opera
        (<any>window).oRequestAnimationFrame ||
        // ie
        (<any>window).msRequestAnimationFrame ||
        function (callback) {
            return setTimeout(callback, 1000 / 60)
        }
})()

window.cancelAnimationFrame = (function () {
    return (
        window.cancelAnimationFrame ||
        (<any>window).mozCancelAnimationFrame ||
        (<any>window).cancelRequestAnimationFrame ||
        function (id) {
            clearTimeout(id)
        }
    )
})()
export default class EventBus {

    // 事件池
    eventPool: EventPool = {}

    // 注册事件监听
    register(name: eventName, callback: eventFn) {
        const callbacks = this.eventPool[name]
        if (!callbacks) {
            this.eventPool[name] = [callback]
        } else {
            callbacks.push(callback)
        }
        return this
    }
    // 取消事件监听
    cancel(name: eventName, callback: eventFn) {
        const callbacks = this.eventPool[name]
        if (callbacks && callbacks.length) {
            const index = callbacks.indexOf(callback)
            if (index < 0) return this
            callbacks.splice(index, 1)
        }
        return this
    }
    /**
     * @description: 触发事件
     * @param {name: eventName 事件名}
     * @param {opts?: any 传递的参数}
     * @return: Promise
     * @author: EveChee
     */
    dispatch(name: eventName, opts?: any): Promise<any> {
        const callbacks = this.eventPool[name]
        if (!callbacks) return Promise.reject(new Error('callbacks is empty'))
        let i = 0,
            len = callbacks.length
        if (!len) return Promise.reject(new Error('callbacks is empty'))
        return new Promise(function (resolve, reject) {
            const rid = requestAnimationFrame(function () {
                if (i >= len) {
                    cancelAnimationFrame(rid)
                    return resolve(true)
                }
                callbacks[i](opts)
                i++
            })
        })
    }
}

type eventName = string
type eventFn = Function
interface EventPool {
    [propName: string]: Array<eventFn>
}
