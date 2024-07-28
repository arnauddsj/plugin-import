import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import routes from './routes'
import { PluginLoader } from './pluginLoader'

async function initializeApp() {
  const app = createApp(App)
  const router = createRouter({
    history: createWebHistory(),
    routes: routes
  })

  app.use(router)

  const pluginLoader = new PluginLoader()
  await pluginLoader.loadPlugins(app, router)

  app.mount('#app')
}

initializeApp()