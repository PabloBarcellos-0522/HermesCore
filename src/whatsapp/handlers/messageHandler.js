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

    let fromNumber = message.from // Default to original from
    try {
        const contact = await message.getContact()
        if (contact.number) {
            fromNumber = contact.number
        }
    } catch (error) {
        logger.warn(
            { err: error, from: message.from },
            "Could not get contact for webhook, using message.from"
        )
    }

    try {
        // This sends a copy of every message to the external API for logging or other purposes.
        await externalRequest.post("/", {
            from: fromNumber,
            to: message.to,
            body: message.body,
            type: message.type,
            timestamp: message.timestamp,
            hasMedia: message.hasMedia,
        })
        logger.debug(
            { from: fromNumber, body: message.body },
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

    sendIncomingMessageWebhook(message)

    if (!message.body.startsWith("!")) {
        return null
    }

    const command = message.body.split(" ")[0].toLowerCase()
    const args = message.body.substring(command.length).trim()

    let from
    try {
        const contact = await message.getContact()
        from = contact.number
    } catch (error) {
        logger.error(
            { err: error, from: message.from },
            "Could not get contact details via getContact()."
        )

        if (message.from.endsWith("@c.us")) {
            from = message.from.replace("@c.us", "")
            logger.warn({ from }, "Falling back to number from message.from for @c.us contact.")
        } else {
            logger.error(
                { from: message.from },
                "Failed to get a valid sender number because it is a @lid and getContact() failed."
            )
            return "Não foi possível obter seu número de telefone para processar o comando. Tente salvar o número do bot em seus contatos e tente novamente."
        }
    }

    if (!from) {
        logger.warn({ from: message.from }, "Could not determine a valid 'from' number.")
        return `Não foi possível identificar seu número. Comando "${command}" não pôde ser processado.`
    }

    logger.info({ command, args, from }, "Command received.")

    if (command === "!ajuda") {
        const availableCommands = config.externalApiCommands.join("\n- ")
        return `Comandos disponíveis:\n- !ajuda\n- ${availableCommands}`
    }

    if (config.externalApiCommands.includes(command)) {
        const reply = await commandService.execute(command.substring(1), args, from)
        return reply
    }

    logger.warn({ command, from: message.from }, "Unrecognized command.")
    return `Comando "${command}" não reconhecido. Digite !ajuda para ver a lista de comandos disponíveis.`
}

module.exports = {
    handleIncomingMessage,
}
