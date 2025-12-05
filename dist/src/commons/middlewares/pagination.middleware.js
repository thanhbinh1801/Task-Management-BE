"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationMiddleware = void 0;
const utils_1 = require("../utils");
const PaginationMiddleware = (req, res, next) => {
    const { page, limit, name, email } = req.query; // trả về string
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const { skip, take } = utils_1.PaginationUtils.convertPageLimitToPagination(pageNum, limitNum);
    req.pagination = {
        skip,
        take,
        name: typeof name === "string" ? name : undefined,
        email: typeof email === "string" ? email : undefined
    };
    next();
};
exports.PaginationMiddleware = PaginationMiddleware;
