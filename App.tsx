import React, { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useStore } from './src/store';
import { initializeAds } from './src/services/adsManager';
import { COLORS } from './src/constants/theme';

export default function App() {
  const { settings, loadSettingsFromStorage, loadStatisticsFromStorage, loadGameFromStorage } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Load saved data
      await Promise.all([
        loadSettingsFromStorage(),
        loadStatisticsFromStorage(),
        loadGameFromStorage(),
      ]);

      // Initialize ads
      await initializeAds();

      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing app:', error);
      setIsLoading(false);
    }
  };

  const colors = COLORS[settings.theme];

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={settings.theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
