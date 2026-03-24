import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DiscoveryScreen } from './src/components/DiscoveryScreen';
import { PairingScreen } from './src/components/PairingScreen';
import { RemoteControl } from './src/components/RemoteControl';
import { useRemote } from './src/hooks/useRemote';
import { DiscoveredDevice } from './src/hooks/useDiscovery';

export default function App() {
  const [selectedTv, setSelectedTv] = useState<DiscoveredDevice | null>(null);

  // Extract IP Address from mDNS service
  const host = selectedTv?.addresses?.[0] || null;
  const { status, error, sendPin, sendKey, sendText, RemoteKeyCode, RemoteDirection } = useRemote(host);

  const handleDisconnect = () => {
    setSelectedTv(null);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        
        {/* If no TV is selected, scan the network */}
        {!selectedTv && (
          <DiscoveryScreen onSelectDevice={setSelectedTv} />
        )}

        {/* Show pairing screen if we selected a device and it requests a PIN or is connecting */}
        {selectedTv && (status === 'CONNECTING' || status === 'PAIRING' || status === 'DISCONNECTED') && (
          <View style={styles.flexContainer}>
            {error && status === 'DISCONNECTED' && (
               <View style={styles.errorBanner}>
                 <Text style={styles.errorText}>{error}</Text>
               </View>
            )}
            <PairingScreen
              tvName={selectedTv.name}
              isConnecting={status === 'CONNECTING'}
              onPinSubmit={sendPin}
              onCancel={handleDisconnect}
            />
          </View>
        )}

        {/* Show the main remote if fully authenticated and ready */}
        {selectedTv && status === 'CONNECTED' && (
          <RemoteControl
            tvName={selectedTv.name}
            sendKey={sendKey}
            sendText={sendText}
            RemoteKeyCode={RemoteKeyCode}
            RemoteDirection={RemoteDirection}
            onDisconnect={handleDisconnect}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  flexContainer: {
    flex: 1,
  },
  errorBanner: {
    backgroundColor: '#FF453A20',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FF453A',
  },
  errorText: {
    color: '#FF453A',
    textAlign: 'center',
    fontWeight: '600',
  }
});
