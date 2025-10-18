
import { ClientException } from "@tsed/exceptions";

import { StatusCodes } from "http-status-codes";

export class NotFoundException extends ClientException {
  constructor(message?: string) {
    super(StatusCodes.NOT_FOUND, message || "Not found error");
  }
}
