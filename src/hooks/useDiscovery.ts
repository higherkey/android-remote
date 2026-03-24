import { useState, useEffect } from 'react';
import Zeroconf from 'react-native-zeroconf';

// Type definitions for the service returned by react-native-zeroconf
export interface DiscoveredDevice {
  name: string;
  host: string;
  txt: Record<string, any>;
  addresses: string[];
  port: number;
  fullName: string;
}

// Instantiate once outside the hook so event listeners aren't bound multiple times unnecessarily
const zeroconf = new Zeroconf();

export function useDiscovery() {
  const [devices, setDevices] = useState<DiscoveredDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsScanning(true);
    const handleStop = () => setIsScanning(false);
    
    // Helper to avoid deep nesting lint errors
    const appendIfUnique = (prev: DiscoveredDevice[], service: any) => {
      const isDuplicate = prev.some(d => d.host === service.host || d.name === service.name);
      return isDuplicate ? prev : [...prev, service];
    };

    // Fired when a device is fully resolved with an IP address
    const handleResolved = (service: any) => {
      setDevices(prev => appendIfUnique(prev, service));
    };

    const handleError = (err: any) => {
      console.warn('[Zeroconf Error]', err);
    };

    zeroconf.on('start', handleStart);
    zeroconf.on('stop', handleStop);
    zeroconf.on('resolved', handleResolved);
    zeroconf.on('error', handleError);

    // Start scanning specifically for the Android TV Remote protocol
    // The service type is typically "_androidtvremote._tcp."
    zeroconf.scan('androidtvremote', 'tcp', 'local.');

    return () => {
      zeroconf.stop();
      zeroconf.removeListener('start', handleStart);
      zeroconf.removeListener('stop', handleStop);
      zeroconf.removeListener('resolved', handleResolved);
      zeroconf.removeListener('error', handleError);
    };
  }, []);

  const refresh = () => {
    setDevices([]);
    zeroconf.stop();
    // Allow the stop command to propagate before scanning again
    setTimeout(() => {
      zeroconf.scan('androidtvremote', 'tcp', 'local.');
    }, 500);
  };

  return { devices, isScanning, refresh };
}
