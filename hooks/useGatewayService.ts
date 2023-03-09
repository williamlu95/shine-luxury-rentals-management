import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function useGatewayService() {
  const router = useRouter();

  const authenticate = async (body: { email: string; password: string }) => {
    try {
      await axios.post('api/authenticate', body);
      router.push('/');
    } catch (err) {
      console.error('Login failed: ', err);
      toast.error('Incorrect email or password.');
    }
  };

  const register = async (body: {
    givenName: string;
    familyName: string;
    email: string;
    password: string;
  }) => {
    try {
      await axios.post('api/register', body);
      router.push('/');
    } catch (err) {
      console.error('Register failed: ', err);
      toast.error('Account creation failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await axios.post('api/logout');
    } catch (err) {
      console.error('Logout failed: ', err);
    }

    router.push('/login');
  };

  return {
    authenticate,
    register,
    logout,
  };
}
