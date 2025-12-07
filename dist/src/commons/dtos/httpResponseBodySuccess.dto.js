"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponseBodySuccessDtoSchema = void 0;
const zod_1 = require("zod");
const HttpResponseBodySuccessDtoSchema = (dataSchema) => zod_1.z.object({
    data: dataSchema ? dataSchema.optional() : zod_1.z.null(),
    totalPage: zod_1.z.number(),
});
exports.HttpResponseBodySuccessDtoSchema = HttpResponseBodySuccessDtoSchema;
