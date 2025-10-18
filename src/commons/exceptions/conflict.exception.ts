import { ClientException } from "@tsed/exceptions";

import { StatusCodes } from "http-status-codes";

export class ConflictException extends ClientException {
  constructor(message?: string) {
    super(StatusCodes.CONFLICT, message || "conflict error");
  }
}