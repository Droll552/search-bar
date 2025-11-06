export function errorHandler(err, req, response, next) {
    console.error('Error:', err);

    // Handle custom errors
    if (err.statusCode) {
        return response.status(err.statusCode).json({
            error: {
                message: err.message,
                errors: err.errors || undefined
            }
        });
    }

    // Handle unexpected errors
    response.status(500).json({
        error: {
            message: 'Internal server error'
        }
    });
}