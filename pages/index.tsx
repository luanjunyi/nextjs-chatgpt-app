import * as React from 'react';

import { Container, useTheme } from '@mui/joy';
import { Socket } from 'socket.io-client';

import { Chat } from '@/components/Chat';
import { NoSSR } from '@/components/util/NoSSR';
import { SettingsModal } from '@/components/dialogs/SettingsModal';
import { useSettingsStore } from '@/lib/store-settings';
import SocketContext from '../contexts/socket-context';


export default function Home() {
  // state
  const [settingsShown, setSettingsShown] = React.useState(false);

  // external state
  const theme = useTheme();
  const productKey = useSettingsStore(state => state.productKey);
  const centerMode = useSettingsStore(state => state.centerMode);

  // web socket to communicate with backend server
  const socket = React.useContext(SocketContext) as Socket | null


  // show the Settings Dialog at startup if the API key is required but not set
  React.useEffect(() => {
    console.log("Extracted Product Key from local storage: " + productKey);
    if (socket === null) {
      console.log("Socket is null");
      return;
    }
    socket.on('keyValidationResult', (isValid) => {
      console.log("[ws] Received key validation result: " + isValid);
      if (!isValid) {
        setSettingsShown(true);
      }
    });
    socket.on("connect", () => {
      console.log("[ws] Connected to the WebSocket server");
    });

    socket.on("disconnect", () => {
      console.log("[ws] Disconnected from the WebSocket server");
    });

    socket.on("error", (error) => {
      console.log("[ws] error:", error);
    });
    if (productKey) {
      socket.emit('validateProductKey', productKey);
    } else {
      setSettingsShown(true);
    }

  }, [productKey, socket]);


  return (
    /**
     * Note the global NoSSR wrapper
     *  - Even the overall container could have hydration issues when using localStorage and non-default maxWidth
     */
    <NoSSR>

      <Container maxWidth={centerMode === 'full' ? false : centerMode === 'narrow' ? 'md' : 'xl'} disableGutters sx={{
        boxShadow: {
          xs: 'none',
          md: centerMode === 'narrow' ? theme.vars.shadow.md : 'none',
          xl: centerMode !== 'full' ? theme.vars.shadow.lg : 'none',
        },
      }}>

        <Chat onShowSettings={() => setSettingsShown(true)} />

        <SettingsModal open={settingsShown} onClose={() => setSettingsShown(false)} />

      </Container>

    </NoSSR>
  );
}