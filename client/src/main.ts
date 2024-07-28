import { createApp } from 'vue'
import App from './App.vue'

import { PluginLoader } from './pluginLoader'

const app = createApp(App)
const pluginLoader = new PluginLoader()

pluginLoader.loadPlugins(app).then(() => {
  app.mount('#app')
})