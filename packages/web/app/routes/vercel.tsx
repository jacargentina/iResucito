import path from 'path';
import fs from 'fs';
import { json, LoaderFunction, ActionFunction } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { dataPath } from '~/utils.server';
import Layout from '~/components/Layout';

export let action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const folder = (body.get('folder') as string) || '';
  var items: string[] = [];
  var error = null;
  if (folder !== '') {
    const getAllFiles = (dirPath: string) => {
      var files = fs.readdirSync(dirPath);
      files.forEach((file: string) => {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
          getAllFiles(dirPath + '/' + file);
        } else {
          const str = path.join(dirPath, '/', file);
          items.push(str);
        }
      });
    };
    try {
      getAllFiles(folder);
    } catch (err: any) {
      error = err.message;
    }
    return json({ folder, items, error });
  }
  return null;
};

export let loader: LoaderFunction = async () => {
  return {
    cwd: process.cwd(),
    dirname: __dirname,
    dataPath: dataPath,
  };
};

const Vercel = () => {
  const data = useLoaderData();
  const actionData = useActionData();
  return (
    <Layout>
      <div style={{ height: '90%', padding: '10px' }}>
        <p>
          <strong>process.cwd(): {data.cwd}</strong>
        </p>
        <p>
          <strong>__dirname: {data.dirname}</strong>
        </p>
        <p>
          <strong>dataPath: {data.dataPath}</strong>
        </p>
        <form method="post" style={{ padding: '10px' }}>
          <label htmlFor="folder">Carpeta:&nbsp;</label>
          <input id="folder" name="folder" type="text" />
          <button type="submit">Consultar</button>
        </form>
        {actionData && (
          <>
            <p>
              <strong>Folder: {actionData.folder}</strong>
            </p>
            {actionData.error && <pre>{actionData.error}</pre>}
            <ul style={{ height: '100%', overflowY: 'scroll' }}>
              {actionData
                ? actionData.items.map((i: string) => {
                    return <li>{i}</li>;
                  })
                : null}
            </ul>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Vercel;
