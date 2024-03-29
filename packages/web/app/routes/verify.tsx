import { LoaderFunction, redirect, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Header, Image, Grid } from 'semantic-ui-react';
import ErrorDetail from '~/components/ErrorDetail';
import Layout from '~/components/Layout';
import { db } from '~/utils.server';

export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') as string;
  const email = url.searchParams.get('email') as string;
  if (!token || !email) {
    throw new Error('Missing parameters');
  }
  // @ts-ignore
  const userIndex = db.data.users.findIndex((x) => x.email === email);
  if (userIndex !== -1) {
    // @ts-ignore
    const user = db.data.users[userIndex];
    if (user.isVerified) {
      return json({ ok: 'Email Already Verified' });
    }
    // @ts-ignore
    const tokenIndex = db.data.tokens.findIndex(
      (t) => t.email === email && t.token === token
    );
    if (tokenIndex !== -1) {
      // @ts-ignore
      db.data.users[userIndex].isVerified = true;
      // @ts-ignore
      db.data.tokens.splice(tokenIndex, 1);
      db.write();
      return redirect(`/account?u=${email}&v=1`);
    }
    return json({ error: { message: 'Token expired' } });
  }
  return json({ error: { message: 'E-mail not found' } });
};

const Verify = () => {
  const data = useLoaderData<typeof loader>();
  return (
    <Layout>
      <div style={{ padding: 30, width: 500, margin: 'auto' }}>
        <Image centered circular src="cristo.png" />
        <Header textAlign="center">iResucito</Header>
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column>
            {data.error && <ErrorDetail error={data.error} simple />}
          </Grid.Column>
        </Grid>
      </div>
    </Layout>
  );
};

export default Verify;
