import {
  Button,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useGatewayService from '../../hooks/useGatewayService';
import EntryFormContainer from '../../components/EntryFormContainer';
import PasswordField from '../../components/PasswordField';
import { withSessionSsr } from '../../lib/withSession';
import { useState } from 'react';

const RegisterSchema = z
  .object({
    givenName: z.string({
      required_error: 'Please enter your first name.',
      invalid_type_error: 'Invalid first name.',
    }),
    familyName: z.string({
      required_error: 'Please enter your last name.',
      invalid_type_error: 'Invalid last name.',
    }),
    email: z
      .string({
        required_error: 'Please enter your email.',
        invalid_type_error: 'Invalid email.',
      })
      .email('Invalid email'),
    password: z
      .string({
        required_error: 'Please enter your password.',
        invalid_type_error: 'Invalid password.',
      })
      .min(8, 'Password must be at least 8 characters long.'),
    confirmPassword: z.string({
      required_error: 'Please confirm your password.',
      invalid_type_error: 'Invalid password confirmation.',
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: 'custom',
        message: 'The password does not match.',
      });
    }
  });

type Register = z.input<typeof RegisterSchema>;

export default function Register(): JSX.Element {
  const { register } = useGatewayService();
  const [registering, setRegistering] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Register>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      givenName: '',
      familyName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<Register> = async (data) => {
    setRegistering(true);
    await register(data);
    setRegistering(false);
  };

  return (
    <EntryFormContainer onFormSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="givenName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            error={!!errors?.givenName}
            helperText={errors?.givenName?.message}
            autoComplete="given-name"
            label="First Name"
          />
        )}
      />
      <Controller
        name="familyName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            error={!!errors?.familyName}
            helperText={errors?.familyName?.message}
            autoComplete="family-name"
            label="Last Name"
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            error={!!errors?.email}
            helperText={errors?.email?.message}
            autoComplete="email"
            label="Email"
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <PasswordField
            {...field}
            error={!!errors?.password}
            helperText={errors?.password?.message}
            autoComplete="new-password"
            label="Password"
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <PasswordField
            {...field}
            error={!!errors?.confirmPassword}
            helperText={errors?.confirmPassword?.message}
            autoComplete="new-password"
            label="Confirm Password"
          />
        )}
      />
      <Button
        disabled={registering}
        endIcon={registering ? <CircularProgress size={20} /> : undefined}
        type="submit"
        variant="contained"
      >
        Sign Up
      </Button>

      <Typography variant="body2" textAlign="center">
        Already have an account? <Link href="/login">Login</Link>
      </Typography>
    </EntryFormContainer>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (user) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  },
);
