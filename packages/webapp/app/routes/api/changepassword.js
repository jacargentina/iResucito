import bcrypt from 'bcryptjs';
import { getSession } from 'next-auth/client';
import { db } from '../../common';

export default async function handler(req, res) {
  try {
    const { newPassword } = req.body;
    const session = await getSession({ req });
    const newHash = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
    if (!db.get('users').find({ email: session.user }).value()) {
      throw new Error('Usuario inválido.');
    }
    db.get('users')
      .find({ email: session.user })
      .assign({ password: newHash })
      .write();
    return res.status(200).json({
      ok: `PasswordChanged`,
    });
  } catch (err) {
    console.log({ err });
    return res.status(500).json({
      error: err,
    });
  }
}
