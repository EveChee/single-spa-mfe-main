/**
 * HelloWorld.test.ts
 */
import ActivesApp from '../../src/sspa/lib/ActivesApp';
const opts = {limit:3}
const activesApp = new ActivesApp(opts)
test('基础保存测试 +1', () => {
  activesApp.push('push_test')
  expect(activesApp.has('push_test')).toBe(true);
});

test('超出数量测试 +3 -1',()=>{
  for(let i = 0;i<opts.limit;i++){
    activesApp.push(`test${i}`)
  }
  expect(activesApp.has('push_test')).toBe(false);
})

test('手动删除测试 -1',()=>{
  activesApp.delete('test2')
  expect(activesApp.has('test2')).toBe(false);
})