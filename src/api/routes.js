async function routes(fastify, options) {
    // Rota de Health Check
    fastify.get("/", async (request, reply) => {
        return { status: "ok", message: "HermesCore API is running" }
    })

    // --- Endpoints para Envio de Mensagem ---
    // POST /send-text
    // POST /send-image
    // POST /send-file

    // --- Endpoint para Webhook ---
    // POST /webhook/message
}

module.exports = routes
