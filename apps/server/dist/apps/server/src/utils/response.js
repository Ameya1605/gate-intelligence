"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
exports.sendPaginated = sendPaginated;
function sendSuccess(res, data, message, statusCode = 200) {
    const payload = { success: true, data, message };
    res.status(statusCode).json(payload);
}
function sendError(res, message, statusCode = 400) {
    const payload = { success: false, data: null, message };
    res.status(statusCode).json(payload);
}
function sendPaginated(res, data, total, page, limit) {
    const payload = {
        success: true,
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
    res.json(payload);
}
