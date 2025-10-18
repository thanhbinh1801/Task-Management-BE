import { ClientException } from "@tsed/exceptions";

import { StatusCodes } from "http-status-codes";

export class BadRequestException extends ClientException {
  constructor(message?: string) {
    super(StatusCodes.BAD_REQUEST, message || "Error from the server");
  }
}