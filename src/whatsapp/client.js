const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js")
const qrcode = require("qrcode-terminal")
const fs = require("fs-extra") // Import fs-extra
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
    console.log("QR RECEIVED", qr)
    qrcode.generate(qr, { small: true })
})

client.on("ready", () => {
    console.log("Client is ready!")
    isReady = true
})

client.on("authenticated", () => {
    console.log("Client is authenticated!")
})

client.on("auth_failure", (msg) => {
    console.error("AUTHENTICATION FAILURE", msg)
})

client.on("disconnected", async (reason) => {
    console.log("Client disconnected", reason)
    isReady = false

    if (reason === "LOGOUT" || reason === "NAVIGATION") {
        console.error("WhatsApp client was logged out. Shutting down for a clean restart.")
        try {
            await client.destroy()
            console.log("Client destroyed successfully.")
        } catch (err) {
            console.error("Error destroying client (may be due to file locks):", err.message)
        } finally {
            // Exit the process, PM2/Nodemon will restart it cleanly.
            process.exit(1)
        }
    } else {
        console.log("Attempting to reconnect...")
        try {
            client.initialize()
        } catch (error) {
            console.error("Error during reconnection attempt:", error)
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
    console.log("Initializing WhatsApp client...")
    client.initialize()
}

const sendText = async (number, message) => {
    try {
        if (!isReady) {
            console.warn("WhatsApp client not ready. Message will not be sent.")
            return { success: false, message: "WhatsApp client not ready." }
        }
        await client.sendMessage(`${number}@c.us`, message)
        return { success: true }
    } catch (error) {
        console.error("Error sending message:", error)
        return { success: false, message: error.message }
    }
}

const sendMedia = async (number, fileData, mimetype, filename, caption) => {
    try {
        if (!isReady) {
            console.warn("WhatsApp client not ready. Media will not be sent.")
            return { success: false, message: "WhatsApp client not ready." }
        }
        const media = new MessageMedia(mimetype, fileData, filename)
        await client.sendMessage(`${number}@c.us`, media, { caption: caption })
        return { success: true }
    } catch (error) {
        console.error("Error sending media:", error)
        return { success: false, message: error.message }
    }
}

module.exports = {
    client,
    initialize,
    sendText,
    sendMedia,
}
