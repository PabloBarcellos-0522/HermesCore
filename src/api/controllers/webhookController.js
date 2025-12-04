const { sendText: sendWhatsAppText } = require("../../whatsapp/client")
const { sendSuccess } = require("../../utils/response")
const { BadRequestError, InternalServerError } = require("../../utils/errors")

const handleCustomerRegistrationEvent = async (request, reply) => {
    const { name, number, verificationCode } = request.body

    if (!name || !number || !verificationCode) {
        throw new BadRequestError(
            'Request body must contain "name", "number" and "verificationCode" for the new customer event.'
        )
    }

    const verificationMessage = `Olá ${name}, \nacho que tenho um código de verificação para você ✉🔒: ${verificationCode} \n\nNão compartilhe esse código com ninguém.`

    const result = await sendWhatsAppText(number, verificationMessage)

    if (!result.success) {
        throw new InternalServerError(result.message)
    }

    return sendSuccess({
        reply,
        message: `Welcome message sent to ${name} at ${number}.`,
    })
}

const handleNewCustomerEvent = async (request, reply) => {
    const { name, number } = request.body

    if (!name || !number) {
        throw new BadRequestError(
            'Request body must contain "name" and "number" for the new customer event.'
        )
    }

    const welcomeMessage = `${name} bem-vindo(a), \nSeu registro foi confirmado! \nEu sou o Hermes responsável por gerenciar nossas conversas daqui pra frente. \nCaso tenha alguma dúvida, pode digitar o comando !ajuda. 😊`

    const result = await sendWhatsAppText(number, welcomeMessage)

    if (!result.success) {
        throw new InternalServerError(result.message)
    }

    return sendSuccess({
        reply,
        message: `Welcome message sent to ${name} at ${number}.`,
    })
}

module.exports = {
    handleNewCustomerEvent,
    handleCustomerRegistrationEvent,
}
