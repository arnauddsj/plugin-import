import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { PluginLoader } from './pluginLoader'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()
const fastify = Fastify({
  logger: true
})

const pluginLoader = new PluginLoader()

const start = async () => {
  try {
    await pluginLoader.loadPlugins(path.join(__dirname, '../../plugins'), fastify)

    await fastify.register(cors, {
      origin: true
    })

    fastify.get('/', async (request, reply) => {
      const assets = await prisma.asset.findMany()
      return { assets }
    })

    fastify.post('/assets', async (request, reply) => {
      const { name, type } = request.body as { name: string; type: string }
      const asset = await prisma.asset.create({
        data: { name, type }
      })
      return asset
    })

    await fastify.listen({ port: 3000 })
    console.log('Server is running on http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()