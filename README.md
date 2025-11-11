# 🧩 Crossword Master - React Native App

A fully functional, offline-first crossword puzzle application built with React Native and Expo, featuring multiple difficulty levels, statistics tracking, and Google Mobile Ads integration.

## ✨ Features

- **100% Offline Functionality** - All puzzles and data stored locally
- **4 Difficulty Levels** - Easy, Medium, Hard, and Expert
- **Interactive Crossword Grid** - Touch-enabled with smart word selection
- **Custom Keyboard** - Optimized for crossword input with auto-advance
- **Hint System** - Rewarded ads unlock hints for stuck players
- **Statistics Tracking** - Track your progress, completion rate, and best times
- **Auto-Save** - Never lose your progress
- **Light/Dark Theme** - Customizable appearance
- **Google Mobile Ads** - Banner, interstitial, and rewarded ads
- **Haptic Feedback** - Enhanced user experience with vibrations

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app on physical device (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crossword-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add app assets**
   - Add required image assets to the `assets/` directory
   - See `assets/README_ASSETS.txt` for specifications
   - For testing, placeholder images work fine

4. **Configure Google Ads (Production)**
   - Create an AdMob account at https://admob.google.com
   - Create ad units for banner, interstitial, and rewarded ads
   - Update `src/services/adsManager.ts` with your ad unit IDs:
     ```typescript
     export const AD_UNIT_IDS = {
       banner: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy',
       interstitial: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy',
       rewarded: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy',
     };
     ```
   - Update `app.json` with your AdMob App IDs

### Running the App

#### Start Expo Development Server
```bash
npm start
```

#### Run on iOS Simulator (Mac only)
```bash
npm run ios
```

#### Run on Android Emulator
```bash
npm run android
```

#### Run on Physical Device
1. Install Expo Go from App Store or Play Store
2. Scan the QR code shown in terminal
3. App will load on your device

## 📱 App Structure

```
crossword-app/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── BannerAdComponent.tsx
│   │   ├── CluePanel.tsx
│   │   ├── CrosswordGrid.tsx
│   │   ├── CustomKeyboard.tsx
│   │   ├── StatCard.tsx
│   │   └── TimerDisplay.tsx
│   ├── constants/          # App-wide constants
│   │   └── theme.ts        # Colors, fonts, spacing
│   ├── data/              # Static data
│   │   └── wordDatabase.ts # Word and clue database
│   ├── navigation/        # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/           # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── GameScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── StatsScreen.tsx
│   │   └── TutorialScreen.tsx
│   ├── services/          # Business logic
│   │   ├── adsManager.ts
│   │   ├── crosswordGenerator.ts
│   │   └── storage.ts
│   ├── store/            # State management
│   │   └── index.ts      # Zustand store
│   └── types/            # TypeScript types
│       └── index.ts
├── assets/               # Images and fonts
├── App.tsx              # App entry point
├── app.json             # Expo configuration
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
```

## 🎮 How to Play

1. **Start a New Game** - Select difficulty level from home screen
2. **Select a Cell** - Tap any white cell to begin entering letters
3. **Read Clues** - Switch between Across and Down clues
4. **Enter Letters** - Use the custom keyboard to type answers
5. **Get Hints** - Watch a rewarded ad to reveal a letter
6. **Check Progress** - Verify your answers anytime
7. **Complete** - Finish the puzzle to see your stats!

## 🛠️ Customization

### Adding More Words

Edit `src/data/wordDatabase.ts` to add more words and clues:

```typescript
{
  word: 'EXAMPLE',
  clue: 'Your clue here',
  difficulty: ['easy', 'medium']
}
```

### Adjusting Grid Sizes

Modify `src/services/crosswordGenerator.ts`:

```typescript
const GRID_SIZES = {
  easy: 9,    // Change grid dimensions
  medium: 11,
  hard: 13,
  expert: 15,
};
```

### Customizing Theme

Edit `src/constants/theme.ts` to change colors, fonts, and spacing.

## 📊 State Management

The app uses Zustand for state management with three main state categories:

- **Game State** - Current game progress, selected cells, timer
- **Settings** - User preferences, theme, difficulty
- **Statistics** - Game history, completion rates, best times

All data is persisted locally using AsyncStorage.

## 🎨 Design System

- **Colors** - Blue primary (#00A3E0), supports light/dark themes
- **Typography** - System fonts with semantic sizing
- **Spacing** - Consistent spacing scale (4, 8, 16, 24, 32, 48)
- **Components** - Reusable, themed components with shadows
- **Icons** - Emoji-based icons for cross-platform consistency

## 💰 Monetization

Three types of ads are integrated:

1. **Banner Ads** - Bottom of Home and Game screens
2. **Interstitial Ads** - After completing a game or exiting
3. **Rewarded Ads** - Watch to unlock hints

During development, test ad units are used automatically.

## 📦 Building for Production

### iOS

```bash
expo build:ios
```

### Android

```bash
expo build:android
```

### Web

```bash
npm run web
```

## 🧪 Testing

The app is designed to work offline completely. To test:

1. Enable airplane mode on your device
2. Launch the app - all features should work
3. Play games, change settings, view stats
4. All data persists across app restarts

## 📝 Notes

- **Offline First** - No internet required for gameplay
- **Data Persistence** - All progress auto-saved locally
- **Cross-Platform** - Works on iOS, Android, and web
- **TypeScript** - Fully typed for better development experience
- **Optimized** - Efficient crossword generation algorithm
- **Accessible** - Large touch targets, high contrast, clear typography

## 🤝 Contributing

To add features or improve the app:

1. Add new words to the word database
2. Improve crossword generation algorithm
3. Add new themes or customization options
4. Enhance statistics and achievements
5. Add social features (local leaderboards)

## 📄 License

This project is licensed under the MIT License.

## 🎯 Future Enhancements

- Daily crossword challenges
- Multiple crossword packs
- Custom crossword creator
- Share progress with friends
- Advanced statistics and achievements
- Timed challenges and competitions
- Multiple language support
- Cloud backup (optional)

---

**Made with ❤️ for puzzle enthusiasts**
