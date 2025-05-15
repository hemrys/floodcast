import { useState, useEffect, useCallback } from 'react';
import { floodRiskAreas as mockData } from '@/data/floodRiskData';
import { floodRiskService } from '@/services/floodRiskService';
import { showAlert } from '@/utils/alert';
import { FloodRiskArea, LocationQuery } from '@/types';

export function useFloodData() {
  const [data, setData] = useState<FloodRiskArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFloodData = useCallback(async (
    fetchFn: () => Promise<FloodRiskArea[]>,
    errorMsg: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const floodRisks = await fetchFn();
      setData(floodRisks);
    } catch (err) {
      console.error(errorMsg, err);
      showAlert("Couldn't load flood data", "Please check your connection and try again", "warning");

      console.log("Using mock data as fallback");
      setData(mockData);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFloodRisks = useCallback(() => {
    return fetchFloodData(
      () => floodRiskService.getFloodRisks(),
      "Failed to fetch flood risk data"
    );
  }, [fetchFloodData]);

  const fetchFloodRisksByLocation = useCallback((location: LocationQuery) => {
    return fetchFloodData(
      () => floodRiskService.getFloodRisksByLocation(location),
      "Failed to fetch flood risk data by location"
    );
  }, [fetchFloodData]);

  const fetchFloodRiskById = useCallback(async (id: number) => {
    try {
      return await floodRiskService.getFloodRiskById(id);
    } catch (err) {
      console.error(`Failed to fetch flood risk with ID ${id}:`, err);
      showAlert("Error", `Failed to fetch flood risk with ID ${id}.`, "error");
      return null;
    }
  }, []);

  const updateUserLocation = useCallback(async (location: { latitude: number; longitude: number }) => {
    try {
      await floodRiskService.updateUserLocation(location);
      return true;
    } catch (err) {
      console.error("Failed to update user location:", err);
      return false;
    }
  }, []);

  // Fetch all flood risk areas on mount
  useEffect(() => {
    try {
      console.log("Attempting to fetch flood risk data...");
      fetchFloodRisks();
    } catch (err) {
      console.error("Error in fetchFloodRisks effect:", err);
      // Always ensure we have data by setting mock data as fallback
      setData(mockData);
      setLoading(false);
    }
  }, [fetchFloodRisks]);

  // Ensure we always have data by using mock data if no data is loaded after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading || data.length === 0) {
        console.log("No data loaded after timeout, using mock data");
        setData(mockData);
        setLoading(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading, data.length]);

  return {
    data,
    loading,
    error,
    fetchFloodRisks,
    fetchFloodRisksByLocation,
    fetchFloodRiskById,
    updateUserLocation
  };
}