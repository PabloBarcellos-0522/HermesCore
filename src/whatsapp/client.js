const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js")
const qrcode = require("qrcode-terminal")
const config = require("../config/env")

let isReady = false

// A pasta de sessão será configurável via .env
const SESSION_PATH = process.env.SESSION_PATH || "./.wwebjs_auth"

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "whatsapp-hermescore", dataPath: SESSION_PATH }),
    puppeteer: {
        headless: true, // Configurar para true em produção
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process", // <- Essa opção pode ajudar em alguns ambientes
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

client.on("disconnected", (reason) => {
    console.log("Client disconnected", reason)
    isReady = false
    // Adicionar lógica para tentar reconectar
    // client.initialize(); // Pode tentar reiniciar o cliente
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
