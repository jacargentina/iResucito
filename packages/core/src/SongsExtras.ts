import { SongIndexPatch } from './common';

export interface SongsExtras {
  readPatch(): Promise<SongIndexPatch>;
  savePatch(patch: SongIndexPatch): Promise<void>;
  deletePatch(): Promise<void>;
  readSettings(): Promise<string>;
  saveSettings(ratings: any): Promise<void>;
  deleteSettings(): Promise<void>;
  settingsExists(): Promise<boolean>;
}
