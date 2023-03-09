import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { USER_ROLE } from '../../../constants/users';
import { withSessionRoute } from '../../../lib/withSession';
import middleware from '../../../middleware';
import User from '../../../models/user';

export const UserRoleSchema = z.object({
  role: z.enum([USER_ROLE.MEMBER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN]),
});

const updateUserRole = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  const { role } = req.body;
  const user = await User.findById(userId);

  const isUpdateNotAllowed =
    req.session.user?.role === USER_ROLE.ADMIN &&
    role === USER_ROLE.SUPER_ADMIN;

  if (!user && isUpdateNotAllowed) {
    return res.status(400).send('Request is not valid');
  }

  user.role = role;
  await user.save();
  res.status(200).send(user);
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      return middleware({
        req,
        res,
        callback: updateUserRole,
        schema: UserRoleSchema,
        roles: [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN],
      });
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(handler);
