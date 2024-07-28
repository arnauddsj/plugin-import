import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { FastifyInstance } from 'fastify'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
          if (!manifest.name || !manifest.version) {
            console.warn(`Invalid manifest for plugin ${folder}: missing name or version`)
            continue
          }
          if (manifest.serverEntry) {
            const serverEntryPath = path.join(pluginDir, folder, manifest.serverEntry)
            const serverModule = await import(serverEntryPath)
            if (typeof serverModule.default === 'function') {
              await serverModule.default(fastify)
              console.log(`Loaded plugin: ${manifest.name}`)
            } else {
              console.warn(`Plugin ${manifest.name} has no default export in server entry`)
            }
          } else {
            console.log(`Plugin ${manifest.name} has no server-side component`)
          }
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