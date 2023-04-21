import * as React from 'react';
import Head from 'next/head';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import { SocketProvider } from '../contexts/socket-context';
import { io as SocketClient, Socket } from 'socket.io-client';

import { createEmotionCache, theme } from '@/lib/theme';
import '../styles/GithubMarkdown.css';


// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }: MyAppProps) {
  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    function getWebSocketUrl() {
      let protocol = 'ws:';
      let port = 2023;
      if (window.location.protocol === 'https:') {
        protocol = window.location.protocol = 'wss:';
        port = 2024;
      }
      const hostname = window.location.hostname;

      const wsUrl = `${protocol}//${hostname}:${port}`;
      return wsUrl;
    }
    const wsURL = getWebSocketUrl();
    const socketInstance = SocketClient(wsURL);
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return <>
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <CssVarsProvider defaultMode='light' theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SocketProvider socket={socket}>
          <Component {...pageProps} />
        </SocketProvider>

      </CssVarsProvider>
    </CacheProvider>
    <VercelAnalytics debug={false} />
  </>;
}