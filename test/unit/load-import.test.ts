import loader, {Loader} from '../../src/sspa/lib/LoadImport'
import {getAppNames} from 'single-spa'

test('注册子应用', () => {
  const appName = 'test'
  loader.register(appName)
  expect(getAppNames()).toContain(appName)
})