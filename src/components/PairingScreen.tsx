import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';

interface Props {
  readonly tvName: string;
  readonly onPinSubmit: (pin: string) => void;
  readonly onCancel: () => void;
  readonly isConnecting?: boolean;
}

export function PairingScreen({ tvName, onPinSubmit, onCancel, isConnecting }: Props) {
  const [pin, setPin] = useState('');

  const handleSubmit = () => {
    if (pin.length === 6) {
      onPinSubmit(pin);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Pair with TV</Text>
        <Text style={styles.subtitle}>
          Please look at your {tvName} screen and enter the 6-digit PIN below to connect securely.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.pinInput}
            value={pin}
            onChangeText={text => setPin(text.replaceAll(/\D/g, '').slice(0, 6))}
            keyboardType="numeric"
            autoFocus={true}
            maxLength={6}
            placeholder="000000"
            placeholderTextColor="#48484A"
            editable={!isConnecting}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, (pin.length < 6 || isConnecting) && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={pin.length < 6 || isConnecting}
        >
          {isConnecting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Pair Device</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={onCancel}
          disabled={isConnecting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#A1A1AA',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 21,
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 28,
    alignItems: 'center',
  },
  pinInput: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 10,
    color: '#0A84FF',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#2C2C2E',
    paddingBottom: 8,
    width: '80%',
  },
  submitButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#0A84FF50',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF453A',
    fontSize: 16,
    fontWeight: '600',
  },
});
