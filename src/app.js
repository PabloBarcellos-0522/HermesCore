const api = require("./api")

// Em breve, o cliente do WhatsApp será inicializado aqui

const main = async () => {
    try {
        await api.start()
        console.log("Aplicação iniciada com sucesso.")
    } catch (error) {
        console.error("Erro ao iniciar a aplicação:", error)
        process.exit(1)
    }
}

main()
