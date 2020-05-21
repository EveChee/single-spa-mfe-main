import EventBus from '../../src/sspa/lib/EventBus'

const eventBus = new EventBus()
const eventName = 'test1'
const eventFun = () => console.log(123)
const eventFun2 = () => console.log(456)
eventBus.register(eventName, eventFun)
eventBus.register(eventName, eventFun2)
const events = eventBus.eventPool[eventName]

test('事件注册', () => {
    expect(Array.isArray(events)).toBe(true)
    expect(events).toContain(eventFun)
})
test('取消监听', () => {
    eventBus.cancel(eventName, eventFun)
    expect(events).not.toContain(eventFun)
})

// test('事件触发', () => {
//     expect.assertions(1)
//     expect(eventBus.dispatch(eventName)).resolves.toBe(true)
//     // expect(eventFun).toHaveBeenCalled()
//     // expect(eventFun2).toHaveBeenCalled()
// })
