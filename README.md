# Pixel Refresh — OLED Treatment

Professional pixel refresh and screen maintenance tool for OLED displays. Features color cycling, brightness control, and immersive treatment sessions.

## Tech Stack

- **Framework**: React Native + Expo (TypeScript, strict mode)
- **Navigation**: expo-router (file-based)
- **UI**: Custom components only — no UI library

## Prerequisites

- Node.js >= 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npx expo`)
- For native builds: [EAS CLI](https://docs.expo.dev/build/introduction/) (`npm i -g eas-cli`)

## Getting Started

```bash
npm install
npx expo start
```

Press `a` for Android, `i` for iOS, or `w` for web.

## Project Structure

```
app/
  _layout.tsx        → Root layout (Stack navigator)
  index.tsx          → Settings screen
  session.tsx        → Full-screen refresh screen
components/
  ModeChip.tsx       → Mode selection chip
  DurationPicker.tsx → Duration option picker
  SliderControl.tsx  → Labeled slider with badge
  Slider.tsx         → Custom pan-based slider
  ToggleRow.tsx      → Toggle switch row
```

## Building

### Development Build

```bash
npx expo run:android
npx expo run:ios
```

### Production Build (EAS)

```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```

### Web Export

```bash
npm run build:web
```

## CI/CD

GitHub Actions workflows are configured in `.github/workflows/`:

- **`lint.yml`** — TypeScript type-check on every push/PR
- **`eas-build.yml`** — EAS Build triggered on push to `main` or manual dispatch

To use EAS Build in CI, add the `EXPO_TOKEN` secret to your GitHub repository settings.
Generate one at https://expo.dev/accounts/[account]/settings/access-tokens.

## Key Dependencies

- `expo-keep-awake` — keep screen on during session
- `expo-brightness` — set brightness to max on start
- `expo-status-bar` — hide status bar on play screen
- `react-native-gesture-handler` — tap to pause
- `react-native-reanimated` — smooth animations
