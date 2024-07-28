import { App } from 'vue'
import Dashboard from './Dashboard.vue'

export default function setup(app: App) {
  app.component('Dashboard', Dashboard)
}