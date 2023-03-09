import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../../lib/withSession';

async function logout(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  res.send({ ok: true });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return logout(req, res);
    default:
      return res.status(405).send(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(handler);
