const config = require("../../config/env")
const { UnauthorizedError } = require("../../utils/errors")

function apiKeyAuth(request, reply, done) {
    const apiKey = request.headers["x-api-key"]

    if (!apiKey) {
        throw new UnauthorizedError("x-api-key header is missing.")
    }

    if (apiKey !== config.apiKey) {
        throw new UnauthorizedError("Invalid API Key.")
    }

    done()
}

module.exports = apiKeyAuth
