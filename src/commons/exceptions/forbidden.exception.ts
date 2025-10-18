import { ClientException } from "@tsed/exceptions";

import { StatusCodes } from "http-status-codes";

export class ForbiddenException extends ClientException {
  constructor(message?: string) {
    super(StatusCodes.FORBIDDEN, message || "Forbidden error");
  }
}