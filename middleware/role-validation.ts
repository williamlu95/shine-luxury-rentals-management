import { NextApiRequest, NextApiResponse } from 'next';

type ValidateRolesParams = {
  req: NextApiRequest;
  res: NextApiResponse;
  roles?: string[];
};

export default async function validateRoles({
  req,
  res,
  roles = [],
}: ValidateRolesParams) {
  if (!roles.length) {
    return;
  }

  const userRole = req.session.user?.role || '';

  if (!userRole || !roles.includes(userRole)) {
    res.status(401).send('Unauthorized');
    throw new Error('User does not have valid role');
  }
}
