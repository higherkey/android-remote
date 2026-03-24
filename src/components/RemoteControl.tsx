import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

interface Props {
  readonly sendKey: (key: number, direction?: number) => void;
  readonly sendText: (text: string) => void;
  readonly RemoteKeyCode: any;
  readonly RemoteDirection: any;
  readonly tvName: string;
  readonly onDisconnect: () => void;
}

const { width } = Dimensions.get('window');

// Android keycodes for digits 0-9
const DIGIT_KEYCODES = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

export function RemoteControl({ sendKey, sendText, RemoteKeyCode, RemoteDirection, tvName, onDisconnect }: Props) {
  const [showNumpad, setShowNumpad] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handlePress = (key: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sendKey(key, RemoteDirection.SHORT);
  };

  const handleTextChange = (text: string) => {
    if (text.length > 0) {
      sendText(text);
      setInputText('');
    }
  };

  const handleKeyPress = ({ nativeEvent }: any) => {
    if (nativeEvent.key === 'Backspace') {
      handlePress(RemoteKeyCode.KEYCODE_DEL);
    } else if (nativeEvent.key === 'Enter') {
      handlePress(RemoteKeyCode.KEYCODE_ENTER);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{tvName}</Text>
          <Text style={styles.headerStatus}>Connected</Text>
        </View>
        <TouchableOpacity style={styles.disconnectButton} onPress={onDisconnect}>
          <Text style={styles.disconnectText}>Disconnect</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.topRow}>
        <TouchableOpacity style={[styles.circleButton, styles.powerButton]} onPress={() => handlePress(RemoteKeyCode.KEYCODE_POWER)}>
          <Text style={[styles.iconText, styles.powerIcon]}>⏻</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.circleButton, styles.assistantButton]} onPress={() => handlePress(RemoteKeyCode.KEYCODE_ASSIST)}>
          <Text style={[styles.iconText, styles.assistantIcon]}>🎙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity style={styles.circleButton} onPress={() => handlePress(RemoteKeyCode.KEYCODE_BACK)}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleButton} onPress={() => handlePress(RemoteKeyCode.KEYCODE_HOME)}>
          <Text style={styles.iconText}>⌂</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleButton} onPress={() => handlePress(RemoteKeyCode.KEYCODE_MENU)}>
          <Text style={styles.iconText}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* D-PAD Container */}
      <View style={styles.dpadContainer}>
        <View style={styles.dpadBackground}>
          {/* UP */}
          <View style={styles.dpadRowTop}>
            <TouchableOpacity style={styles.dpadAreaVertical} onPress={() => handlePress(RemoteKeyCode.KEYCODE_DPAD_UP)}>
              <Text style={styles.dpadIcon}>▲</Text>
            </TouchableOpacity>
          </View>

          {/* MIDDLE */}
          <View style={styles.dpadRowMid}>
            <TouchableOpacity style={styles.dpadAreaHorizontal} onPress={() => handlePress(RemoteKeyCode.KEYCODE_DPAD_LEFT)}>
              <Text style={styles.dpadIconLeft}>◀</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.centerButton} onPress={() => handlePress(RemoteKeyCode.KEYCODE_DPAD_CENTER)}>
              <View style={styles.centerInner} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dpadAreaHorizontal} onPress={() => handlePress(RemoteKeyCode.KEYCODE_DPAD_RIGHT)}>
              <Text style={styles.dpadIconRight}>▶</Text>
            </TouchableOpacity>
          </View>

          {/* DOWN */}
          <View style={styles.dpadRowBottom}>
            <TouchableOpacity style={styles.dpadAreaVertical} onPress={() => handlePress(RemoteKeyCode.KEYCODE_DPAD_DOWN)}>
              <Text style={styles.dpadIcon}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Numpad Overlay */}
      {showNumpad && (
        <View style={styles.numpadOverlay}>
          <View style={styles.numpadHeader}>
            <Text style={styles.numpadTitle}>Number Pad</Text>
            <TouchableOpacity onPress={() => setShowNumpad(false)}>
              <Text style={styles.numpadClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.numpadGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
              <TouchableOpacity
                key={digit}
                style={styles.numpadButton}
                onPress={() => handlePress(DIGIT_KEYCODES[digit])}
              >
                <Text style={styles.numpadDigit}>{digit}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.numpadButton} />
            <TouchableOpacity
              style={styles.numpadButton}
              onPress={() => handlePress(DIGIT_KEYCODES[0])}
            >
              <Text style={styles.numpadDigit}>0</Text>
            </TouchableOpacity>
            <View style={styles.numpadButton} />
          </View>
        </View>
      )}

      {/* Keyboard Overlay */}
      {showKeyboard && (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardOverlay}
        >
          <View style={styles.keyboardHeader}>
            <Text style={styles.keyboardTitle}>Keyboard Input</Text>
            <TouchableOpacity onPress={() => setShowKeyboard(false)}>
              <Text style={styles.keyboardClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              style={styles.textInputFull}
              value={inputText}
              onChangeText={handleTextChange}
              onKeyPress={handleKeyPress}
              placeholder="Type to sync with TV..."
              placeholderTextColor="#48484A"
              autoFocus={true}
              blurOnSubmit={false}
            />
          </View>
          <Text style={styles.keyboardHint}>Keys are sent immediately as you type</Text>
        </KeyboardAvoidingView>
      )}

      {/* Volume Rocker + Utility Toggles */}
      <View style={styles.bottomRow}>
        <View style={styles.rockerContainer}>
          <TouchableOpacity style={styles.rockerButtonTop} onPress={() => handlePress(RemoteKeyCode.KEYCODE_VOLUME_UP)}>
            <Text style={styles.iconText}>+</Text>
          </TouchableOpacity>
          <View style={styles.rockerDivider} />
          <TouchableOpacity style={styles.rockerButtonBottom} onPress={() => handlePress(RemoteKeyCode.KEYCODE_VOLUME_DOWN)}>
            <Text style={styles.iconText}>-</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.utilityControls}>
          <TouchableOpacity
            style={[styles.smallCircleButton, showNumpad && styles.toggleActive]}
            onPress={() => {
              setShowNumpad(prev => !prev);
              setShowKeyboard(false);
            }}
          >
            <Text style={[styles.smallIconText, showNumpad && styles.toggleTextActive]}>123</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallCircleButton, showKeyboard && styles.toggleActive]}
            onPress={() => {
              setShowKeyboard(prev => !prev);
              setShowNumpad(false);
            }}
          >
            <Text style={[styles.smallIconText, showKeyboard && styles.toggleTextActive]}>⌨️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.smallCircleButton} onPress={() => handlePress(RemoteKeyCode.KEYCODE_VOLUME_MUTE)}>
            <Text style={styles.smallIconText}>🔇</Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  headerStatus: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '600',
    marginTop: 4,
  },
  disconnectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
  },
  disconnectText: {
    color: '#FF453A',
    fontSize: 14,
    fontWeight: '600',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 60,
    marginBottom: 20,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  assistantButton: {
    backgroundColor: '#0A84FF20',
    borderWidth: 1,
    borderColor: '#0A84FF50',
  },
  assistantIcon: {
    color: '#0A84FF',
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  powerButton: {
    backgroundColor: '#FF453A20',
    borderWidth: 1,
    borderColor: '#FF453A50',
  },
  iconText: {
    fontSize: 22,
    color: '#fff',
  },
  powerIcon: {
    color: '#FF453A',
  },
  dpadContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  dpadBackground: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    backgroundColor: '#1C1C1E',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  dpadRowTop: {
    flex: 1,
    alignItems: 'center',
  },
  dpadRowMid: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dpadRowBottom: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  dpadAreaVertical: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dpadAreaHorizontal: {
    width: '35%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  centerInner: {
    width: '50%',
    height: '50%',
    borderRadius: 100,
    backgroundColor: '#3A3A3C',
  },
  dpadIcon: {
    color: '#8E8E93',
    fontSize: 20,
  },
  dpadIconLeft: {
    color: '#8E8E93',
    fontSize: 20,
    marginRight: 20,
  },
  dpadIconRight: {
    color: '#8E8E93',
    fontSize: 20,
    marginLeft: 20,
  },
  numpadOverlay: {
    backgroundColor: '#1C1C1E',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  numpadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  numpadTitle: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '600',
  },
  numpadClose: {
    color: '#FF453A',
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 8,
  },
  numpadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  numpadButton: {
    width: (width - 100) / 3,
    height: 52,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numpadDigit: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  keyboardOverlay: {
    backgroundColor: '#1C1C1E',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  keyboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  keyboardTitle: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '600',
  },
  keyboardClose: {
    color: '#FF453A',
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputFull: {
    flex: 1,
    height: 56,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  keyboardHint: {
    color: '#8E8E93',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
  utilityControls: {
    flexDirection: 'column',
    gap: 12,
    justifyContent: 'center',
  },
  smallCircleButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  smallIconText: {
    fontSize: 18,
    color: '#fff',
  },
  toggleActive: {
    backgroundColor: '#0A84FF20',
    borderWidth: 1,
    borderColor: '#0A84FF50',
  },
  toggleTextActive: {
    color: '#0A84FF',
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 40,
  },
  rockerContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 30,
    width: 60,
    height: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  rockerButtonTop: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  rockerButtonBottom: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  rockerDivider: {
    width: '60%',
    height: 1,
    backgroundColor: '#2C2C2E',
  },
});
