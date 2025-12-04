const pino = require("pino")
const env = require("./env")

const logger = pino({
    level: env.LOG_LEVEL || "info",
})

module.exports = logger
