const asyncHandler = (handler) => (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
};

const pick = (source, fields) => {
    const data = {};
    fields.forEach((field) => {
        if (source[field] !== undefined) {
            data[field] = source[field];
        }
    });
    return data;
};

const requireFields = (body, fields) => {
    const missing = fields.filter((field) => {
        const value = body[field];
        return value === undefined || value === null || value === '';
    });

    if (missing.length) {
        const error = new Error(`Missing required fields: ${missing.join(', ')}`);
        error.statusCode = 400;
        throw error;
    }
};

const toNumber = (value, fieldName) => {
    const number = Number(value);
    if (!Number.isFinite(number)) {
        const error = new Error(`${fieldName} must be a valid number`);
        error.statusCode = 400;
        throw error;
    }
    return number;
};

const getStartOfToday = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

module.exports = {
    asyncHandler,
    getStartOfToday,
    pick,
    requireFields,
    toNumber
};
