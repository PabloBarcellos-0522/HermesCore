const {
    sendText: sendWhatsAppText,
    sendMedia: sendWhatsAppMedia,
} = require("../../whatsapp/client")

const sendMessage = async (request, reply) => {
    const { number, message } = request.body

    if (!number || !message) {
        reply.code(400).send({
            error: "Bad Request",
            message: 'Missing "number" or "message" in request body.',
        })
        return
    }

    const result = await sendWhatsAppText(number, message)

    if (result.success) {
        reply
            .code(200)
            .send({ status: "success", message: `Message to ${number} sent: "${message}"` })
    } else {
        reply.code(500).send({ status: "error", message: result.message })
    }
}

const sendMedia = async (request, reply) => {
    const { number, fileData, mimetype, filename, caption } = request.body

    if (!number || !fileData || !mimetype || !filename) {
        reply.code(400).send({
            error: "Bad Request",
            message: 'Missing "number", "fileData", "mimetype", or "filename" in request body.',
        })
        return
    }

    const result = await sendWhatsAppMedia(number, fileData, mimetype, filename, caption)

    if (result.success) {
        reply
            .code(200)
            .send({ status: "success", message: `Media to ${number} sent: "${filename}"` })
    } else {
        reply.code(500).send({ status: "error", message: result.message })
    }
}

module.exports = {
    sendMessage,
    sendMedia,
}
