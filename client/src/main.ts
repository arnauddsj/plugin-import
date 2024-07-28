import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import routes from './routes'
import { PluginLoader } from './pluginLoader'

async function initializeApp() {
  const app = createApp(App)

  // Create the router with initial routes
  const router = createRouter({
    history: createWebHistory(),
    routes: routes
  })

  // Use the router before loading plugins
  app.use(router)

  const pluginLoader = new PluginLoader()

  // Block navigation until plugins are loaded
  router.beforeEach(async (to, from, next) => {
    if (!pluginLoader.loaded) {
      // Show loading indicator
      app.config.globalProperties.$loading = true

      // Load plugins
      await pluginLoader.loadPlugins(app, router)

      // Hide loading indicator
      app.config.globalProperties.$loading = false

      // Navigate to the originally requested route
      next(to.fullPath)
    } else {
      next()
    }
  })

  // Mount the app
  app.mount('#app')
}

initializeApp().catch(error => {
  console.error('Failed to initialize the app:', error)
})