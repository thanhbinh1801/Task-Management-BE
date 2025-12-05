"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationUtils = void 0;
class PaginationUtils {
    static convertPageLimitToPagination(page, limit) {
        const skip = (page - 1) * limit;
        const take = limit;
        return { skip, take };
    }
}
exports.PaginationUtils = PaginationUtils;
