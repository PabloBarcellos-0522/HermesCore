const externalApi = require("./externalRequest")
const logger = require("../config/logger")

/**
 * Executes an external command by making a GET request to the configured external API.
 * @param {string} command - The command to execute (e.g., "notas").
 * @param {string} [args] - The arguments for the command.
 * @returns {Promise<string|null>} The reply message from the external API, or null if an error occurs.
 */
const execute = async (command, args, from) => {
    logger.debug({ command, args }, "Executing external command")

    try {
        const response = await externalApi.get(`/${command}`, {
            params: { args: args || "", from: from || "" },
        })

        // Assuming the external API returns a JSON with a "data" or "reply" field.
        // Let's check for common response structures.
        if (response.data && (response.data.reply || response.data.data)) {
            const reply = response.data.reply || response.data.data
            logger.debug({ command, reply }, "External command executed successfully")
            return reply
        }

        // If the structure is unexpected, log a warning.
        logger.warn(
            { command, responseData: response.data },
            "Unexpected response structure from external API"
        )
        return "Recebi uma resposta inesperada do serviço externo."
    } catch (error) {
        logger.error({ err: error, command }, "Error executing external command")
        return "Ocorreu um erro ao tentar executar o comando. Tente novamente mais tarde."
    }
}

module.exports = {
    execute,
}
