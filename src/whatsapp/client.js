const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js")
const qrcode = require("qrcode-terminal")
const logger = require("../config/logger")
const messageHandler = require("./handlers/messageHandler")

let isReady = false

const SESSION_PATH = process.env.SESSION_PATH || "./.wwebjs_auth"

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "whatsapp-hermescore", dataPath: SESSION_PATH }),
    puppeteer: {
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
            "--disable-gpu",
        ],
    },
})

client.on("qr", (qr) => {
    logger.info("QR Code received, generating...")
    qrcode.generate(qr, { small: true })
})

client.on("ready", () => {
    logger.info("Client is ready!")
    isReady = true
})

client.on("authenticated", () => {
    logger.info("Client is authenticated!")
})

client.on("auth_failure", (msg) => {
    logger.error({ msg }, "AUTHENTICATION FAILURE")
})

client.on("disconnected", async (reason) => {
    logger.warn({ reason }, "Client disconnected")
    isReady = false

    if (reason === "LOGOUT" || reason === "NAVIGATION") {
        logger.error("WhatsApp client was logged out. Shutting down for a clean restart.")
        try {
            await client.destroy()
            logger.info("Client destroyed successfully.")
        } catch (err) {
            logger.error({ err }, "Error destroying client (may be due to file locks):")
        } finally {
            // Exit the process, PM2/Nodemon will restart it cleanly.
            process.exit(1)
        }
    } else {
        logger.info("Attempting to reconnect...")
        try {
            client.initialize()
        } catch (error) {
            logger.error({ err: error }, "Error during reconnection attempt:")
        }
    }
})

client.on("message", async (message) => {
    const reply = await messageHandler.handleIncomingMessage(message)
    if (reply) {
        message.reply(reply)
    }
})

const initialize = () => {
    logger.info("Initializing WhatsApp client...")
    client.initialize()
}

const sendText = async (number, message) => {
    try {
        if (!isReady) {
            logger.warn("WhatsApp client not ready. Message will not be sent.")
            return { success: false, message: "WhatsApp client not ready." }
        }
        await client.sendMessage(`${number}@c.us`, message)
        return { success: true }
    } catch (error) {
        logger.error({ err: error, to: number }, "Error sending message:")
        return { success: false, message: error.message }
    }
}

const sendMedia = async (number, fileData, mimetype, filename, caption) => {
    try {
        if (!isReady) {
            logger.warn("WhatsApp client not ready. Media will not be sent.")
            return { success: false, message: "WhatsApp client not ready." }
        }
        const media = new MessageMedia(mimetype, fileData, filename)
        await client.sendMessage(`${number}@c.us`, media, { caption: caption })
        return { success: true }
    } catch (error) {
        logger.error({ err: error, to: number }, "Error sending media:")
        return { success: false, message: error.message }
    }
}

module.exports = {
    client,
    initialize,
    sendText,
    sendMedia,
}
