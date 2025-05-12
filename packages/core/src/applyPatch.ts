import path from 'path';
import util from 'util';
import fs from 'fs';
import { Dropbox } from 'dropbox';
import {
  getPatchStats,
  getPropertyLocale,
  loadAllLocales,
  SongChange,
  SongIndexPatch,
  SongPatch,
  SongPatchData,
  SongsLocaleData,
} from './common';
import { SongsHistory, SongsIndex } from './SongsProcessor';

var allLocales = loadAllLocales();

const currentDate = Date.now();

const patchSongLogic = (songPatch: SongPatch, key: string) => {
  try {
    if (!SongsIndex.hasOwnProperty(key)) {
      SongsIndex[key] = {
        files: {},
        stage: 'precatechumenate',
        stages: {},
      };
    }
    var songToPatch = SongsIndex[key];
    Object.keys(songPatch).forEach((rawLoc) => {
      var item: SongPatchData = songPatch[rawLoc];
      var localeKey: string | undefined = undefined;
      var loc = rawLoc;
      var { author, date, name, lines, stage } = item;
      name = name.trim();
      loc = getPropertyLocale(songToPatch.files, rawLoc);
      if (loc) {
        // Buscar si está la clave en el indice
        localeKey = songToPatch.files[loc];
      } else {
        // Tomar loc desde parche (archivo nuevo para un idioma)
        loc = rawLoc;
      }

      var songsLocaleData: SongsLocaleData = allLocales[loc];
      if (!songsLocaleData) {
        throw new Error(
          `No se pudo determinar songsLocaleData para '${loc}'. Falta crear archivo assets/songs/${loc}.json ?`
        );
      }

      var rename: { original: string; new: string } | undefined = undefined;
      var staged: { original: string; new: string } | undefined = undefined;
      var updated: boolean = false;
      var created: boolean = false;

      if (!localeKey) {
        var keys = Object.keys(songsLocaleData);
        var lastKey = Number(keys[keys.length - 1]);
        localeKey = String(lastKey + 1);
        songsLocaleData[localeKey] = { name, source: lines as string };
        songToPatch.files[loc] = localeKey;
        created = true;
      }

      if (songsLocaleData[localeKey].name !== name) {
        rename = { original: songsLocaleData[localeKey].name, new: name };
        Object.assign(songToPatch.files, { [loc]: localeKey });
      }
      if (!created && lines && songsLocaleData[localeKey].source !== lines) {
        songsLocaleData[localeKey].source = lines;
        updated = true;
      }

      if (stage) {
        const currStage =
          songToPatch.stages && songToPatch.stages.hasOwnProperty(loc)
            ? songToPatch.stages[loc]
            : songToPatch.stage;
        if (currStage !== stage) {
          if (!songToPatch.stages) {
            songToPatch.stages = {};
          }
          Object.assign(songToPatch.stages, { [loc]: stage });
          staged = { original: currStage, new: stage };
        }
      }

      // Guardar historia de cambios sólo si efectivamente se aplicaron cambios
      if (rename || created || updated || staged) {
        var patchInfo: SongChange = {
          date: date || currentDate,
          locale: loc,
          author: author,
          rename: rename,
          created: created,
          updated: updated,
          staged: staged,
        };
        if (!SongsHistory.hasOwnProperty(key)) {
          SongsHistory[key] = [];
        }
        var songPatches = SongsHistory[key];
        var found = songPatches.find((x) => x.date === date);
        if (!found) {
          songPatches.push(patchInfo);
        }
      }
    });
  } catch (err) {
    console.log((err as Error).message);
  }
};

const applyPatch = async (local_file_path: string) => {
  var patch: SongIndexPatch;
  var dropbox: Dropbox | undefined;
  const file = 'SongsIndexPatch.json';

  if (local_file_path?.endsWith('.json')) {
    console.log(`Con archivo local de parametro: ${local_file_path}`);
    const data = fs.readFileSync(local_file_path, { encoding: 'utf8' });
    patch = JSON.parse(data) as SongIndexPatch;
  } else {
    console.log('Sin archivo local en parametro. Descargando de Dropbox...');
    if (!process.env.DROPBOX_PASSWORD)
      throw new Error(
        'DROPBOX_PASSWORD no definida. No se puede conectar con Dropbox'
      );

    dropbox = new Dropbox({
      accessToken: process.env.DROPBOX_PASSWORD,
    });

    const download = await dropbox.filesDownload({
      path: `/${file.toLowerCase()}`,
    });
    const meta = download.result;
    const data = (meta as any).fileBinary.toString();
    patch = JSON.parse(data) as SongIndexPatch;
  }

  if (Object.keys(patch).length == 0) {
    console.log('No hay cambios pendientes de patch');
    return;
  }

  const stats = getPatchStats(patch);
  Object.keys(patch).forEach((k) => {
    patchSongLogic(patch[k], k);
  });

  Object.keys(allLocales).forEach((loc) => {
    const localePath = path.resolve(
      import.meta.dirname,
      `../assets/songs/${loc}.json`
    );
    fs.writeFileSync(
      localePath,
      JSON.stringify(allLocales[loc], null, '  ') + '\n'
    );
  });

  const indexPath = path.resolve(import.meta.dirname, '../assets/songs.json');
  const patchesPath = path.resolve(
    import.meta.dirname,
    '../assets/patches.json'
  );

  fs.writeFileSync(indexPath, JSON.stringify(SongsIndex, null, '  ') + '\n');
  fs.writeFileSync(
    patchesPath,
    JSON.stringify(SongsHistory, null, '  ') + '\n'
  );
  console.log(util.inspect(stats, { depth: 10 }));

  if (dropbox !== undefined) {
    const date = new Date();
    const formatDate =
      ('0' + date.getDate()).slice(-2) +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      date.getFullYear();
    const home = process.env.HOME ?? '.';
    const bakPath = `${home}/SongsIndexPatch-${formatDate}.json`;
    fs.writeFileSync(bakPath, JSON.stringify(patch, null, 2));
    const response = await dropbox.filesUpload({
      path: `/${file}`,
      mode: { '.tag': 'overwrite' },
      contents: JSON.stringify({}, null, 2),
    });
    const metadata = response.result;
    console.log(`Vaciado ${metadata.name} en Dropbox`);
    console.log(`Backup: ${bakPath}`);
  }
};

applyPatch(process.argv[process.argv.length - 1]);
