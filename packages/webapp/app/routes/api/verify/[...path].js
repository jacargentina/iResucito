import { db } from '../../../common';

export default async function handler(req, res) {
  const { path } = req.query;
  const [token, email] = path;
  const user = db.get('users').find({ email }).value();
  if (user) {
    if (user.isVerified) {
      return res.status(202).json({ ok: 'Email Already Verified' });
    }
    const foundToken = db.get('tokens').find({ email, token }).value();
    if (foundToken) {
      db.get('users').find({ email }).assign({ isVerified: true }).write();
      db.get('tokens').remove({ email, token }).write();
      return res.redirect(
        301,
        `${process.env.NEXTAUTH_URL}/account?u=${email}&v=1`
      );
    }
    return res.status(404).json({ error: 'Token expired' });
  }
  return res.status(404).json({ error: 'Email not found' });
}
