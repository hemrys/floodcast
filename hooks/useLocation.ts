import { useState, useRef, useEffect } from 'react';
import * as Location from 'expo-location';
import { showAlert } from '@/utils/alert';
import { LocationObject, Region } from '@/types';

export function useLocation() {
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null);
  const lastLocationRequest = useRef<number>(0);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  // Start watching location when component mounts
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      // Get initial location
      try {
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });
        setUserLocation(initialLocation);
        lastLocationRequest.current = Date.now();
      } catch (err) {
        console.error('Error getting initial location:', err);
      }

      // Start watching location
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5, // Update if device moves by 5 meters
          timeInterval: 3000 // Or every 3 seconds
        },
        (location) => {
          setUserLocation(location);
          lastLocationRequest.current = Date.now();
        }
      );

      locationSubscription.current = subscription;

      // Clean up subscription on unmount
      return () => {
        if (subscription) {
          subscription.remove();
        }
      };
    })();
  }, []);

  const centerOnUser = async (
    setRegionCallback: (region: Region) => void
  ): Promise<boolean> => {
    try {
      // Check if we have a recent location (within the last 10 seconds)
      const now = Date.now();
      const useCache = userLocation && (now - lastLocationRequest.current < 10000);

      if (useCache) {
        console.log('Using cached location');
        setRegionCallback({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.005, // Zoom in more
          longitudeDelta: 0.005,
        });
        return true;
      }

      // Otherwise get a new location
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        showAlert('Permission Denied', 'Location permission is required to use this feature.', 'warning');
        return false;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      // Update the timestamp
      lastLocationRequest.current = now;

      setUserLocation(currentLocation);
      setRegionCallback({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005, // Zoom in more
        longitudeDelta: 0.005,
      });

      return true;
    } catch (error) {
      showAlert('Error', 'Could not get your location. Please try again.', 'error');
      console.error(error);
      return false;
    }
  };

  return { userLocation, centerOnUser };
}
