const externalRequest = require("../../services/externalRequest")
const config = require("../../config/env")
const { sendText } = require("../client") // Para responder a comandos

async function handleIncomingMessage(message) {
    console.log("Incoming Message:", message.body)
    console.log("From:", message.from)

    // Enviar mensagem para uma API externa via webhook (se configurado)
    if (config.externalApiUrl) {
        try {
            await externalRequest.post("/", {
                // Envia para a baseURL configurada
                from: message.from,
                to: message.to,
                body: message.body,
                type: message.type,
                timestamp: message.timestamp,
                hasMedia: message.hasMedia,
                // Adicione mais dados da mensagem conforme necessário
            })
            console.log("Webhook sent for incoming message.")
        } catch (error) {
            console.error("Error sending webhook for incoming message:", error.message)
        }
    }

    // Exemplo básico de detecção e processamento de comando
    if (message.body.startsWith("!")) {
        const command = message.body.split(" ")[0].toLowerCase()
        const args = message.body.substring(command.length).trim()
        console.log(`Command detected: ${command} with args: ${args}`)

        if (command === "!notas") {
            try {
                // Exemplo: Chamar uma rota específica na API externa para !notas
                const response = await externalRequest.get(`/aluno/notas?ra=${args}`) // Assumindo 'args' é o RA
                const alunoNotas = response.data.notas // Supondo que a resposta da API externa tenha um campo 'notas'
                await sendText(message.from.replace("@c.us", ""), `Suas notas: ${alunoNotas}`)
            } catch (error) {
                console.error("Error processing !notas command:", error.message)
                await sendText(
                    message.from.replace("@c.us", ""),
                    "Ocorreu um erro ao buscar suas notas. Tente novamente mais tarde."
                )
            }
        } else if (command === "!ajuda") {
            await sendText(
                message.from.replace("@c.us", ""),
                "Comandos disponíveis: !notas <seu_ra>, !ajuda"
            )
        } else {
            await sendText(
                message.from.replace("@c.us", ""),
                `Comando "${command}" não reconhecido. Digite !ajuda para ver os comandos.`
            )
        }
    }
}

module.exports = {
    handleIncomingMessage,
}
