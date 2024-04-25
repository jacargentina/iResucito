import * as fs from 'fs';
import * as path from 'path';
import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Layout from '~/components/Layout';

export let loader: LoaderFunction = async ({ params }) => {
  var result: string[] = [];
  var errors: string[] = [];
  var level = 0;
  const load = async (p: string) => {
    var items: string[] = [];
    try {
      items = await fs.readdirSync(p);
    } catch (err) {
      errors.push((err as Error).message);
    }
    items.forEach(async (element) => {
      const subpath = path.join(p, element);
      try {
        const info = fs.statSync(subpath);
        if (info.isDirectory() && level < 2) {
          level++;
          await load(subpath);
        }
      } catch (err) {
        errors.push((err as Error).message);
      } finally {
        result.push(subpath);
      }
    });
    return items;
  };
  const p = params['*'];
  const thePath = p == '' ? '/var/task' : '/' + p;
  await load(thePath);
  return json({ path: thePath, items: result, errors });
};

const Vercel = () => {
  const data = useLoaderData<typeof loader>();
  return (
    <Layout>
      <div
        style={{
          padding: '10px',
          height: 'calc(100% - 55px)',
          overflow: 'scroll',
          fontFamily: 'monospace',
        }}>
        <ul>
          <li>{data.path}</li>
        </ul>
        <h2>Items</h2>
        <p>{data.items.length} items</p>
        {data.items.map((x: string, i: number) => {
          return <p key={i}>{x}</p>;
        })}
        <h2>Errors</h2>
        <p>{data.errors.length} errors</p>
        {data.errors.map((x: string, i: number) => {
          return <p key={i}>{x}</p>;
        })}
      </div>
    </Layout>
  );
};

export default Vercel;
