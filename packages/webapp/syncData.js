const fs = require('fs');
const path = require('path');
const Dropbox = require('dropbox').Dropbox;
const fetch = require('node-fetch');

const dataPath = path.resolve(process.cwd(), './data');

if (!process.env.DROPBOX_PASSWORD) {
  console.log('No DROPBOX_PASSWORD provided. Exiting.');
  process.exit();
}

const pars = process.argv.slice(2);
const action = pars[0];
if (action === 'down') {
  console.log('Downloading to', dataPath);
  // Populate /data folder from Dropbpx
  const dbx = new Dropbox({
    fetch,
    accessToken: process.env.DROPBOX_PASSWORD,
  });
  dbx
    .filesListFolder({ path: '' })
    .then((response) => {
      const files = response.result;
      if (files.entries.length) {
        console.log(`Downloading ${files.entries.length} files...`);
      }
      return Promise.all(
        files.entries.map((entry) =>
          dbx.filesDownload({ path: entry.path_lower }).then((response) => {
            const meta = response.result;
            console.log(`Saving ${meta.name}`);
            return fs.promises.writeFile(
              path.join(dataPath, meta.name),
              meta.fileBinary
            );
          })
        )
      ).then(() => {
        console.log('Done!');
      });
    })
    .catch((err) => console.log('Preparing Error', err));
} else if (action === 'up') {
  const file = pars[1];
  if (!file) {
    console.log('Missing parameter file name to upload');
    process.exit();
  }
  const fullpath = path.isAbsolute(file) ? file : path.join(dataPath, file);
  const baseName = path.basename(fullpath);
  console.log('Uploading from', fullpath);
  // Populate /data folder from Dropbpx
  const dbx = new Dropbox({
    fetch,
    accessToken: process.env.DROPBOX_PASSWORD,
  });
  dbx
    .filesUpload({
      path: `/${baseName}`,
      mode: { '.tag': 'overwrite' },
      contents: fs.readFileSync(fullpath),
    })
    .then((response) => {
      const meta = response.result;
      console.log(`Uploaded ${meta.name}`);
    })
    .catch((err) => console.log('Uploading Error', err));
}
