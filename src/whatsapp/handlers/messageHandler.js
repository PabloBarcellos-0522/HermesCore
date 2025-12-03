const externalRequest = require("../../services/externalRequest")
const config = require("../../config/env")

async function handleIncomingMessage(message) {
    console.log("Incoming Message:", message.body)
    console.log("From:", message.from)

    if (config.externalApiUrl) {
        try {
            await externalRequest.post("/", {
                from: message.from,
                to: message.to,
                body: message.body,
                type: message.type,
                timestamp: message.timestamp,
                hasMedia: message.hasMedia,
            })
            console.log("Webhook sent for incoming message.")
        } catch (error) {
            console.error("Error sending webhook for incoming message:", error.message)
        }
    }

    // Detecção e processamento de comando
    if (message.body.startsWith("!")) {
        const command = message.body.split(" ")[0].toLowerCase()
        const args = message.body.substring(command.length).trim()
        console.log(`Command detected: ${command} with args: ${args}`)

        // 1. Lida com comandos fixos/internos
        if (command === "!ajuda") {
            const availableCommands = config.externalApiCommands.join("\n- ")
            return `Comandos disponíveis:\n- !ajuda\n- ${availableCommands}`
        }

        if (config.externalApiCommands.includes(command)) {
            try {
                const route = command.replace("!", "")
                const response = await externalRequest.get(`/${route}?args=${args}`)

                const replyText =
                    response.data.data || "A API externa não retornou uma resposta válida."
                return replyText
            } catch (error) {
                console.error(`Error processing ${command} command:`, error.message)
                return `Ocorreu um erro ao processar o comando ${command}.`
            }
        }

        return `Comando "${command}" não reconhecido. Digite !ajuda para ver os comandos.`
    }

    return null
}

module.exports = {
    handleIncomingMessage,
}
