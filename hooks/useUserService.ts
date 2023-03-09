import axios from 'axios';
import { toast } from 'react-toastify';
import { UserModel } from '../types/user';

export default function useUserService() {
  const getUsers = async (): Promise<UserModel[]> => {
    try {
      const response = await axios.get('/api/users');
      return response.data;
    } catch (err) {
      console.error('Fetching users failed: ', err);
      toast.error('Unable to retrieve users.');
      return [];
    }
  };

  const updateUserRole = async (
    userId: string,
    role: string,
  ): Promise<boolean> => {
    try {
      await axios.put(`/api/users/${userId}`, { role });
      toast.success('User role successfully updated.');
      return true;
    } catch (err) {
      console.error('Updating user failed: ', err);
      toast.error('Unable to update user role.');
      return false;
    }
  };

  return {
    getUsers,
    updateUserRole,
  };
}
