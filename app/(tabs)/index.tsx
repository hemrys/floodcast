import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Mapbox from '@rnmapbox/maps';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FloodRiskModal } from '@/components/FloodRiskModal';
import { useFloodData } from '@/hooks/useFloodData';
import { useLocation } from '@/hooks/useLocation';
import { FloodRiskArea, Region } from '@/types';
import { getRiskStyle } from '@/utils/styleUtils';

// Initialize Mapbox with access token from .env
Mapbox.setAccessToken(process.env.MAPBOX_ACCESS_TOKEN || '');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<FloodRiskArea | null>(null);
  const { data: floodRiskAreas } = useFloodData();
  const { userLocation, centerOnUser } = useLocation();
  const mapRef = useRef<Mapbox.MapView>(null);

  // Malmö, Sweden coordinates
  const [region, setRegion] = useState<Region>({
    latitude: 55.6050,
    longitude: 13.0038,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Handle region change
  const handleRegionChange = (feature: any) => {
    if (feature && feature.geometry && feature.geometry.coordinates) {
      const [longitude, latitude] = feature.geometry.coordinates;
      setRegion({
        ...region,
        latitude,
        longitude,
      });
    }
  };

  // Update camera when region changes
  useEffect(() => {
    if (mapRef.current && region) {
      // Using Camera component instead of setCamera
      // The Camera component will handle the animation
    }
  }, [region]);

  // Center map on user location
  const handleCenterOnUser = async () => {
    const success = await centerOnUser((newRegion: Region) => {
      setRegion(newRegion);
    });

    if (!success && userLocation) {
      // Fallback if centerOnUser fails but we have a location
      const fallbackRegion: Region = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setRegion(fallbackRegion);
    }
  };

  // Create GeoJSON features for flood risk areas
  const createFloodRiskFeatures = () => {
    return {
      type: 'FeatureCollection' as const,
      features: floodRiskAreas.map(area => ({
        type: 'Feature' as const,
        id: area.id.toString(),
        properties: {
          id: area.id,
          title: area.title,
          description: area.description,
          riskLevel: area.riskLevel,
          radius: area.radius,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [area.coordinate.longitude, area.coordinate.latitude],
        },
      })),
    };
  };

  // Handle marker press
  const handleMarkerPress = (feature: any) => {
    if (feature && feature.properties) {
      const areaId = feature.properties.id;
      const area = floodRiskAreas.find(a => a.id === areaId);
      if (area) {
        setSelectedArea(area);
        setModalVisible(true);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 relative">
      <Mapbox.MapView
        ref={mapRef}
        style={{ flex: 1 }}
        styleURL={colorScheme === 'dark' ?
          Mapbox.StyleURL.Dark :
          Mapbox.StyleURL.Street}
        onRegionDidChange={handleRegionChange}
        compassEnabled={true}
        logoEnabled={false}
        attributionEnabled={false}
        className="flex-1"
      >
        <Mapbox.Camera
          zoomLevel={region.latitudeDelta < 0.01 ? 14 : 12}
          centerCoordinate={[region.longitude, region.latitude]}
          animationMode="flyTo"
          animationDuration={500}
          key={`${region.latitude}-${region.longitude}-${region.latitudeDelta}`}
        />

        {/* Flood risk circles */}
        {floodRiskAreas.map((area) => (
          <Mapbox.ShapeSource
            key={`circle-source-${area.id}`}
            id={`circle-source-${area.id}`}
            shape={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [area.coordinate.longitude, area.coordinate.latitude],
              },
            }}
          >
            <Mapbox.CircleLayer
              id={`circle-layer-${area.id}`}
              style={{
                circleRadius: area.radius / 20, // Scale down for better visibility
                circleColor: getRiskStyle(area.riskLevel, 'mapFill'),
                circleStrokeColor: getRiskStyle(area.riskLevel, 'mapStroke'),
                circleStrokeWidth: 2,
                circleOpacity: 0.5,
              }}
            />
          </Mapbox.ShapeSource>
        ))}

        {/* Flood risk markers */}
        <Mapbox.ShapeSource
          id="marker-source"
          shape={createFloodRiskFeatures()}
          onPress={handleMarkerPress}
        >
          <Mapbox.SymbolLayer
            id="marker-layer"
            style={{
              iconImage: 'marker',
              iconSize: 0.5,
              iconAllowOverlap: true,
              iconColor: [
                'match',
                ['get', 'riskLevel'],
                'high', '#FF0000',
                'medium', '#FFA500',
                'low', '#FFCC00',
                '#0000FF'
              ],
            }}
          />
        </Mapbox.ShapeSource>

        {/* User location */}
        {userLocation && (
          <Mapbox.PointAnnotation
            id="user-location"
            coordinate={[userLocation.coords.longitude, userLocation.coords.latitude]}
            title="Your Location"
          >
            <View className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white items-center justify-center">
              <View className="w-2 h-2 rounded-full bg-white" />
            </View>
          </Mapbox.PointAnnotation>
        )}

        {/* Add images for markers */}
        <Mapbox.Images
          images={{
            marker: require('@/assets/images/marker.png'),
          }}
        />
      </Mapbox.MapView>

      {/* Center to user location button */}
      <TouchableOpacity
        className={`absolute bottom-24 right-4 w-12 h-12 rounded-full justify-center items-center shadow-md ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        onPress={handleCenterOnUser}
        activeOpacity={0.7}
      >
        <IconSymbol
          name="location.fill"
          size={24}
          color={colorScheme === 'dark' ? '#ffffff' : '#000000'}
        />
      </TouchableOpacity>

      <FloodRiskModal
        visible={modalVisible}
        selectedArea={selectedArea}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}







