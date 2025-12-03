const sendSuccess = ({ reply, statusCode = 200, data = {}, message = "" }) => {
    const response = {
        status: "success",
    }

    if (message) {
        response.message = message
    }

    if (Object.keys(data).length > 0) {
        response.data = data
    }

    reply.code(statusCode).send(response)
}

const sendError = ({ reply, statusCode = 500, message = "An unknown error occurred" }) => {
    reply.code(statusCode).send({
        status: "error",
        message,
    })
}

module.exports = {
    sendSuccess,
    sendError,
}
