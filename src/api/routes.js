const sendMessageController = require("./controllers/sendMessageController")
const webhookController = require("./controllers/webhookController")
const apiKeyAuth = require("./middlewares/apiKeyAuth")
const webhookAuth = require("./middlewares/webhookAuth")

async function routes(fastify, options) {
    // Rota de Health Check (sem autenticação)
    fastify.get("/", async (request, reply) => {
        return { status: "ok", message: "HermesCore API is running" }
    })

    // --- Endpoints para Envio de Mensagem (Requer API Key principal) ---
    fastify.post("/send/text", { preHandler: [apiKeyAuth] }, sendMessageController.sendMessage)
    fastify.post("/send/media", { preHandler: [apiKeyAuth] }, sendMessageController.sendMedia)

    // --- Endpoint para Webhook de Eventos (Requer Webhook Token) ---
    fastify.post(
        "/webhooks/events/register-customer",
        { preHandler: [webhookAuth] },
        webhookController.handleCustomerRegistrationEvent
    )
    fastify.post(
        "/webhooks/events/new-customer",
        { preHandler: [webhookAuth] },
        webhookController.handleNewCustomerEvent
    )
}

module.exports = routes
