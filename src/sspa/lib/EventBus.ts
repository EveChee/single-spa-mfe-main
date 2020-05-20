/* eslint-disable */
window.requestAnimationFrame = (function() {
  return window.requestAnimationFrame
  // Older versions Chrome/Webkit
  window.webkitRequestAnimationFrame ||
    // Firefox < 23
    (<any>window).mozRequestAnimationFrame ||
    // opera
    (<any>window).oRequestAnimationFrame ||
    // ie
    (<any>window).msRequestAnimationFrame ||
    function(callback) {
      return window.setTimeout(callback, 1000 / 60)
    }
})()

window.cancelAnimationFrame = (function() {
  return (
    window.cancelAnimationFrame ||
    (<any>window).mozCancelAnimationFrame ||
    (<any>window).cancelRequestAnimationFrame ||
    function(id) {
      clearTimeout(id)
    }
  )
})()
export default class EventBus {
  // 事件池
  eventCollection: EventPool = {}
  // 注册事件监听
  register(name: eventName, callback: eventFn) {
    const callbacks = this.eventCollection[name]
    if (!callbacks) {
      this.eventCollection[name] = [callback]
    } else {
      callbacks.push(callback)
    }
    return this
  }
  // 取消事件监听
  cancel(name: eventName, callback: eventFn) {
    const callbacks = this.eventCollection[name]
    if (callbacks && callbacks.length) {
      const index = callbacks.indexOf(callback)
      if (index < 0) return this
      callbacks.splice(index, 1)
    }
    return this
  }
  // 触发事件
  dispatch(name: eventName, opts?: any) {
    const callbacks = this.eventCollection[name]
    if (!callbacks) return this
    let i = 0,
      len = callbacks.length
    if (!len) return this
    const rid = requestAnimationFrame(function () {
      if (i >= len) return cancelAnimationFrame(rid)
      callbacks[i](opts)
      i++
    })
    return this
    // while (i < len) {
    //   callbacks[i](opts)
    //   i++
    // }
  }
}

type eventName = string
type eventFn = Function
interface EventPool {
  [propName: string]: Array<eventFn>
}
