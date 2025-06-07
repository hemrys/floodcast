import Constants from 'expo-constants';

const getUseMockData = (): boolean => {
  if (Constants.expoConfig?.extra?.useMockData !== undefined) {
    return Constants.expoConfig.extra.useMockData;
  }
  return true;
};

export const DATA_CONFIG = {
  USE_MOCK_DATA: getUseMockData(),

  FALLBACK_TO_MOCK_ON_ERROR: true,
} as const;

export type DataSource = 'mock' | 'api';

export const toggleDataSource = (): DataSource => {
  (DATA_CONFIG as any).USE_MOCK_DATA = !DATA_CONFIG.USE_MOCK_DATA;
  return DATA_CONFIG.USE_MOCK_DATA ? 'mock' : 'api';
};

export const setDataSource = (source: DataSource): void => {
  (DATA_CONFIG as any).USE_MOCK_DATA = source === 'mock';
};

export const getCurrentDataSource = (): DataSource => {
  return DATA_CONFIG.USE_MOCK_DATA ? 'mock' : 'api';
};
