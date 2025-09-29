import { ServerException } from "@tsed/exceptions";

import { StatusCodes } from "http-status-codes";

export class InternalServerException extends ServerException {
  constructor(message?: string) {
    super(StatusCodes.INTERNAL_SERVER_ERROR, message || "Error from the server");
  }
}