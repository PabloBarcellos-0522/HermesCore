const fastify = require("fastify")({ logger: true })
const config = require("../config/env")
const apiKeyAuth = require("./middlewares/apiKeyAuth")

const routes = require("./routes")

const server = fastify

server.addHook("preHandler", apiKeyAuth)

server.register(routes)

const start = async () => {
    try {
        await server.listen({ port: config.port, host: "0.0.0.0" })
        server.log.info(`Servidor rodando na porta ${config.port}`)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

module.exports = { start, server }
