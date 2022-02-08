import bcrypt from 'bcryptjs';
import send from 'gmail-send';
import { ActionFunction, json } from 'remix';
import { getdb } from '~/utils.server';

const mailSender = send({
  user: 'javier.alejandro.castro@gmail.com',
  pass: process.env.GMAIL_PASSWORD,
  subject: 'iResucito Web',
});

export let action: ActionFunction = async ({ request }) => {
  const body = await request.json();
  let { email, password } = body;
  if (!email || !password) {
    return json(
      {
        error: 'Provide an email and password to register',
      },
      { status: 500 }
    );
  }
  // Quitar espacios
  email = email.trim();
  const db = await getdb();
  const exists = db.data.users.find((u) => u.email == email);
  if (exists && exists.isVerified) {
    return json(
      {
        error: `Email ${email} already registered!`,
      },
      { status: 500 }
    );
  }
  try {
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    if (!exists) {
      // Crear usuario
      db.data.users.push({
        email,
        password: hash,
        isVerified: false,
        createdAt: Date.now(),
      });
    }
    // Crear (o actualizar) token para verificacion
    const crypto = await import('crypto-random-string');
    const token = crypto.default({ length: 20, type: 'url-safe' });
    let tokenIndex = db.data.tokens.findIndex((t) => t.email == email);
    if (tokenIndex === -1) {
      db.data.tokens.push({
        email,
        token,
      });
    } else {
      db.data.tokens[tokenIndex].token = token;
    }
    // Escribir
    db.write();
    const base =
      process.env.NODE_ENV == 'production'
        ? 'http://iresucito.herokuapp.com'
        : 'http://localhost:3000';

    mailSender(
      {
        to: email,
        text: `Navigate this link ${base}/verify?token=${token}&email=${email} to activate your account.`,
      },
      (err, res) => {
        console.log({ mailSend: { err, res } });
      }
    );
    return json({
      ok: `User registered. 
Open your inbox and activate your account 
with the email we've just sent to you!`,
    });
  } catch (err) {
    console.log({ err });
    return json(
      {
        error: err,
      },
      { status: 500 }
    );
  }
};
