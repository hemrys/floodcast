import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useOnboarding } from '@/context/OnboardingContext';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isLoading: isOnboardingLoading } = useOnboarding();

  // show spinner while checking login status or onboarding status
  if (isLoading || isOnboardingLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#795de2" />
      </View>
    );
  }

  // send user to the right place based on login status
  return isAuthenticated ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />;
}