import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  CssBaseline,
  darkScrollbar,
} from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import '../styles.css';
import { useMemo } from 'react';
import { grey } from '@mui/material/colors';

export default function App({ Component, pageProps }: AppProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const mode = prefersDarkMode ? 'dark' : 'light';

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        typography: {
          allVariants: {
            textTransform: 'none',
          },
        },
        components: {
          MuiImageList: {
            styleOverrides: {
              root: {
                gridAutoFlow: 'column',
                gridTemplateColumns: 'repeat(auto-fill, 120px)',
                gridAutoColumns: '120px',
              },
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              html: {
                ...darkScrollbar(
                  mode === 'light'
                    ? {
                        track: grey[200],
                        thumb: grey[400],
                        active: grey[400],
                      }
                    : undefined,
                ),
                //scrollbarWidth for Firefox
                scrollbarWidth: 'thin',
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={mode}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Component {...pageProps} />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
