import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDiscovery, DiscoveredDevice } from '../hooks/useDiscovery';

interface Props {
  readonly onSelectDevice: (device: DiscoveredDevice) => void;
}

export function DiscoveryScreen({ onSelectDevice }: Props) {
  const { devices, isScanning, refresh } = useDiscovery();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Find Your TV</Text>
      <Text style={styles.subtitle}>
        Make sure your phone is connected to the same Wi-Fi network as your TV.
      </Text>

      <FlatList
        data={devices}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.deviceCard} 
            onPress={() => onSelectDevice(item)}
            activeOpacity={0.8}
          >
            <View style={styles.deviceIcon}>
              <Text style={styles.iconText}>📺</Text>
            </View>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{item.name}</Text>
              <Text style={styles.deviceIp}>
                {item.addresses?.[0] || 'Unknown IP'} : {item.port}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {isScanning ? (
              <ActivityIndicator size="large" color="#0A84FF" />
            ) : (
              <Text style={styles.emptyText}>No TVs found on this network.</Text>
            )}
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity 
        style={styles.refreshButton} 
        onPress={refresh}
        disabled={isScanning}
      >
        <Text style={styles.refreshButtonText}>
          {isScanning ? 'Scanning...' : 'Refresh List'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#A1A1AA',
    marginBottom: 30,
    lineHeight: 20,
  },
  listContainer: {
    flexGrow: 1,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  deviceIp: {
    fontSize: 12,
    color: '#A1A1AA',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#A1A1AA',
    fontSize: 16,
  },
  refreshButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
