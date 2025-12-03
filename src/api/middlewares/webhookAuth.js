const config = require("../../config/env")
const { UnauthorizedError } = require("../../utils/errors")

function webhookAuth(request, reply, done) {
    const webhookToken = request.headers["x-webhook-token"]

    if (!webhookToken) {
        throw new UnauthorizedError("x-webhook-token header is missing.")
    }

    if (webhookToken !== config.webhookToken) {
        throw new UnauthorizedError("Invalid Webhook Token.")
    }

    done()
}

module.exports = webhookAuth
