import { Container, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import equal from 'fast-deep-equal';
import AddRentalOverlay from '../components/AddRentalOverlay';
import EditRentalOverlay from '../components/EditRentalOverlay';
import NavBar from '../components/NavBar';
import RentalActions from '../components/RentalActions';
import RentalTable from '../components/RentalTable';
import { LOCATION } from '../constants/locations';
import { USER_ROLE } from '../constants/users';
import useRentalService from '../hooks/useRentalService';
import { withSessionSsr } from '../lib/withSession';
import { Location } from '../types/locations';
import { RentalModel } from '../types/rentals';
import { User } from '../types/user';
import { resetServerContext } from 'react-beautiful-dnd';

type Props = {
  user: User;
};

export default function Rentals({ user }: Props): JSX.Element {
  const { getRentals, updateRentalsOrder } = useRentalService();
  const [allRentals, setAllRentals] = useState<RentalModel[]>([]);
  const [rentals, setRentals] = useState<RentalModel[]>([]);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [rental, setRental] = useState<RentalModel>();
  const [searchValue, setSearchValue] = useState('');
  const [location, setLocation] = useState<Location>(LOCATION.LAS_VEGAS);

  const fetchRentals = async () => {
    const newRentals = await getRentals();
    setAllRentals(newRentals);
    const filteredRentals: RentalModel[] = newRentals.filter((r) =>
      equal(r.location, location),
    );

    setRentals(filteredRentals);
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

  const handleLocationChange = (newLocation: Location) => {
    setLocation(newLocation);
    const filteredRentals: RentalModel[] = allRentals.filter((r) =>
      equal(r.location, newLocation),
    );

    setRentals(filteredRentals);
  };

  const handleReorder = async (fromId?: string, toId?: string) => {
    const fromIndex = rentals.findIndex((r) => r._id === fromId);
    const toIndex = rentals.findIndex((r) => r._id === toId);
    const newOrderRentals = structuredClone(rentals);
    const [removed] = newOrderRentals.splice(fromIndex, 1);
    newOrderRentals.splice(toIndex, 0, removed);
    setRentals(newOrderRentals);
    await updateRentalsOrder(newOrderRentals.map(({ _id }) => _id || ''));
    await fetchRentals();
  };

  const isEditable = () => {
    return user.role === USER_ROLE.ADMIN || user.role === USER_ROLE.SUPER_ADMIN;
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
          location={location}
          isOpen={isAddDrawerOpen}
          onClose={handleDrawerClose}
        />
        <EditRentalOverlay
          location={location}
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
          location={location}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onLocationChange={handleLocationChange}
        />

        <RentalTable
          isEditable={isEditable()}
          rentals={filterRentals()}
          onRentalClick={handleRentalClick}
          onAddRentalClick={handleButtonClick}
          onReorder={handleReorder}
        />
      </Container>
    </Stack>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    resetServerContext();

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
