import { Box, IconButton, Stack } from '@mui/material';
import { Logout, Group } from '@mui/icons-material';
import Link from 'next/link';
import useGatewayService from '../hooks/useGatewayService';
import { USER_ROLE } from '../constants/users';
import dynamic from 'next/dynamic';
const Logo = dynamic(() => import('./Logo'), { ssr: false });

export default function NavBar({
  userRole,
}: {
  userRole?: string;
}): JSX.Element {
  const { logout } = useGatewayService();

  return (
    <Stack
      direction="row"
      height="50px"
      borderBottom={1}
      px={1}
      alignItems="center"
      justifyContent="space-between"
    >
      <Link href="/">
        <Box sx={{ pt: 2 }}>
          <Logo height={37.5} width={108} />
        </Box>
      </Link>

      <Stack direction="row" alignItems="center">
        {userRole !== USER_ROLE.MEMBER && (
          <IconButton href="/users">
            <Group titleAccess="Users" />
          </IconButton>
        )}

        <IconButton onClick={logout}>
          <Logout titleAccess="Logout" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
