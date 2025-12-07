"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponseDto = void 0;
const http_status_codes_1 = require("http-status-codes");
// import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
// export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
//   return response.status(serviceResponse.code).send(serviceResponse);
// };
// export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
//   try {
//     schema.parse({ body: req.body, query: req.query, params: req.params });
//     next();
//   } catch (err) {
//     const errorMessage = `Invalid input: ${(err as ZodError).errors.map((e) => e.message).join(', ')}`;
//     const statusCode = StatusCodes.BAD_REQUEST;
//     res.status(statusCode).send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode));
//   }
// };
class HttpResponseDto {
    success(data, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(http_status_codes_1.StatusCodes.OK).json(data);
        });
    }
    created(data, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(http_status_codes_1.StatusCodes.CREATED).json(data);
        });
    }
    exception(exceptions, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(exceptions.status).json({
                status: exceptions.status,
                messenger: exceptions.message
            });
        });
    }
}
exports.HttpResponseDto = HttpResponseDto;
exports.default = new HttpResponseDto();
