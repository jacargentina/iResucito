import path from 'path';
import fs from 'fs';
import { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Layout from '~/components/Layout';

export let loader: LoaderFunction = async () => {
  var items: string[] = [];
  const getAllFiles = (dirPath: string) => {
    var files = fs.readdirSync(dirPath);
    files.forEach((file: string) => {
      if (fs.statSync(dirPath + '/' + file).isDirectory()) {
        getAllFiles(dirPath + '/' + file);
      } else {
        const str = path.join(dirPath, '/', file);
        items.push(` - ${str}`);
      }
    });
  };

  getAllFiles(__dirname);

  return { cwd: process.cwd(), dirname: __dirname, items: items.sort() };
};

const Vercel = () => {
  const data = useLoaderData();

  return (
    <Layout>
      <div style={{ height: '90%' }}>
        <strong>CWD: {data.cwd}</strong>
        <strong>__dirname: {data.dirname}</strong>
        <ul style={{ height: '100%', overflowY: 'scroll' }}>
          {data.items.map((i: string) => {
            return <li>{i}</li>;
          })}
        </ul>
      </div>
    </Layout>
  );
};

export default Vercel;
