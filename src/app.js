const logger = require("./config/logger")
const api = require("./api")
const whatsappClient = require("./whatsapp/client") // Importar o cliente WhatsApp

const main = async () => {
    try {
        await api.start()
        logger.info("Aplicação iniciada com sucesso.")

        whatsappClient.initialize() // Inicializar o cliente WhatsApp
    } catch (error) {
        logger.error({ err: error }, "Erro ao iniciar a aplicação:")
        process.exit(1)
    }
}

main()
