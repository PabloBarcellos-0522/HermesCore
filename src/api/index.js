const fastify = require("fastify")({ logger: true })
const config = require("../config/env")
const routes = require("./routes")
const { AppError } = require("../utils/errors")
const { sendError } = require("../utils/response")

const server = fastify

server.register(routes)

server.setErrorHandler((error, request, reply) => {
    server.log.error(error)

    if (error instanceof AppError) {
        return sendError({
            reply,
            statusCode: error.statusCode,
            message: error.message,
        })
    }

    return sendError({
        reply,
        statusCode: 500,
        message: "An unexpected error occurred on the server.",
    })
})

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
