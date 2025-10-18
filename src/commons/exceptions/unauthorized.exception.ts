import { ClientException } from "@tsed/exceptions";

import { StatusCodes } from "http-status-codes";

export class UnauthorizedException extends ClientException {
  constructor(message?: string) {
    super(StatusCodes.UNAUTHORIZED, message || "Unauthorized error");
  }
}