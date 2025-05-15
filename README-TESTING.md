# FloodCast App Testing Guide

This guide explains how to test the FloodCast app on both simulators and physical devices.

## Testing Options

There are three main ways to test the FloodCast app:

1. **Simulator/Emulator**: Run the app on iOS Simulator or Android Emulator
2. **Development Build**: Create a development build that can be installed on physical devices
3. **Expo Go**: Limited testing with Expo Go (some features won't work)

## Option 1: Testing on Simulator/Emulator

This is the simplest method for development:

```bash
# Start the development server
npx expo start

# Press 'i' to open in iOS Simulator
# Press 'a' to open in Android Emulator
```

## Option 2: Development Build (Recommended for Physical Devices)

This method allows testing all native features (including MapLibre) on physical devices:

### Prerequisites

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Log in to your Expo account:
```bash
eas login
```

### Creating a Development Build

1. Configure the development build:
```bash
# Create or update eas.json if needed
npx eas build:configure
```

2. Create a development build for Android:
```bash
npx expo prebuild
npx eas build --platform android --profile development
```

3. Create a development build for iOS:
```bash
npx expo prebuild
npx eas build --platform ios --profile development
```

4. Install the build on your device:
   - For Android: Download the APK from the EAS build page and install it
   - For iOS: Use TestFlight or install directly via Xcode

### Running the Development Build

1. Start the development server:
```bash
npx expo start --dev-client
```

2. Scan the QR code with your device's camera
3. The app will open and connect to the development server

## Option 3: Limited Testing with Expo Go

Some features (like MapLibre) won't work in Expo Go because they require native modules. However, you can test basic UI and navigation:

```bash
# Start the Expo Go compatible server
npx expo start
```

Then scan the QR code with the Expo Go app on your device.

## Troubleshooting

### White Screen Issues

If you encounter a white screen after login:

1. Check console logs for errors
2. Ensure the map styles are accessible from your device
3. Try using the local fallback style by setting `styleState` to 'local'
4. Verify network connectivity on your device

### Network Issues

If the app can't connect to the development server:

1. Ensure your device is on the same network as your computer
2. Check firewall settings
3. Try using a mobile hotspot from your computer

### MapLibre Specific Issues

If the map doesn't load:

1. Verify that MapLibre is properly installed:
```bash
npx expo install @maplibre/maplibre-react-native
```

2. Ensure the plugin is added to app.json:
```json
"plugins": [
  "@maplibre/maplibre-react-native"
]
```

3. Rebuild the native code:
```bash
npx expo prebuild
```

## Deployment Options

For distributing the app to testers:

1. **Internal Testing**:
```bash
npx eas build --platform all --profile preview
```

2. **Production Build**:
```bash
npx eas build --platform all --profile production
```

Remember that after creating a build with EAS, you'll need to install it on your device before you can use the development client.
