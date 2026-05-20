"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_exception_1 = require("../../data/exception/api.exception");
const sendRequest = async (data, userId) => {
    try {
        const res = await fetch(process.env.n8n_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Config': process.env.n8n_SECRET_KEY,
            },
            body: JSON.stringify({
                data: data,
                userId: userId,
            }),
        });
        if (!res.ok) {
            throw new api_exception_1.ApiError(res.status, res.statusText, 'n8n error');
        }
        const dataRes = (await res.json());
        return dataRes.output;
    }
    catch (error) {
        console.error(error);
        throw new api_exception_1.ApiError(500, JSON.stringify(error), 'error from n8n');
    }
};
exports.default = {
    sendRequest,
};
