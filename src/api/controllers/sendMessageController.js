// const whatsappClient = require('../../whatsapp/client'); // Será importado aqui mais tarde

const sendMessage = async (request, reply) => {
    const { number, message } = request.body;

    if (!number || !message) {
        reply.code(400).send({ error: 'Bad Request', message: 'Missing "number" or "message" in request body.' });
        return;
    }

    // TODO: Adicionar lógica real de envio via whatsappClient
    // Ex: await whatsappClient.sendText(number, message);

    reply.code(200).send({ status: 'success', message: `Message to ${number} scheduled: "${message}"` });
};

const sendMedia = async (request, reply) => {
    const { number, fileUrl, caption } = request.body;

    if (!number || !fileUrl) {
        reply.code(400).send({ error: 'Bad Request', message: 'Missing "number" or "fileUrl" in request body.' });
        return;
    }

    // TODO: Adicionar lógica real de envio de mídia via whatsappClient
    // Ex: await whatsappClient.sendMedia(number, fileUrl, caption);

    reply.code(200).send({ status: 'success', message: `Media to ${number} from ${fileUrl} scheduled` });
};

module.exports = {
    sendMessage,
    sendMedia,
};
