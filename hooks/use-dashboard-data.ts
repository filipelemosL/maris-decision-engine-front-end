import { useState, useEffect, useCallback } from 'react';
import {
  getOperationalStatus,
  getRawWeather,
  getDecisionHistory,
  OperationalStatus,
  WeatherRaw,
  DecisionData,
  Location,
  getLocations,
} from '@/lib/api';
import {
  mockLocations,
  generateMockWeatherHistory,
  generateMockDecisionHistory,
  generateMockOperationalStatus,
} from '@/lib/mock-data';

interface UseDashboardDataReturn {
  operationalStatus: OperationalStatus | null;
  weatherHistory: WeatherRaw[];
  decisionHistory: DecisionData[];
  locations: Location[];
  currentLocation: Location | null;
  loading: boolean;
  error: string | null;
  setLocationId: (id: number) => void;
  refetch: () => Promise<void>;
  useMock: boolean;
}

export function useDashboardData(initialLocationId: number = 1): UseDashboardDataReturn {
  const [locationId, setLocationId] = useState(initialLocationId);
  const [operationalStatus, setOperationalStatus] = useState<OperationalStatus | null>(null);
  const [weatherHistory, setWeatherHistory] = useState<WeatherRaw[]>([]);
  const [decisionHistory, setDecisionHistory] = useState<DecisionData[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMock, setUseMock] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setUseMock(false);

      // Try to fetch from API
      const [status, weather, decisions, locs] = await Promise.all([
        getOperationalStatus(locationId),
        getRawWeather(locationId, 24),
        getDecisionHistory(locationId),
        getLocations(),
      ]);

      setOperationalStatus(status);
      setWeatherHistory(weather);
      setDecisionHistory(decisions);
      setLocations(locs);

      // Set current location
      const current = locs.find((loc) => loc.id === locationId);
      setCurrentLocation(current || null);
    } catch (err) {
      // API failed - use mock data
      console.warn('API unavailable, using mock data:', err);
      setUseMock(true);

      // Generate mock data
      const mockStatus = generateMockOperationalStatus(locationId);
      const mockWeather = generateMockWeatherHistory();
      const mockDecisions = generateMockDecisionHistory();

      setOperationalStatus(mockStatus);
      setWeatherHistory(mockWeather);
      setDecisionHistory(mockDecisions);
      setLocations(mockLocations);

      // Set current location from mock
      const current = mockLocations.find((loc) => loc.id === locationId);
      setCurrentLocation(current || null);

      // Don't show error - just silently use mock
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  useEffect(() => {
    fetchData();

   
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    operationalStatus,
    weatherHistory,
    decisionHistory,
    locations,
    currentLocation,
    loading,
    error,
    setLocationId,
    refetch: fetchData,
    useMock,
  };
}
