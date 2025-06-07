import { useState, useEffect, useCallback } from 'react';
import { floodRiskAreas as mockData } from '@/data/floodRiskData';
import { getFloodRisks, getFloodRiskById} from '@/services/floodRiskService';
import { showAlert } from '@/utils/alert';
import { FloodRiskArea } from '@/types';
import { DATA_CONFIG } from '@/constants/DataConfig';

export function useFloodData() {
  const [data, setData] = useState<FloodRiskArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (DATA_CONFIG.USE_MOCK_DATA) {
      setData(mockData);
      setLoading(false);
      return;
    }

    try {
      const floodRisks = await getFloodRisks();
      setData(floodRisks);
    } catch (err) {
      const errorMessage = "Failed to fetch flood risk data";
      setError(errorMessage);

      if (DATA_CONFIG.FALLBACK_TO_MOCK_ON_ERROR) {
        showAlert("Couldn't load flood data", "Using offline data instead", "warning");
        setData(mockData);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFloodRiskById = useCallback(async (id: number) => {
    if (DATA_CONFIG.USE_MOCK_DATA) {
      return mockData.find(risk => risk.id === id) || null;
    }

    try {
      return await getFloodRiskById(id);
    } catch (err) {
      if (DATA_CONFIG.FALLBACK_TO_MOCK_ON_ERROR) {
        showAlert("Error", `Failed to fetch flood risk with ID ${id}.`, "error");
        return mockData.find(risk => risk.id === id) || null;
      }
      return null;
    }
  }, []);

  

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    fetchFloodRisks: fetchData,
    fetchFloodRiskById,
  };
}