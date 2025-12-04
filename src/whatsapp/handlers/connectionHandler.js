const qrcode = require("qrcode-terminal")
const logger = require("../../config/logger")

/**
 * Initializes listeners for WhatsApp client connection events that are primarily for logging.
 * @param {import('whatsapp-web.js').Client} client
 */
const initialize = (client) => {
    client.on("qr", (qr) => {
        logger.info("QR Code received, generating...")
        qrcode.generate(qr, { small: true })
    })

    client.on("authenticated", () => {
        logger.info("Client is authenticated!")
    })

    client.on("auth_failure", (msg) => {
        logger.error({ msg }, "AUTHENTICATION FAILURE")
    })

    logger.info("Connection event handlers initialized.")
}

module.exports = {
    initialize,
}