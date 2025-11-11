import mobileAds, {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  RewardedAd,
  TestIds,
  AdEventType,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

// Use test ad unit IDs for development
// Replace with your actual ad unit IDs for production
export const AD_UNIT_IDS = {
  banner: __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy',
  interstitial: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy',
  rewarded: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy',
};

let interstitialAd: InterstitialAd | null = null;
let rewardedAd: RewardedAd | null = null;

// Initialize Mobile Ads SDK
export const initializeAds = async (): Promise<void> => {
  try {
    await mobileAds().initialize();
    console.log('Mobile Ads SDK initialized');

    // Preload interstitial ad
    loadInterstitialAd();

    // Preload rewarded ad
    loadRewardedAd();
  } catch (error) {
    console.error('Error initializing ads:', error);
  }
};

// Interstitial Ad
export const loadInterstitialAd = (): void => {
  interstitialAd = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial);

  interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
    console.log('Interstitial ad loaded');
  });

  interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
    console.log('Interstitial ad closed');
    // Reload for next time
    loadInterstitialAd();
  });

  interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
    console.error('Interstitial ad error:', error);
  });

  interstitialAd.load();
};

export const showInterstitialAd = async (): Promise<void> => {
  try {
    if (interstitialAd && interstitialAd.loaded) {
      await interstitialAd.show();
    } else {
      console.log('Interstitial ad not loaded yet');
      loadInterstitialAd();
    }
  } catch (error) {
    console.error('Error showing interstitial ad:', error);
  }
};

// Rewarded Ad
export const loadRewardedAd = (): void => {
  rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_IDS.rewarded);

  rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
    console.log('Rewarded ad loaded');
  });

  rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
    console.log('User earned reward:', reward);
  });

  rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
    console.log('Rewarded ad closed');
    // Reload for next time
    loadRewardedAd();
  });

  rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
    console.error('Rewarded ad error:', error);
  });

  rewardedAd.load();
};

export const showRewardedAd = async (onRewarded: () => void): Promise<void> => {
  try {
    if (rewardedAd && rewardedAd.loaded) {
      // Set up reward listener
      const unsubscribe = rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          onRewarded();
          unsubscribe();
        }
      );

      await rewardedAd.show();
    } else {
      console.log('Rewarded ad not loaded yet');
      loadRewardedAd();
      // Return false or throw error if you want to handle this differently
    }
  } catch (error) {
    console.error('Error showing rewarded ad:', error);
  }
};

export const isRewardedAdReady = (): boolean => {
  return rewardedAd !== null && rewardedAd.loaded;
};

export const isInterstitialAdReady = (): boolean => {
  return interstitialAd !== null && interstitialAd.loaded;
};
