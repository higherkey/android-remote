# Hosting & Distribution Plan

This document outlines the strategy for hosting and sharing the **TV Remote** app with users.

## ⚠️ Why not GitHub Pages?
While GitHub Pages is excellent for static websites, this app is a **native mobile application** built with Expo. It relies on low-level networking capabilities (TCP/TLS and mDNS) that are **blocked by web browser security sandboxes**. 

A web-hosted version would not be able to discover or communicate with TVs on the local network.

---

## 🚀 Recommended Distribution: Android APK

The most effective way to share this app for testing or portfolio demonstration is by providing a direct Android APK.

### 1. Build Requirements
- **Expo Account:** Free account at [expo.dev](https://expo.dev).
- **EAS CLI:** `npm install -g eas-cli`

### 2. Building the APK
We use **EAS (Expo Application Services)** to build the APK in the cloud. Run the following command:

```powershell
eas build -p android --profile preview
```

### 3. Distribution via GitHub Releases
To make the app "online" and accessible to others:
1. Complete the build using the command above.
2. Download the resulting `.apk` file from the Expo dashboard.
3. Create a new **Release** in the GitHub repository.
4. Upload the `.apk` as a binary asset to that release.
5. Provide the release link in the project `README.md`.

---

## 📱 Future Options

| Method | Target | Effort | Best For |
| :--- | :--- | :--- | :--- |
| **GitHub Releases** | Android | Low | Beta testing, Portfolio sharing |
| **EAS Update** | All | Medium | Over-the-air (OTA) bug fixes |
| **Google Play Store** | Android | High | Public distribution |
| **Apple App Store** | iOS | High | Public distribution |

---

## 🛠️ Configuration Files
The following files have been configured to support this plan:
- `app.json`: Added `android.package` identifier (`com.higherkey.androidremote`).
- `eas.json`: Added `preview` profile with `buildType: "apk"`.
