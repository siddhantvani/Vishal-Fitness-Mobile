# Vishal Fitness — Mobile Application

Cross-platform mobile application for Vishal Fitness gym members and trainers, built with React Native and Expo.

---

## 📱 Project Overview

The **Vishal Fitness Mobile App** provides an intuitive mobile experience for gym members:
- Member authentication (Login, Register, Profile)
- Real-time gym class browsing and slot booking
- Trainer profiles and specialties
- Personalized workout routines with exercise breakdown
- Body weight and measurements progress tracking
- Class attendance check-ins and history
- Dark and Light theme support with glassmorphism UI

---

## 🛠️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 51+)
- **Language:** TypeScript
- **Navigation:** React Navigation (Stack & Bottom Tabs)
- **Icons:** Lucide React Native / Expo Vector Icons
- **State & Storage:** React Context API + `@react-native-async-storage/async-storage`
- **Networking:** Axios with interceptors for JWT token handling
- **Styling:** Custom StyleSheet system with adaptive dark/light design tokens

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli` or via `npx expo`)
- [Expo Go](https://expo.dev/go) app installed on your physical iOS or Android device (available on App Store & Google Play Store)
- Or Android Studio (for Android Emulator) / Xcode (for macOS iOS Simulator)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/siddhantvani/Vishal-Fitness-Mobile.git
cd Vishal-Fitness-Mobile
npm install
```

### 3. Environment Configuration

Copy the example environment configuration:

```bash
cp .env.example .env
```

Configure `EXPO_PUBLIC_API_URL` based on your development setup:

```env
# For Android Emulator:
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api

# For iOS Simulator:
EXPO_PUBLIC_API_URL=http://localhost:5000/api

# For Physical Device (Expo Go on same Wi-Fi network):
EXPO_PUBLIC_API_URL=http://<YOUR_COMPUTER_LAN_IP>:5000/api
```

> **NOTE:** Physical mobile devices cannot connect to `localhost`. Ensure your mobile device and computer are on the same Wi-Fi network and use your computer's local IP address (e.g. `http://192.168.1.50:5000/api`).

---

## 📲 Running with Expo Go

Start the Expo development server:

```bash
npx expo start
```

1. A QR code will appear in the terminal.
2. **Android:** Open the **Expo Go** app and tap **Scan QR Code**.
3. **iOS:** Open the default **Camera** app, scan the QR code, and tap the notification to open Expo Go.

---

## 💻 Development Commands

| Command | Description |
| :--- | :--- |
| `npm start` / `npx expo start` | Start Metro bundler & Expo dev server |
| `npx expo start -c` | Start with a cleared cache |
| `npm run android` | Open the app directly in an Android emulator |
| `npm run ios` | Open the app directly in an iOS simulator (macOS only) |
| `npm run web` | Run the application in the web browser |

---

## 🏗️ Production Builds (EAS Build)

To build standalone APK/AAB for Android or IPA for iOS using Expo Application Services (EAS):

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   eas login
   ```
3. Configure the project:
   ```bash
   eas build:configure
   ```
4. Trigger production build:
   ```bash
   # Android APK / AAB
   eas build --platform android --profile production

   # iOS IPA
   eas build --platform ios --profile production
   ```

---

## 📁 Project Structure

```
mobile-app/
├── assets/             # App icons, splash screens, and images
├── src/
│   ├── api/            # API client configuration and endpoints
│   ├── components/     # Reusable UI components (GlassCard, Header, etc.)
│   ├── context/        # AuthContext, ThemeContext
│   ├── navigation/     # App navigation (Tabs, Stacks)
│   ├── screens/        # Screen components (Login, Classes, Bookings, etc.)
│   └── types/          # TypeScript interfaces and models
├── .env.example        # Safe template for environment variables
├── app.json            # Expo configuration (name, slug, splash, orientation)
├── App.tsx             # Application entry point with providers
└── package.json
```

---

## 📄 License

ISC License. All rights reserved.
