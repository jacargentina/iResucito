export interface SongsExtras {
  readPatch(): Promise<string>;
  savePatch(patch: any): Promise<void>;
  deletePatch(): Promise<void>;
  patchExists(): Promise<boolean>;
  getPatchUri(): string;
  readSettings(): Promise<string>;
  saveSettings(ratings: any): Promise<void>;
  deleteSettings(): Promise<void>;
  settingsExists(): Promise<boolean>;
  getSettingsUri(): string;
}
