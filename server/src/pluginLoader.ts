import fs from 'fs'
import path from 'path'
import { FastifyInstance } from 'fastify'

interface Plugin {
  name: string
  version: string
  setup: (fastify: FastifyInstance) => Promise<void>
}

export class PluginLoader {
  private plugins: Plugin[] = []

  async loadPlugins(pluginDir: string, fastify: FastifyInstance) {
    if (!fs.existsSync(pluginDir)) {
      console.warn(`Plugin directory does not exist: ${pluginDir}`)
      return
    }

    const pluginFolders = fs.readdirSync(pluginDir)

    for (const folder of pluginFolders) {
      const manifestPath = path.join(pluginDir, folder, 'manifest.json')
      if (fs.existsSync(manifestPath)) {
        try {
          const manifestContent = fs.readFileSync(manifestPath, 'utf8')
          const manifest = JSON.parse(manifestContent)

          if (!manifest.name || !manifest.version || !manifest.serverEntry) {
            console.warn(`Invalid manifest for plugin ${folder}: missing required fields`)
            continue
          }

          const setupPath = path.join(pluginDir, folder, manifest.serverEntry)
          if (!fs.existsSync(setupPath)) {
            console.warn(`Server entry file not found for plugin ${folder}`)
            continue
          }

          const pluginModule = await import(setupPath)
          if (typeof pluginModule.default !== 'function') {
            console.error(`Plugin ${folder} does not export a default function`)
            console.error('Exported module:', pluginModule)
            continue
          }

          this.plugins.push({ ...manifest, setup: pluginModule.default })
          console.log(`Plugin ${manifest.name} loaded successfully`)
        } catch (error) {
          console.error(`Error loading plugin ${folder}:`, error)
        }
      }
    }

    for (const plugin of this.plugins) {
      try {
        if (typeof plugin.setup !== 'function') {
          console.error(`Setup is not a function for plugin ${plugin.name}`)
          console.error('Plugin object:', plugin)
          continue
        }
        await plugin.setup(fastify)
        console.log(`Plugin ${plugin.name} set up successfully`)
      } catch (error) {
        console.error(`Error setting up plugin ${plugin.name}:`, error)
      }
    }
  }
}