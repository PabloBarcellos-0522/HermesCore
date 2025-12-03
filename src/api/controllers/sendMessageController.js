const {
    sendText: sendWhatsAppText,
    sendMedia: sendWhatsAppMedia,
} = require("../../whatsapp/client")
const { sendSuccess } = require("../../utils/response")
const { BadRequestError, InternalServerError } = require("../../utils/errors")

const sendMessage = async (request, reply) => {
    const { number, message } = request.body

    if (!number || !message) {
        throw new BadRequestError('Missing "number" or "message" in request body.')
    }

    const result = await sendWhatsAppText(number, message)

    if (!result.success) {
        throw new InternalServerError(result.message)
    }

    return sendSuccess({
        reply,
        message: `Message to ${number} sent successfully.`,
    })
}

const sendMedia = async (request, reply) => {
    const { number, fileData, mimetype, filename, caption } = request.body

    if (!number || !fileData || !mimetype || !filename) {
        throw new BadRequestError(
            'Missing "number", "fileData", "mimetype", or "filename" in request body.'
        )
    }

    const result = await sendWhatsAppMedia(number, fileData, mimetype, filename, caption)

    if (!result.success) {
        throw new InternalServerError(result.message)
    }

    return sendSuccess({
        reply,
        message: `Media "${filename}" to ${number} sent successfully.`,
    })
}

module.exports = {
    sendMessage,
    sendMedia,
}
