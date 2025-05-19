import { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { useOnboarding } from '@/context/OnboardingContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TourStep } from './ui/TourStep';

const { width, height } = Dimensions.get('window');

export const OnboardingTour = () => {
  const { currentStep, setCurrentStep, totalSteps, completeOnboarding, skipOnboarding } = useOnboarding();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withTiming(1.15, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease)
      }),
      -1,
      true
    );
  }, []);

  const tourSteps = useMemo(() => {
    return [
      {
        id: 'welcome',
        title: 'Welcome to FloodCast',
        description: 'Let\'s take a quick tour to help you get started with monitoring flood risks in your area.',
        icon: 'hand.wave.fill',
        position: 'center',
        targetPosition: undefined,
      },
      {
        id: 'map',
        title: 'Interactive Map',
        description: 'This map shows flood risk areas. Red markers indicate high risk, orange medium, and yellow low risk.',
        icon: 'map.fill',
        position: 'top',
        targetPosition: { x: width * 0.1, y: height * 0.2, width: width * 0.8, height: height * 0.5 },
      },
      {
        id: 'markers',
        title: 'Risk Markers',
        description: 'Tap on any marker to see detailed information about the flood risk in that area.',
        icon: 'mappin.circle.fill',
        position: 'top',
        targetPosition: { x: width * 0.1, y: height * 0.2, width: width * 0.8, height: height * 0.5 },
      },
      {
        id: 'location',
        title: 'Your Location',
        description: 'Tap this button to center the map on your current location and see nearby risks.',
        icon: 'location.fill',
        position: 'left',
        targetPosition: { x: width - 60, y: height - 180, width: 48, height: 48 },
      },
      {
        id: 'settings',
        title: 'Settings',
        description: 'Access app settings, notification preferences, and your account from the settings tab.',
        icon: 'gear',
        position: 'top',
        targetPosition: { x: width * 0.75 - 30, y: height - 60, width: 60, height: 40 },
      }
    ];
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const currentTourStep = tourSteps[currentStep];
  if (!currentTourStep) return null;

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      {Platform.OS === 'ios' ? (
        <BlurView intensity={5} tint={isDark ? 'dark' : 'light'} style={styles.overlay} />
      ) : (
        <View style={[
          styles.overlay,
          { backgroundColor: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)' }
        ]} />
      )}

      <TouchableOpacity
        style={styles.skipButton}
        onPress={skipOnboarding}
        activeOpacity={0.7}
      >
        <Text style={[styles.skipText, isDark ? styles.textDark : styles.textLight]}>Skip Tour</Text>
      </TouchableOpacity>

      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === currentStep ?
                (isDark ? styles.activeDotDark : styles.activeDotLight) :
                (isDark ? styles.inactiveDotDark : styles.inactiveDotLight)
            ]}
          />
        ))}
      </View>

      <TourStep
        title={currentTourStep.title}
        description={currentTourStep.description}
        targetMeasurements={currentTourStep.targetPosition}
        position={(currentTourStep.position === 'center' ? 'bottom' : currentTourStep.position) as 'top' | 'bottom' | 'left' | 'right'}
        icon={currentTourStep.icon}
        onPress={handleNext}
        showArrow={currentTourStep.targetPosition !== undefined}
      />

      {currentTourStep.targetPosition && (
        <Animated.View
          style={[
            styles.targetHighlight,
            {
              top: currentTourStep.targetPosition.y - 12,
              left: currentTourStep.targetPosition.x - 12,
              width: currentTourStep.targetPosition.width + 24,
              height: currentTourStep.targetPosition.height + 24,
              borderColor: '#795de2',
              borderWidth: 3,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            },
            pulseStyle,
          ]}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        />
      )}
    </Animated.View>
  );
};

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  position: string;
  targetPosition?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    zIndex: 1001,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  textLight: { color: '#000000' },
  textDark: { color: '#ffffff' },
  progressContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDotLight: { backgroundColor: '#795de2' },
  activeDotDark: { backgroundColor: '#795de2' },
  inactiveDotLight: { backgroundColor: 'rgba(0, 0, 0, 0.3)' },
  inactiveDotDark: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  targetHighlight: {
    position: 'absolute',
    borderRadius: 16,
    backgroundColor: 'transparent',
    zIndex: 999,
    opacity: 0.9,
  },
});
