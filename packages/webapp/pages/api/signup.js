import bcrypt from 'bcryptjs';
import crypto from 'crypto-random-string';
import send from 'gmail-send';
import { db, domain } from '../../common';

const mailSender = send({
  user: 'javier.alejandro.castro@gmail.com',
  pass: process.env.GMAIL_PASSWORD,
  subject: 'iResucito Web',
});

export default async function handler(req, res) {
  let { email } = req.body;
  const { password } = req.body;
  if (!email || !password) {
    return res.status(500).json({
      error: 'Provide an email and password to register',
    });
  }
  // Quitar espacios
  email = email.trim();
  const exists = db.get('users').find({ email }).value();
  if (exists) {
    return res.status(500).json({
      error: `Email ${email} already registered!`,
    });
  }
  try {
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    // Crear usuario
    db.get('users')
      .push({
        email,
        password: hash,
        isVerified: false,
        createdAt: Date.now(),
      })
      .write();
    // Crear token para verificacion
    const token = crypto({ length: 20, type: 'url-safe' });
    db.get('tokens')
      .push({
        email,
        token,
      })
      .write();
    mailSender(
      {
        to: email,
        text: `Navigate this link ${domain}/api/verify/${token}/${email} to activate your account.`,
      },
      (err, res) => {
        console.log({ mailSend: { err, res } });
      }
    );
    return res.status(200).json({
      ok: `User registered. 
Open your inbox and activate your account 
with the email we've just sent to you!`,
    });
  } catch (err) {
    console.log({ err });
    return res.status(500).json({
      error: err,
    });
  }
}
