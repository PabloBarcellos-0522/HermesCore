const api = require("./api")
const whatsappClient = require("./whatsapp/client") // Importar o cliente WhatsApp

const main = async () => {
    try {
        await api.start()
        console.log("Aplicação iniciada com sucesso.")

        whatsappClient.initialize() // Inicializar o cliente WhatsApp
        console.log("Cliente WhatsApp inicializado.")
    } catch (error) {
        console.error("Erro ao iniciar a aplicação:", error)
        process.exit(1)
    }
}

main()
