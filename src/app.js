const logger = require("./config/logger")
const api = require("./api")
const whatsapp = require("./whatsapp/client")
const connectionHandler = require("./whatsapp/handlers/connectionHandler")

const main = async () => {
    try {
        await api.start()
        logger.info("Aplicação iniciada com sucesso.")

        connectionHandler.initialize(whatsapp.client)
        whatsapp.initialize()
    } catch (error) {
        logger.error({ err: error }, "Erro ao iniciar a aplicação:")
        process.exit(1)
    }
}

main()
