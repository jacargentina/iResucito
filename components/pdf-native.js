// @flow
export class PdfNative extends IPdfImplementation {
  constructor() {}

  writeTitle(title: string): Promise<any> {
    return Promise.resolve();
  }
  writeSource(source: string): Promise<any> {
    return Promise.resolve();
  }
  writeText(text: string): Promise<any> {
    return Promise.resolve();
  }
}