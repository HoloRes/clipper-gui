import { useEffect, useState } from 'react';
import Head from 'next/head';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import red from '@material-ui/core/colors/red';

export default function App(props) {
  const { Component, pageProps } = props;
  const [darkMode, setDarkMode] = useState(false);

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#556cd6',
      },
      secondary: {
        main: '#19857b',
      },
      // eslint-disable-next-line sort-keys
      error: {
        main: red.A400,
      },
      type: darkMode ? 'dark' : 'light',
    },
  });

  function toggleDarkMode() {
    setDarkMode(!darkMode);
    window?.api?.send('setDarkMode', !darkMode);
  }

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    window?.api?.send('getDarkMode');
    window?.api?.receive('getDarkMode', storeDarkMode => {
      if (storeDarkMode) setDarkMode(storeDarkMode);
    });
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <title>Clipper tool</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} toggleDarkMode={toggleDarkMode} />
      </ThemeProvider>
    </>
  );
}
