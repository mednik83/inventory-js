import qrcode from "qrcode";
import { ValidationError } from "../errors/errors.js";

const isText = function (text: unknown): string {
  if (typeof text !== "string") {
    throw new ValidationError("QrCode is not valid");
  }

  return text;
};

class QrCodeService {
  async generateSvg(text: unknown) {
    const validText = isText(text);

    return qrcode.toString(validText, { type: "svg" });
  }
}

export const qrCodeService = new QrCodeService();
