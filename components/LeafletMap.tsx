import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { LeafletView, MapLayer, MapMarker } from 'react-native-leaflet-view';
import * as Location from 'expo-location';
import { IconSymbol } from './ui/IconSymbol';
import { FloodRiskArea } from '@/data/floodRiskData';
import { useColorScheme } from '@/hooks/useColorScheme';

interface LocationObject {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

interface LeafletMapProps {
  floodRiskAreas: FloodRiskArea[];
  onMarkerPress: (area: FloodRiskArea) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({ floodRiskAreas, onMarkerPress }) => {
  const colorScheme = useColorScheme();
  const [webViewContent, setWebViewContent] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null);

  // Malmö, Sweden coordinates
  const [mapCenter, setMapCenter] = useState({
    lat: 55.6050,
    lng: 13.0038,
  });
  const [zoom, setZoom] = useState(12);

  // Load the HTML content for the Leaflet map
  useEffect(() => {
    let isMounted = true;

    const loadHtml = async () => {
      try {
        const path = require('../assets/leaflet.html');
        const asset = Asset.fromModule(path);
        await asset.downloadAsync();
        const htmlContent = await FileSystem.readAsStringAsync(asset.localUri!);

        if (isMounted) {
          setWebViewContent(htmlContent);
        }
      } catch (error) {
        Alert.alert('Error loading HTML', JSON.stringify(error));
        console.error('Error loading HTML:', error);
      }
    };

    loadHtml();

    return () => {
      isMounted = false;
    };
  }, []);

  // Function to get risk color based on risk level
  const getRiskColor = (riskLevel: 'high' | 'medium' | 'low' | string): string => {
    switch(riskLevel) {
      case 'high': return '#ff0000'; // Red with opacity
      case 'medium': return '#ffa500'; // Orange with opacity
      case 'low': return '#ffcc00'; // Yellow with opacity
      default: return '#ffcc00'; 
    }
  };

  // Function to get risk color with opacity for fill
  const getRiskFillColor = (riskLevel: 'high' | 'medium' | 'low' | string): string => {
    switch(riskLevel) {
      case 'high': return 'rgba(255, 0, 0, 0.2)'; // Red with opacity
      case 'medium': return 'rgba(255, 165, 0, 0.2)'; // Orange with opacity
      case 'low': return 'rgba(255, 204, 0, 0.2)'; // Yellow with opacity
      default: return 'rgba(0, 0, 255, 0.2)'; // Blue with opacity
    }
  };

  // Create map markers for flood risk areas
  const mapMarkers: MapMarker[] = floodRiskAreas.map((area) => {
    // Choose icon color based on risk level
    let icon = '📍';
    if (area.riskLevel === 'high') {
      icon = '🔴';
    } else if (area.riskLevel === 'medium') {
      icon = '🟠';
    } else if (area.riskLevel === 'low') {
      icon = '🟡';
    }

    return {
      id: `marker-${area.id}`,
      position: { lat: area.coordinate.latitude, lng: area.coordinate.longitude },
      icon: icon,
      size: [32, 32],
    };
  });

  // Create map shapes (circles) for flood risk areas
  const mapShapes: any[] = floodRiskAreas.map((area) => ({
    id: `circle-${area.id}`,
    shapeType: 'circle',
    color: getRiskColor(area.riskLevel),
    fillColor: getRiskFillColor(area.riskLevel),
    position: { lat: area.coordinate.latitude, lng: area.coordinate.longitude },
    radius: area.radius,
    fillOpacity: 0.2
  }));

  // Add user location marker if available
  if (userLocation) {
    mapMarkers.push({
      id: 'user-location',
      position: {
        lat: userLocation.coords.latitude,
        lng: userLocation.coords.longitude
      },
      icon: '📱', // User location icon
      size: [32, 32]
    });
  }

  // Function to center map on user's location
  const centerOnUser = async () => {
    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        return;
      }

      // Get location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      // Update state and center map with more zoom
      setUserLocation(currentLocation);
      const newCenter = {
        lat: currentLocation.coords.latitude,
        lng: currentLocation.coords.longitude
      };
      setMapCenter(newCenter);
      setZoom(15); // More zoomed in
    } catch (error: any) {
      Alert.alert('Error', 'Could not get your location. Please try again.');
      console.error(error);
    }
  };

  // Handle map events
  const handleMessage = (event: any) => {
    console.log('Message received:', event);

    try {
      if (event && event.nativeEvent && event.nativeEvent.data) {
        const data = JSON.parse(event.nativeEvent.data);

        // Handle marker click events
        if (data.event === 'onMapMarkerClicked') {
          const markerId = data.payload && data.payload.mapMarkerID;
          if (markerId && markerId.startsWith('marker-')) {
            const areaId = parseInt(markerId.replace('marker-', ''));
            const area = floodRiskAreas.find(a => a.id === areaId);

            if (area) {
              onMarkerPress(area);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  };

  // Map layers (use OpenStreetMap)
  const mapLayers: MapLayer[] = [
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      baseLayerName: 'OpenStreetMap',
      baseLayerIsChecked: true,
      baseLayer: true,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    }
  ];

  // Add dark mode layer if needed
  if (colorScheme === 'dark') {
    // Using CartoDB Dark Matter - free and doesn't require an API key
    mapLayers.push({
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>',
      baseLayerName: 'Dark Mode',
      baseLayerIsChecked: true,
      baseLayer: true,
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    });

    
  }

  if (!webViewContent) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LeafletView
        source={{ html: webViewContent }}
        mapLayers={mapLayers}
        mapMarkers={mapMarkers}
        mapShapes={mapShapes}
        mapCenterPosition={mapCenter}
        zoom={zoom}
        onMessageReceived={handleMessage}
        doDebug={false}
      />

      {/* Center to user location button */}
      <TouchableOpacity
        className={`absolute bottom-24 right-4 w-12 h-12 rounded-full justify-center items-center shadow-md ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        onPress={centerOnUser}
        activeOpacity={0.7}
        style={styles.locationButton}
      >
        <IconSymbol
          name="location.fill"
          size={24}
          color={colorScheme === 'dark' ? '#ffffff' : '#000000'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButton: {
    position: 'absolute',
    bottom: 96,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
