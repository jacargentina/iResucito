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

  readPatch() {
    return this.reader(this.getPatchUri());
  }

  savePatch(patch: any) {
    return this.writer(this.getPatchUri(), patch, 'utf8');
  }

  deletePatch() {
    return this.unlink(this.getPatchUri());
  }

  patchExists() {
    return this.exists(this.getPatchUri());
  }

  getPatchUri() {
    return `${this.basePath}/SongsIndexPatch.json`;
  }

  readRatings() {
    return this.reader(this.getRatingsUri());
  }

  saveRatings(ratings: any) {
    return this.writer(this.getRatingsUri(), ratings, 'utf8');
  }

  deleteRatings() {
    return this.unlink(this.getRatingsUri());
  }

  ratingsExists() {
    return this.exists(this.getRatingsUri());
  }

  getRatingsUri() {
    return `${this.basePath}/SongsRating.json`;
  }
}
