import { App } from 'vue'

interface Plugin {
  name: string
  version: string
  setup: (app: App) => void
}

export class PluginLoader {
  private plugins: Plugin[] = []

  async loadPlugins(app: App) {
    const pluginContext = import.meta.glob('/../../plugins/*/manifest.json')

    for (const path in pluginContext) {
      const manifest = await pluginContext[path]() as Plugin
      const setupPath = `/../../plugins/${manifest.name}/${manifest.clientEntry}`
      const { default: setup } = await import(setupPath)
      this.plugins.push({ ...manifest, setup })
    }

    for (const plugin of this.plugins) {
      plugin.setup(app)
    }
  }
}
