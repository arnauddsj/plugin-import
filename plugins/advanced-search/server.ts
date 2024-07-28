import { FastifyInstance } from 'fastify'

export default async function setup(fastify: FastifyInstance) {
  fastify.get('/api/advanced-search', async (request, reply) => {
    console.log('Advanced search plugin: Received a request')
    return { results: ['Result 1 from plugin', 'Result 2 from plugin'] }
  })

  console.log('Advanced search plugin: Server-side setup complete')
}