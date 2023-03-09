import { Container, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import EditRolePopup from '../../components/EditRolePopup';
import NavBar from '../../components/NavBar';
import UserActions from '../../components/UserActions';
import UserTable from '../../components/UserTable';
import { USER_ROLE } from '../../constants/users';
import useUserService from '../../hooks/useUserService';
import { withSessionSsr } from '../../lib/withSession';
import { User, UserModel } from '../../types/user';

type Props = {
  pageUser: User;
};

export default function Users({ pageUser }: Props): JSX.Element {
  const { getUsers } = useUserService();

  const [users, setUsers] = useState<UserModel[]>([]);
  const [user, setUser] = useState<UserModel>();
  const [isEditRolePopupOpen, setIsEditRolePopupOpen] = useState(false);

  const [searchValue, setSearchValue] = useState('');

  const fetchUsers = async () => {
    const newUsers = await getUsers();
    setUsers(newUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserEditRoleClick = (user: UserModel) => {
    setUser(user);
    setIsEditRolePopupOpen(true);
  };

  const handlePopupClose = async (shouldRefresh: boolean) => {
    setIsEditRolePopupOpen(false);
    setUser(undefined);
    shouldRefresh && fetchUsers();
  };

  const filterUsers = () =>
    users.filter((user) =>
      `${user.familyName}${user.givenName}${user.email}`
        .toLowerCase()
        .includes(searchValue.toLocaleLowerCase()),
    );

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <Stack height="100vh">
      <NavBar userRole={pageUser.role} />
      <Container
        sx={{
          height: 'calc(100% - 57px)',
          display: 'flex',
          flexDirection: 'column',
          pb: 4,
        }}
      >
        <EditRolePopup
          user={user}
          pageUserRole={pageUser?.role}
          isOpen={isEditRolePopupOpen}
          onConfirm={handlePopupClose}
        />

        <Stack direction="column" py={2}>
          <Typography variant="h4" fontWeight={300} pt={2}>
            Users
          </Typography>
          <Divider />
        </Stack>

        <UserActions
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
        />

        <UserTable
          users={filterUsers()}
          onUserEditRoleClick={handleUserEditRoleClick}
        />
      </Container>
    </Stack>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (!user || user.role === USER_ROLE.MEMBER) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: {
        pageUser: req.session.user,
      },
    };
  },
);
