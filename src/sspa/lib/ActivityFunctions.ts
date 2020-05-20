import { ActivityFn } from 'single-spa'

interface ActivityFunctions {
  [propName: string]: ActivityFn
}

const isActive: ActivityFunctions = {
  navbar() {
    return true
  },
  tabs() {
    return true
  },
}
export default isActive
