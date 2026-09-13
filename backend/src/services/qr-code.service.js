import qrcode from "qrcode";

class QrCodeService {
  async generateSvg(text) {
    return qrcode.toString(text, { type: "svg" });
  }
}

export const qrCodeService = new QrCodeService();
