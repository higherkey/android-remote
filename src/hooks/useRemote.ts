import { useState, useEffect, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';
// @ts-ignore
import { AndroidRemote, RemoteKeyCode, RemoteDirection } from 'react-native-androidtv-remote';
import wol from 'wake_on_lan';

// Mapping for standard characters to Android TV KeyCodes
const CHAR_TO_KEYCODE: Record<string, number> = {
  'a': 29, 'b': 30, 'c': 31, 'd': 32, 'e': 33, 'f': 34, 'g': 35, 'h': 36, 'i': 37, 'j': 38,
  'k': 39, 'l': 40, 'm': 41, 'n': 42, 'o': 43, 'p': 44, 'q': 45, 'r': 46, 's': 47, 't': 48,
  'u': 49, 'v': 50, 'w': 51, 'x': 52, 'y': 53, 'z': 54,
  '0': 7, '1': 8, '2': 9, '3': 10, '4': 11, '5': 12, '6': 13, '7': 14, '8': 15, '9': 16,
  ' ': 62, ',': 55, '.': 56, '/': 76, ';': 74, "'": 75, '[': 71, ']': 72, '\\': 73, '-': 69, '=': 70,
  '`': 68, '@': 77, '#': 18, '*': 17, '+': 81,
};

export type ConnectionStatus = 'DISCONNECTED' | 'CONNECTING' | 'PAIRING' | 'CONNECTED';

export function useRemote(host: string | null) {
  const [status, setStatus] = useState<ConnectionStatus>('DISCONNECTED');
  const [error, setError] = useState<string | null>(null);
  const remoteRef = useRef<any>(null);

  useEffect(() => {
    if (!host) {
      if (remoteRef.current && typeof remoteRef.current.stop === 'function') {
        remoteRef.current.stop();
      }
      setStatus('DISCONNECTED');
      setError(null);
      return;
    }

    const connect = async () => {
      setStatus('CONNECTING');
      setError(null);
      
      try {
        const savedCertStr = await SecureStore.getItemAsync(`cert_${host}`);
        let cert = savedCertStr ? JSON.parse(savedCertStr) : {
          key: null,
          cert: null,
          androidKeyStore: 'AndroidKeyStore',
          certAlias: 'remotectl-cert',
          keyAlias: 'remotectl-key',
        };
        
        const options = {
          pairing_port: 6467,
          remote_port: 6466,
          service_name: 'com.expo.tvremote',
          systeminfo: {
            manufacturer: 'Custom',
            model: 'Remote'
          },
          cert: cert
        };

        const remote = new AndroidRemote(host, options);
        remoteRef.current = remote;

        remote.on('secret', () => {
          console.log('[Remote] TV asked for pairing PIN');
          setStatus('PAIRING');
        });

        remote.on('ready', async () => {
          console.log('[Remote] Connected successfully!');
          setStatus('CONNECTED');
          // Save the certificate so future connections to this host bypass the pairing PIN
          if (typeof remote.getCertificate === 'function') {
            const newCert = remote.getCertificate();
            if (newCert) {
              await SecureStore.setItemAsync(`cert_${host}`, JSON.stringify(newCert));
            }
          }
        });

        remote.on('error', (err: any) => {
          console.warn('[Remote Error]', err);
          setError(err?.message || 'Connection lost');
          setStatus('DISCONNECTED');
        });

        remote.on('powered', (isPoweredOn: boolean) => {
          console.log('[Remote] TV Power State:', isPoweredOn);
        });

        await remote.start();

      } catch (e: any) {
        console.error('[Remote Init Error]', e);
        setError(e.message || 'Failed to initialize connection');
        setStatus('DISCONNECTED');
      }
    };

    connect();

    return () => {
      if (remoteRef.current) {
        // Disconnect cleanly if component unmounts
        remoteRef.current.stop?.();
      }
    };
  }, [host]);

  const sendPin = (pin: string) => {
    if (remoteRef.current && status === 'PAIRING') {
      remoteRef.current.sendCode(pin);
    }
  };

  const sendKey = (key: number, direction: number = RemoteDirection.SHORT) => {
    if (remoteRef.current && status === 'CONNECTED') {
      remoteRef.current.sendKey(key, direction);
    }
  };

  const sendText = (text: string) => {
    if (remoteRef.current && status === 'CONNECTED') {
      // Loop through characters and send keycodes
      for (let i = 0; i < text.length; i++) {
        const char = text[i].toLowerCase();
        const keyCode = CHAR_TO_KEYCODE[char];
        if (keyCode !== undefined) {
          remoteRef.current.sendKey(keyCode, RemoteDirection.SHORT);
        }
      }
    }
  };

  const wakeTV = (macAddress: string) => {
    // Sends a magic packet broadcast to wake up the TV if its Wi-Fi card supports it
    wol.wake(macAddress, (error: any) => {
      if (error) {
        console.warn('[WOL] Failed to send Magic Packet:', error);
      } else {
        console.log('[WOL] Magic Packet sent to', macAddress);
      }
    });
  };

  return { status, error, sendPin, sendKey, sendText, wakeTV, RemoteKeyCode, RemoteDirection };
}
