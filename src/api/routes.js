const sendMessageController = require("./controllers/sendMessageController")

async function routes(fastify, options) {
    // Rota de Health Check
    fastify.get("/", async (request, reply) => {
        return { status: "ok", message: "HermesCore API is running" }
    })

    // --- Endpoints para Envio de Mensagem ---
    fastify.post("/send/text", sendMessageController.sendMessage)
    fastify.post("/send/media", sendMessageController.sendMedia)

    // --- Endpoint para Webhook ---
    // POST /webhook/message
}

module.exports = routes
