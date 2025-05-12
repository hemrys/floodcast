import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloodRiskModal } from '@/components/FloodRiskModal';
import { FloodRiskArea } from '@/data/floodRiskData';
import { useFloodData } from '@/hooks/useFloodData';
import { LeafletMap } from '@/components/LeafletMap';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<FloodRiskArea | null>(null);
  // get flood data from our hook
  const { data: floodRiskAreas } = useFloodData();

  // Handle marker press
  const handleMarkerPress = (area: FloodRiskArea) => {
    setSelectedArea(area);
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 relative">
      <LeafletMap
        floodRiskAreas={floodRiskAreas}
        onMarkerPress={handleMarkerPress}
      />

      <FloodRiskModal
        visible={modalVisible}
        selectedArea={selectedArea}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}







