declare module "pdf-parse" {
  interface PdfParseResult {
    text: string;
  }

  export default function pdfParse(
    buffer: Buffer | Uint8Array
  ): Promise<PdfParseResult>;
}
