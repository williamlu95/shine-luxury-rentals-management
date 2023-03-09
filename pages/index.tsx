import { Container, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import AddRentalOverlay from '../components/AddRentalOverlay';
import EditRentalOverlay from '../components/EditRentalOverlay';
import NavBar from '../components/NavBar';
import RentalActions from '../components/RentalActions';
import RentalTable from '../components/RentalTable';
import { USER_ROLE } from '../constants/users';
import useRentalService from '../hooks/useRentalService';
import { withSessionSsr } from '../lib/withSession';
import { RentalModel } from '../types/rentals';
import { User } from '../types/user';

type Props = {
  user: User;
};

export default function Rentals({ user }: Props): JSX.Element {
  const { getRentals } = useRentalService();
  const [rentals, setRentals] = useState<RentalModel[]>([]);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [rental, setRental] = useState<RentalModel>();
  const [searchValue, setSearchValue] = useState('');

  const fetchRentals = async () => {
    const newRentals = await getRentals();
    setRentals(newRentals);
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleButtonClick = () => setIsAddDrawerOpen(true);

  const handleDrawerClose = (shouldRefresh: boolean) => {
    setIsAddDrawerOpen(false);
    setIsEditDrawerOpen(false);
    setRental(undefined);
    shouldRefresh && fetchRentals();
  };

  const handleRentalClick = (rental: RentalModel) => {
    setRental(rental);
    setIsEditDrawerOpen(true);
  };

  const filterRentals = () =>
    rentals.filter(({ name }) =>
      name.toLowerCase().includes(searchValue.toLocaleLowerCase()),
    );

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <Stack height="100vh">
      <NavBar userRole={user.role} />
      <Container
        sx={{
          height: 'calc(100% - 57px)',
          display: 'flex',
          flexDirection: 'column',
          pb: 4,
        }}
      >
        <AddRentalOverlay
          isOpen={isAddDrawerOpen}
          onClose={handleDrawerClose}
        />
        <EditRentalOverlay
          rental={rental}
          isOpen={isEditDrawerOpen}
          onClose={handleDrawerClose}
        />

        <Stack direction="column" py={2}>
          <Typography variant="h4" fontWeight={300} pt={2}>
            Rentals
          </Typography>
          <Divider />
        </Stack>

        <RentalActions
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onAddRentalClick={handleButtonClick}
          hideAddButton={user.role === USER_ROLE.MEMBER}
        />

        <RentalTable
          hideChevron={user.role === USER_ROLE.MEMBER}
          rentals={filterRentals()}
          onRentalClick={handleRentalClick}
        />
      </Container>
    </Stack>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: {
        user: req.session.user,
      },
    };
  },
);
