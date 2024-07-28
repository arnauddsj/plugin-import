import { App } from 'vue'
import Dashboard from './components/Dashboard.vue'

export function setup(app: App) {
  app.component('Dashboard', Dashboard)
  console.log('Dashboard plugin initialized')
}