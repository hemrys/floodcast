import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RiskLevelCard } from '@/components/guide/RiskLevelCard';

export default function GuideScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView
        className="flex-1 px-4"
        accessibilityRole="scrollbar"
        accessibilityLabel="Flood safety guide content"
      >
        <View className="mb-6 mt-2">
          <Text
            className="text-4xl font-bold text-gray-900 dark:text-white"
            accessibilityRole="header"
          >
            Flood Safety Guide
          </Text>
          <Text
            className="text-lg text-gray-600 dark:text-gray-400 mt-2"
            accessibilityRole="text"
          >
            Essential safety information for different flood risk levels
          </Text>
        </View>

        <View className="mb-6">
          <SectionHeader title="High Risk Areas" />
          <RiskLevelCard
            riskLevel="high"
            title="Severe Flood Risk"
            borderColor="border-red-500"
            beforeContent="• Evacuate immediately when advised by authorities
• Move to higher ground before flooding begins
• Gather emergency supplies and important documents
• Turn off utilities if time permits
• Never drive around barricades"
            duringContent="• Stay away from floodwaters - Turn Around, Don't Drown!
• Get to highest level if trapped in building
• Signal for help from rooftop if necessary
• Listen to emergency broadcasts for updates
• Avoid walking in moving water over 6 inches"
            afterContent="• Wait for official all-clear before returning
• Avoid fallen power lines and debris
• Wear protective gear during cleanup
• Document damage with photos
• Check for structural damage before entering"
          />
        </View>

        <View className="mb-6">
          <SectionHeader title="Medium Risk Areas" />
          <RiskLevelCard
            riskLevel="medium"
            title="Moderate Flood Risk"
            borderColor="border-orange-500"
            beforeContent="• Monitor weather alerts and evacuation orders
• Prepare emergency kit with 3 days of supplies
• Move valuables to higher levels
• Clear drains and gutters
• Know your evacuation route"
            duringContent="• Avoid driving through flooded roads
• Stay indoors unless evacuation is ordered
• Keep away from storm drains and ditches
• Monitor local emergency communications
• Be prepared to move to higher ground quickly"
            afterContent="• Check for gas leaks and electrical hazards
• Pump out flooded basements gradually
• Discard contaminated food and water
• Clean and disinfect everything that got wet
• Contact insurance company to report damage"
          />
        </View>

        <View className="mb-6">
          <SectionHeader title="Low Risk Areas" />
          <RiskLevelCard
            riskLevel="low"
            title="Low Flood Risk"
            borderColor="border-yellow-500"
            beforeContent="• Stay informed about weather conditions
• Keep basic emergency supplies ready
• Know how to shut off utilities
• Review family emergency plan
• Consider flood insurance coverage"
            duringContent="• Avoid unnecessary travel
• Stay away from flooded areas
• Keep children and pets indoors
• Monitor local news for updates
• Be cautious of standing water"
            afterContent="• Inspect property for minor damage
• Clean up any standing water promptly
• Check basement and foundation
• Ensure proper ventilation
• Report any infrastructure damage"
          />
        </View>

        <View className="mb-6">
          <SectionHeader title="Emergency Contacts" />
          <View
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4"
            accessibilityLabel="Emergency contact information"
          >
            <Text
              className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2"
              accessibilityRole="header"
            >
              Important Numbers:
            </Text>
            <Text
              className="text-base text-gray-700 dark:text-gray-300 mb-3"
              accessibilityRole="text"
              accessibilityHint="Emergency contact numbers for Sweden"
            >
              • Emergency Services: 112{'\n'}
              • Swedish Emergency Services: 112{'\n'}
              • Non-Emergency Police: 114 14{'\n'}
              • Poison Information: 010-456 67 00{'\n'}
              • Healthcare Information: 1177
            </Text>

            <Text className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              Preparation Tips:
            </Text>
            <Text className="text-base text-gray-700 dark:text-gray-300">
              • Create a family emergency plan{'\n'}
              • Prepare an emergency kit{'\n'}
              • Know your evacuation routes{'\n'}
              • Keep important documents waterproof{'\n'}
              • Stay informed through official channels
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
