import axios from 'axios';
import { toast } from 'react-toastify';
import { Location } from '../types/locations';
import { RentalModel } from '../types/rentals';

export default function useRentalService() {
  const getRentals = async (): Promise<RentalModel[]> => {
    try {
      const response = await axios.get('/api/rentals');
      return response.data;
    } catch (err) {
      console.error('Fetching rentals failed: ', err);
      toast.error('Unable to retrieve rentals.');
      return [];
    }
  };

  const createRental = async (
    rental: RentalModel,
    location: Location,
  ): Promise<boolean> => {
    try {
      await axios.post('/api/rentals', { ...rental, location });
      toast.success('Rental successfully saved.');
      return true;
    } catch (err) {
      console.error('Saving rentals failed: ', err);
      toast.error('Unable to save rental.');
      return false;
    }
  };

  const updateRental = async (
    rentalId: string,
    rental: RentalModel,
    location: Location,
  ): Promise<boolean> => {
    try {
      await axios.put(`/api/rentals/${rentalId}`, { ...rental, location });
      toast.success('Rental successfully updated.');
      return true;
    } catch (err) {
      console.error('Updating rentals failed: ', err);
      toast.error('Unable to update rental.');
      return false;
    }
  };

  const deleteRental = async (rentalId: string): Promise<boolean> => {
    try {
      await axios.delete(`/api/rentals/${rentalId}`);
      toast.success('Rental successfully deleted.');
      return true;
    } catch (err) {
      console.error('Deleting rentals failed: ', err);
      toast.error('Unable to delete rental.');
      return false;
    }
  };

  return {
    getRentals,
    createRental,
    updateRental,
    deleteRental,
  };
}
