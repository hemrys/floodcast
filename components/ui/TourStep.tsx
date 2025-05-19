import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from './IconSymbol';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface TourStepProps {
  title: string;
  description: string;
  targetMeasurements?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  position?: 'top' | 'bottom' | 'left' | 'right';
  icon?: string;
  onPress?: () => void;
  showArrow?: boolean;
}

export const TourStep = ({
  title,
  description,
  targetMeasurements,
  position = 'bottom',
  icon,
  onPress,
  showArrow = true,
}: TourStepProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getPosition = () => {
    if (!targetMeasurements) {
      return {
        top: height / 2 - 100,
        left: width / 2 - 150,
        maxWidth: 300,
      };
    }

    const { x, y, width: targetWidth, height: targetHeight } = targetMeasurements;
    const tooltipWidth = Math.min(width * 0.8, 300);
    const tooltipHeight = 140;
    const margin = 16;
    const targetCenterX = x + targetWidth / 2;
    const targetCenterY = y + targetHeight / 2;

    const safePosition = (top: number, left: number) => ({
      top: Math.max(50, Math.min(top, height - tooltipHeight - 50)),
      left: Math.max(20, Math.min(left, width - tooltipWidth - 20)),
      maxWidth: tooltipWidth,
    });

    switch (position) {
      case 'top':
        return safePosition(y - tooltipHeight - margin, targetCenterX - tooltipWidth / 2);
      case 'bottom':
        return safePosition(y + targetHeight + margin, targetCenterX - tooltipWidth / 2);
      case 'left':
        return safePosition(targetCenterY - tooltipHeight / 2, x - tooltipWidth - margin);
      case 'right':
        return safePosition(targetCenterY - tooltipHeight / 2, x + targetWidth + margin);
      default:
        return safePosition(y + targetHeight + margin, targetCenterX - tooltipWidth / 2);
    }
  };

  const getArrowStyle = () => {
    if (!showArrow || !targetMeasurements) return {};

    const arrowSize = 10;

    switch (position) {
      case 'top':
        return {
          bottom: -arrowSize,
          left: '50%' as any,
          transform: [{ translateX: -arrowSize/2 }, { rotate: '45deg' }],
          width: arrowSize,
          height: arrowSize,
        };
      case 'bottom':
        return {
          top: -arrowSize,
          left: '50%' as any,
          transform: [{ translateX: -arrowSize/2 }, { rotate: '45deg' }],
          width: arrowSize,
          height: arrowSize,
        };
      case 'left':
        return {
          right: -arrowSize,
          top: '50%' as any,
          transform: [{ translateY: -arrowSize/2 }, { rotate: '45deg' }],
          width: arrowSize,
          height: arrowSize,
        };
      case 'right':
        return {
          left: -arrowSize,
          top: '50%' as any,
          transform: [{ translateY: -arrowSize/2 }, { rotate: '45deg' }],
          width: arrowSize,
          height: arrowSize,
        };
      default:
        return {
          top: -arrowSize,
          left: '50%' as any,
          transform: [{ translateX: -arrowSize/2 }, { rotate: '45deg' }],
          width: arrowSize,
          height: arrowSize,
        };
    }
  };

  const positionStyle = getPosition();
  const arrowStyle = getArrowStyle();

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={[
        styles.container,
        isDark ? styles.containerDark : styles.containerLight,
        positionStyle,
      ]}
    >
      {showArrow && targetMeasurements && (
        <View style={[styles.arrow, isDark ? styles.arrowDark : styles.arrowLight, arrowStyle]} />
      )}

      <View style={styles.content}>
        {icon && (
          <View style={styles.iconContainer}>
            <IconSymbol name={icon as any} size={24} color={isDark ? '#ffffff' : '#000000'} />
          </View>
        )}

        <View style={styles.textContainer}>
          <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>{title}</Text>
          <Text style={[styles.description, isDark ? styles.descriptionDark : styles.descriptionLight]}>
            {description}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, isDark ? styles.buttonDark : styles.buttonLight]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, isDark ? styles.buttonTextDark : styles.buttonTextLight]}>
          Got it
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '80%',
    maxWidth: 300,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  containerLight: { backgroundColor: '#ffffff' },
  containerDark: { backgroundColor: '#1f2937' },
  arrow: {
    position: 'absolute',
    width: 16,
    height: 16,
    zIndex: 1001,
  },
  arrowLight: { backgroundColor: '#ffffff' },
  arrowDark: { backgroundColor: '#1f2937' },
  content: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: { marginRight: 12 },
  textContainer: { flex: 1 },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  textLight: { color: '#000000' },
  textDark: { color: '#ffffff' },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  descriptionLight: { color: '#4b5563' },
  descriptionDark: { color: '#9ca3af' },
  button: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonLight: { backgroundColor: '#795de2' },
  buttonDark: { backgroundColor: '#795de2' },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextLight: { color: '#ffffff' },
  buttonTextDark: { color: '#ffffff' },
});
