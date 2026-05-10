export const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.name === 'PrismaClientValidationError') {
        return res.status(400).json({
            error: 'Invalid data provided',
            message: err.message,
        });
    }

    if (err.name === 'PrismaClientKnownRequestError') {
        if (err.code === 'P2002') {
            return res.status(409).json({
                error: 'Unique constraint violation',
                message: `${err.meta?.target?.[0] || 'Field'} already exists`,
            });
        }

        if (err.code === 'P2025') {
            return res.status(404).json({
                error: 'Record not found',
            });
        }

        if (err.code === 'P2003') {
            return res.status(400).json({
                error: 'Foreign key constraint violation',
            });
        }
    }

    if (err.status) {
        return res.status(err.status).json({
            error: err.message,
        });
    }

    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
};

export const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: 'Not found',
        path: req.originalUrl,
    });
};
