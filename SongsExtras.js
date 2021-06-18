// @flow

declare type FileExistsFunc = (path: string) => Promise<boolean>;
declare type FileReaderFunc = (path: string) => Promise<string>;
declare type FileWriterFunc = (
  path: string,
  content: any,
  encoding: string
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

  readRatings(): Promise<string> {
    return this.reader(this.getRatingsUri());
  }

  saveRatings(ratings: any): Promise<void> {
    return this.writer(this.getRatingsUri(), ratings, 'utf8');
  }

  deleteRatings(): Promise<void> {
    return this.unlink(this.getRatingsUri());
  }

  ratingsExists(): Promise<boolean> {
    return this.exists(this.getRatingsUri());
  }

  getRatingsUri(): string {
    return `${this.basePath}/SongsRating.json`;
  }
}
