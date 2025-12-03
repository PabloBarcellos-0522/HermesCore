require("dotenv").config()

const config = {
    apiKey: process.env.API_KEY,
    externalApiUrl: process.env.EXTERNAL_API_URL,
    externalApiToken: process.env.EXTERNAL_API_TOKEN,
    port: process.env.PORT || 3000,
    debugMode: process.env.DEBUG_MODE === "true",
}

const requiredVariables = ["apiKey", "externalApiUrl"]

const missingVariables = requiredVariables.filter((key) => !config[key])

if (missingVariables.length > 0) {
    throw new Error(`Variáveis de ambiente faltando: ${missingVariables.join(", ")}`)
}

module.exports = config
