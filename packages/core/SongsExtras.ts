declare type FileExistsFunc = (path: string) => Promise<boolean>;
declare type FileReaderFunc = (path: string) => Promise<string>;
declare type FileWriterFunc = (
  path: string,
  content: any,
  encoding: BufferEncoding
) => Promise<any>;
declare type FileUnlinkFunc = (path: string) => Promise<any>;

export class SongsExtras {
  basePath: string;
  exists: FileExistsFunc;
  writer: FileWriterFunc;
  reader: FileReaderFunc;
  unlink: FileUnlinkFunc;

  constructor(
    basePath: string,
    exists: FileExistsFunc,
    writer: FileWriterFunc,
    reader: FileReaderFunc,
    unlink: FileUnlinkFunc
  ) {
    this.basePath = basePath;
    this.exists = exists;
    this.writer = writer;
    this.reader = reader;
    this.unlink = unlink;
    console.log('SongsExtras basePath ', this.basePath);
  }

  readPatch(): Promise<string> {
    return this.reader(this.getPatchUri());
  }

  savePatch(patch: any): Promise<void> {
    return this.writer(this.getPatchUri(), patch, 'utf8');
  }

  deletePatch(): Promise<void> {
    return this.unlink(this.getPatchUri());
  }

  patchExists(): Promise<boolean> {
    return this.exists(this.getPatchUri());
  }

  getPatchUri(): string {
    return `${this.basePath}/SongsIndexPatch.json`;
  }

  readSettings(): Promise<string> {
    return this.reader(this.getSettingsUri());
  }

  saveSettings(ratings: any): Promise<void> {
    return this.writer(this.getSettingsUri(), ratings, 'utf8');
  }

  deleteSettings(): Promise<void> {
    return this.unlink(this.getSettingsUri());
  }

  settingsExists(): Promise<boolean> {
    return this.exists(this.getSettingsUri());
  }

  getSettingsUri(): string {
    return `${this.basePath}/SongsSettings.json`;
  }
}
