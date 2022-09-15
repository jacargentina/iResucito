import { upload, download } from '~/utils.server';

const program = async () => {
  const pars = process.argv.slice(2);
  const action = pars[0];
  if (action === 'down') {
    await download();
  } else if (action === 'up') {
    const file = pars[1];
    if (!file) {
      console.log('Falta parametro ./file/path a subir');
      process.exit();
    }
    await upload(file);
  } else {
    console.log('syncData down');
    console.log('syncData up ./file/path');
  }
};

program();
