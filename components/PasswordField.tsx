import {
  InputAdornment,
  TextField,
  TextFieldProps,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ForwardedRef, forwardRef, useState } from 'react';

type Props = TextFieldProps & {
  forwardedRef: ForwardedRef<HTMLDivElement>;
};

function PasswordField({ forwardedRef, ...props }: Props): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const type = isVisible ? 'text' : 'password';

  const handleClickShowPassword = () => setIsVisible((isVisible) => !isVisible);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <TextField
      {...props}
      ref={forwardedRef}
      type={type}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {isVisible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

const PasswordFieldWithRef = forwardRef<HTMLDivElement, TextFieldProps>(
  (props, ref) => <PasswordField {...props} forwardedRef={ref} />,
);

PasswordFieldWithRef.displayName = 'PasswordField';
export default PasswordFieldWithRef;
