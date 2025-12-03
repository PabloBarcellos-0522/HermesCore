const config = require('../../config/env');

async function apiKeyAuth(request, reply) {
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
        reply.code(401).send({ error: 'Unauthorized', message: 'x-api-key header is missing.' });
        return;
    }

    if (apiKey !== config.apiKey) {
        reply.code(401).send({ error: 'Unauthorized', message: 'Invalid API Key.' });
        return;
    }
}

module.exports = apiKeyAuth;
