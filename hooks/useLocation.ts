import { useState, useRef } from 'react';
import * as Location from 'expo-location';
import { showAlert } from '@/utils/alert';
import { LocationObject, Region } from '@/types';

export function useLocation() {
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const lastLocationRequest = useRef<number>(0);
  const locationCache = useRef<LocationObject | null>(null);

  const centerOnUser = async (setRegion: (region: Region) => void): Promise<boolean> => {
    if (isLocating) return false;

    try {
      setIsLocating(true);
      const now = Date.now();
      const useCache = userLocation && (now - lastLocationRequest.current < 5000);

      if (useCache && locationCache.current) {
        setRegion({
          latitude: locationCache.current.coords.latitude,
          longitude: locationCache.current.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
        setIsLocating(false);
        return true;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        showAlert('Permission Denied', 'Location permission is required to use this feature.', 'warning');
        setIsLocating(false);
        return false;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        mayShowUserSettingsDialog: false,
        timeInterval: 1000
      });

      lastLocationRequest.current = now;
      locationCache.current = currentLocation;
      setUserLocation(currentLocation);

      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      setIsLocating(false);
      return true;
    } catch (error) {
      showAlert('Error', 'Could not get your location. Please try again.', 'error');
      setIsLocating(false);
      return false;
    }
  };

  return { userLocation, isLocating, centerOnUser };
}
