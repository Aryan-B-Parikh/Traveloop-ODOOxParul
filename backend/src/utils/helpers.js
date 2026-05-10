export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export const createResponse = (data, message = 'Success', status = 200) => {
    return {
        status,
        message,
        data,
    };
};

export const sendResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const sendError = (res, status, error, data = null) => {
    res.status(status).json({
        status,
        error,
        data,
    });
};
