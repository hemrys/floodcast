import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';
const ONBOARDING_CURRENT_STEP_KEY = 'onboarding_current_step';

type OnboardingContextType = {
  isFirstTime: boolean;
  setIsFirstTime: (value: boolean) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
  completeOnboarding: () => Promise<void>;
  skipOnboarding: () => Promise<void>;
  isLoading: boolean;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children, totalSteps = 5 }: { children: React.ReactNode, totalSteps?: number }) => {
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        setIsLoading(true);
        const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
        const savedStep = await AsyncStorage.getItem(ONBOARDING_CURRENT_STEP_KEY);

        if (completed === 'true') {
          setIsFirstTime(false);
        } else {
          setIsFirstTime(true);
          if (savedStep) {
            setCurrentStep(parseInt(savedStep, 10));
          }
        }
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
        setIsFirstTime(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const saveCurrentStep = async (step: number) => {
    try {
      await AsyncStorage.setItem(ONBOARDING_CURRENT_STEP_KEY, step.toString());
    } catch (error) {
      console.error('Failed to save current onboarding step:', error);
    }
  };

  const handleSetCurrentStep = (step: number) => {
    setCurrentStep(step);
    saveCurrentStep(step);
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      // Reset the step to 0 for next time
      await AsyncStorage.setItem(ONBOARDING_CURRENT_STEP_KEY, '0');
      setIsFirstTime(false);
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const skipOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      // Also save the current step as 0 for next time
      await AsyncStorage.setItem(ONBOARDING_CURRENT_STEP_KEY, '0');
      setIsFirstTime(false);
    } catch (error) {
      console.error('Failed to skip onboarding:', error);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        isFirstTime,
        setIsFirstTime,
        currentStep,
        setCurrentStep: handleSetCurrentStep,
        totalSteps,
        completeOnboarding,
        skipOnboarding,
        isLoading,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
