const commandService = require("../../services/commandService")
const externalRequest = require("../../services/externalRequest")
const config = require("../../config/env")
const logger = require("../../config/logger")

/**
 * Sends a webhook notification for every incoming message if EXTERNAL_API_URL is configured.
 * @param {import('whatsapp-web.js').Message} message The incoming message object.
 */
async function sendIncomingMessageWebhook(message) {
    if (!config.externalApiUrl) return

    try {
        // This sends a copy of every message to the external API for logging or other purposes.
        await externalRequest.post("/", {
            from: message.from,
            to: message.to,
            body: message.body,
            type: message.type,
            timestamp: message.timestamp,
            hasMedia: message.hasMedia,
        })
        logger.debug(
            { from: message.from, body: message.body },
            "Outgoing webhook sent for incoming message."
        )
    } catch (error) {
        logger.error({ err: error }, "Error sending outgoing webhook for incoming message.")
    }
}

/**
 * Handles incoming messages, routing them to the correct service or command.
 * @param {import('whatsapp-web.js').Message} message The incoming message object.
 * @returns {Promise<string|null>} A reply message or null.
 */
async function handleIncomingMessage(message) {
    logger.debug({ from: message.from, body: message.body }, "New message received.")

    // Fork the webhook sending so it doesn't block command processing.
    sendIncomingMessageWebhook(message)

    if (!message.body.startsWith("!")) {
        return null
    }

    const command = message.body.split(" ")[0].toLowerCase()
    const args = message.body.substring(command.length).trim()
    logger.info({ command, args, from: message.from }, "Command received.")

    // 1. Handle internal commands first
    if (command === "!ajuda") {
        const availableCommands = config.externalApiCommands.join("\n- ")
        return `Comandos disponíveis:\n- !ajuda\n- ${availableCommands}`
    }

    // 2. Check if it's a valid external command and delegate to the service
    if (config.externalApiCommands.includes(command)) {
        // The command service will handle the external API call and error handling.
        const reply = await commandService.execute(command.substring(1), args)
        return reply
    }

    // 3. If the command is not recognized
    logger.warn({ command, from: message.from }, "Unrecognized command.")
    return `Comando "${command}" não reconhecido. Digite !ajuda para ver a lista de comandos disponíveis.`
}

module.exports = {
    handleIncomingMessage,
}
