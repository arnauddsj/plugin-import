import { App } from 'vue'
import { Router, RouteRecordRaw } from 'vue-router'
import type { Component } from 'vue'

interface PluginManifest {
  name: string
  version: string
  clientEntry: string
  routes?: Array<{
    path: string
    component: string
  }>
  components?: Array<string>
}

export class PluginLoader {
  private plugins: PluginManifest[] = []

  async loadPlugins(app: App, router: Router) {
    const pluginRegistry = await import('./pluginRegistry.json')

    const manifestModules = import.meta.glob('../../plugins/*/manifest.json')
    const clientModules = import.meta.glob('../../plugins/*/client.ts')
    const componentModules = import.meta.glob('../../plugins/**/components/*.vue')

    console.log('Available component modules:', Object.keys(componentModules))

    for (const pluginName of pluginRegistry.plugins) {
      const manifestPath = `../../plugins/${pluginName}/manifest.json`
      const manifestModule = manifestModules[manifestPath]
      if (!manifestModule) {
        console.warn(`Manifest not found for plugin: ${pluginName}`)
        continue
      }

      const manifest = await manifestModule() as { default: PluginManifest }
      this.plugins.push(manifest.default)

      const clientPath = `../../plugins/${pluginName}/${manifest.default.clientEntry}`
      const clientModule = clientModules[clientPath]
      if (clientModule) {
        const { setup } = await clientModule() as { setup: (app: App) => void }
        setup(app)
      }

      // Register routes if the plugin has any
      if (manifest.default.routes) {
        for (const route of manifest.default.routes) {
          const possiblePaths = [
            `../../plugins/${pluginName}/${route.component}`,
            `../../plugins/${pluginName}/src/${route.component}`,
            `../../plugins/${pluginName}/components/${route.component}`,
          ]

          let componentPath = possiblePaths.find(path => componentModules[path])

          console.log(`Trying to load component from: ${componentPath}`)

          if (componentPath && componentModules[componentPath]) {
            const newRoute: RouteRecordRaw = {
              path: route.path,
              component: () => componentModules[componentPath!]().then(m => m.default as Component)
            }
            router.addRoute(newRoute)
            console.log(`Added route: ${route.path}`)
          } else {
            console.warn(`Component not found: ${route.component}`)
            console.log('Available paths:', Object.keys(componentModules))
          }
        }
      }

      // Register components if the plugin has any
      if (manifest.default.components) {
        for (const componentName of manifest.default.components) {
          const componentPath = `../../plugins/${pluginName}/components/${componentName}.vue`
          const componentModule = componentModules[componentPath]
          if (componentModule) {
            componentModule().then(module => {
              app.component(componentName, module.default as Component)
              console.log(`Registered component: ${componentName}`)
            })
          } else {
            console.warn(`Component module not found: ${componentPath}`)
          }
        }
      }
    }

    console.log('Registered routes:', router.getRoutes())
  }
}