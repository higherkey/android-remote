# 📺 TV Remote

A React Native (Expo) app that turns your phone into a fully-featured remote control for any **Google TV / Android TV** on your local network — with no extra hardware or subscriptions required.

---

## Overview

TV Remote uses the **Android TV Remote Service protocol** over your Wi-Fi network to discover, pair with, and control your TV directly from your phone. The goal is to feel as intuitive as a real remote — just open the app, tap your TV, and start using it.

The first time you connect to a TV, it will ask you to enter a PIN shown on screen. After that, your credentials are stored securely on-device and future connections are instant and PIN-free.

---

## Features

- **Auto-Discovery** — Scans your local network via mDNS/Zeroconf and lists all Google TVs and Android TVs it finds. No manual IP entry needed.
- **One-Tap Connect** — Tap a discovered TV to connect. A pairing PIN prompt appears automatically if it's the first time.
- **Secure Pairing** — Pairing certificates are saved in the device's secure keystore so you only have to enter a PIN once per TV.
- **Power Button** — A clearly marked power button at the top of the remote to turn the TV on or off.
- **Wake on LAN** — Supports sending a WOL magic packet to wake a TV that is completely powered off (requires the TV's Wi-Fi card to support WOL).
- **D-Pad Navigation** — Large circular D-pad for navigating the TV interface with Up, Down, Left, Right, and Center (OK/Select).
- **Navigation Controls** — Back, Home, and Menu buttons in a dedicated row.
- **Volume Rocker** — A physical-style rocker button for Volume Up / Volume Down, plus a mute toggle.
- **Number Pad** — Pop-up numpad (0–9) for channel selection or numeric input.
- **Keyboard Input** — Pop-up keyboard overlay that streams keystrokes directly to the TV in real time as you type.
- **Google Assistant** — Dedicated Assistant button to trigger voice commands on the TV.
- **Haptic Feedback** — Every button press delivers a light haptic tap for a satisfying, physical feel.
- **Dark Mode UI** — Sleek dark interface designed to be comfortable to use in a dimly lit room.

---

## App Flow

```
Launch App
    │
    ▼
Discovery Screen
  (Scans network, lists found TVs)
    │
    ▼  (tap a TV)
Pairing Screen
  (First time: Enter PIN shown on TV)
  (Returning:  Auto-connects instantly)
    │
    ▼
Remote Control
  (Full remote UI — power, D-pad, volume, keyboard, numpad)
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React Native + Expo | Cross-platform mobile app framework |
| `react-native-androidtv-remote` | Android TV Remote Service protocol (TLS pairing + key sending) |
| `react-native-zeroconf` | mDNS network discovery |
| `react-native-tcp-socket` | Low-level TCP networking |
| `expo-secure-store` | Secure on-device storage for pairing certificates |
| `expo-haptics` | Haptic feedback on button presses |
| `wake_on_lan` | Wake-on-LAN magic packet support |
| TypeScript | Type safety throughout |

---

## Requirements

- **Node.js** >= 18
- **Expo CLI** (or use `npx expo`)
- **Android device or emulator** with Android 9+ *(iOS also supported)*
- Your phone and TV must be on the **same Wi-Fi network**
- Your TV must have **Android TV Remote Service** enabled (it is on by default on most Google TVs)

---

## Running & Emulating

### 1. Install dependencies

```bash
npm install
```

### 2. Start the Expo dev server

```bash
npm start
# or
npx expo start
```

This opens the Expo developer menu in your terminal.

### 3. Run on a device or emulator

| Target | Command |
|---|---|
| Android device (via Expo Go) | Scan the QR code with the Expo Go app |
| Android emulator | Press `a` in the Expo terminal |
| iOS device (via Expo Go) | Scan the QR code with the Camera app |
| iOS simulator | Press `i` in the Expo terminal |
| Web (limited, no BLE/TCP) | Press `w` in the Expo terminal |

```bash
# Shorthand commands
npm run android   # Open directly on Android emulator/device
npm run ios       # Open directly on iOS simulator/device
npm run web       # Open in browser
```

> **Note:** Network discovery and TV pairing require a **real device** on the same Wi-Fi as your TV. Android/iOS emulators are isolated from your local network and cannot discover TVs.

### 4. Using a Development Build (recommended for full functionality)

Because this app uses native modules (`react-native-tcp-socket`, `react-native-zeroconf`, `react-native-androidtv-remote`), **Expo Go has limited support**. For the best experience, build a development client:

```bash
# Install EAS CLI
npm install -g eas-cli

# Build a local development client for Android
npx expo run:android

# Build a local development client for iOS
npx expo run:ios
```

This compiles the native code and installs the app directly on your device, where all features will work.

---

### 4. Hosting & Distribution
To host this app online for others to use, see the [Hosting & Distribution Guide](./docs/hosting-and-distribution.md).

---

## Project Structure

```
android-remote/
├── App.tsx                        # Root component — handles screen routing
├── src/
│   ├── components/
│   │   ├── DiscoveryScreen.tsx    # Network scan + TV list UI
│   │   ├── PairingScreen.tsx      # PIN entry + connecting state UI
│   │   └── RemoteControl.tsx      # Main remote UI (D-pad, volume, buttons)
│   └── hooks/
│       ├── useDiscovery.ts        # mDNS scanning hook
│       └── useRemote.ts           # Connection, pairing, key sending, WoL hook
├── app.json                       # Expo app configuration
└── package.json
```

---

## Permissions

The app requests the following permissions automatically:

| Permission | Reason |
|---|---|
| `ACCESS_WIFI_STATE` | Detect Wi-Fi connectivity |
| `ACCESS_NETWORK_STATE` | Monitor network state |
| `CHANGE_WIFI_MULTICAST_STATE` | Enable mDNS multicast for TV discovery |
| `INTERNET` | Connect to the TV over TCP/TLS |
| Local Network (iOS) | Discover Google TVs via Bonjour/mDNS |

---

## Troubleshooting

**TV not showing up in the list**
- Make sure your phone is on the **same Wi-Fi network** as your TV (not a guest network).
- Try pressing **Refresh List** on the discovery screen.
- Restart the Android TV Remote Service on your TV: Settings → Apps → Android TV Remote Service → Force Stop, then reopen the app.

**Stuck on "Connecting..."**
- The TV may be waiting to prompt you for a PIN. Check your TV screen.
- If there's no PIN prompt, try disconnecting and reconnecting.

**PIN prompt not appearing on TV**
- Go to TV Settings and ensure **Network & Internet** → **IP address** is visible and that the Remote Service is enabled.

**Wake on LAN not working**
- WOL requires the TV's Wi-Fi card to support magic packets and that this is enabled in the TV's power/network settings. Not all TVs support it.
