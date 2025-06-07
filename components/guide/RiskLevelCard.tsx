import { Text, View } from 'react-native';
import { getRiskStyle } from '@/utils/styleUtils';

interface RiskLevelCardProps {
  riskLevel: 'high' | 'medium' | 'low';
  title: string;
  borderColor: string;
  beforeContent: string;
  duringContent: string;
  afterContent: string;
}

export const RiskLevelCard = ({
  riskLevel,
  title,
  borderColor,
  beforeContent,
  duringContent,
  afterContent,
}: RiskLevelCardProps) => {
  return (
    <View
      className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-l-4 ${borderColor}`}
      accessibilityLabel={`${riskLevel} flood risk safety information`}
    >
      <View className="flex-row items-center mb-3">
        <View
          className={`w-4 h-4 rounded-full ${getRiskStyle(riskLevel, 'bg')} mr-2`}
          accessibilityLabel={`${riskLevel} risk indicator`}
        />
        <Text
          className="text-xl font-semibold text-gray-900 dark:text-white"
          accessibilityRole="header"
        >
          {title}
        </Text>
      </View>
      
      <Text
        className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2"
        accessibilityRole="header"
      >
        Before Flooding:
      </Text>
      <Text
        className="text-base text-gray-700 dark:text-gray-300 mb-3"
        accessibilityRole="text"
      >
        {beforeContent}
      </Text>

      <Text className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
        During Flooding:
      </Text>
      <Text className="text-base text-gray-700 dark:text-gray-300 mb-3">
        {duringContent}
      </Text>

      <Text className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
        After Flooding:
      </Text>
      <Text className="text-base text-gray-700 dark:text-gray-300">
        {afterContent}
      </Text>
    </View>
  );
};
