// API Base URL - configured via .env.local (NEXT_PUBLIC_API_URL)
// Default to localhost:5000 if not configured
const API_BASE_URL: string = 'http://localhost:5000';

// Types
export interface WeatherRaw {
  id: number;
  timestamp: string;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  wave_height_m: number | null;
  pressure_hpa: number | null;
  sea_temp_c: number | null;
  current_speed_ms: number | null;
}

export interface DecisionData {
  timestamp: string;
  iea_score: number;
  operational_status: 'EXCELENTE' | 'BOM' | 'MODERADO' | 'RESTRITO' | 'PROIBIDO';
  interruption_probability_percent: number;
  trend_indicator: 'MELHORANDO' | 'ESTAVEL' | 'PIORANDO';
}

export interface OperationalStatus {
  status: string;
  location: {
    id: number;
    name: string;
    platform_type: string;
  };
  current_status: DecisionData & {
    is_operational: boolean;
  };
}

export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  platform_type: string;
}

export interface OperationLimit {
  operation_type: string;
  max_wind_kmh: number;
  max_wave_m: number;
  max_current_ms: number;
}

// API Endpoints

export async function getHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) throw new Error('Health check failed');
    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
}

export async function getLocations() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/all-locations-status`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch locations');
    const apiData = await response.json();
    
    // Map API response to Location interface
    const locations: Location[] = apiData.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.coordinates?.latitude || item.latitude,
      longitude: item.coordinates?.longitude || item.longitude,
      platform_type: item.platform_type,
    }));
    
    return locations;
  } catch (error) {
    console.error('Get locations error:', error);
    throw error;
  }
}

export async function getRawWeather(locationId: number, hours: number = 24) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/weather-raw/${locationId}?hours=${hours}`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch raw weather');
    const apiData = await response.json();
    
    // Map API response to WeatherRaw interface, adding id if missing
    const weatherData: WeatherRaw[] = apiData.data.map((item: any, index: number) => ({
      id: item.id || index,
      timestamp: item.timestamp,
      wind_speed_kmh: item.wind_speed_kmh,
      wind_direction_deg: item.wind_direction_deg,
      wave_height_m: item.wave_height_m,
      pressure_hpa: item.pressure_hpa,
      sea_temp_c: item.sea_temp_c,
      current_speed_ms: item.current_speed_ms,
    }));
    
    return weatherData;
  } catch (error) {
    console.error('Get raw weather error:', error);
    throw error;
  }
}

export async function getDecisionHistory(locationId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/decision-history/${locationId}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch decision history');
    const apiData = await response.json();
    
    // Map API response to DecisionData interface
    const decisions: DecisionData[] = apiData.data.map((item: any) => ({
      timestamp: item.timestamp,
      iea_score: item.iea_score,
      operational_status: item.status || item.operational_status,
      interruption_probability_percent: item.interruption_probability || item.interruption_probability_percent,
      trend_indicator: item.trend || item.trend_indicator,
    }));
    
    return decisions;
  } catch (error) {
    console.error('Get decision history error:', error);
    throw error;
  }
}

export async function getOperationalStatus(locationId: number) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/operational-status/${locationId}`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch operational status');
    const apiResponse = await response.json();
    
    // Handle both wrapped (data.data) and direct responses
    const data = apiResponse.data || apiResponse;
    return data as OperationalStatus;
  } catch (error) {
    console.error('Get operational status error:', error);
    throw error;
  }
}

export async function getOperationLimits() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/operation-limits`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch operation limits');
    const data = await response.json();
    return data.data as OperationLimit[];
  } catch (error) {
    console.error('Get operation limits error:', error);
    throw error;
  }
}

export async function processWeather() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/process-data`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to process weather');
    return await response.json();
  } catch (error) {
    console.error('Process weather error:', error);
    throw error;
  }
}

// Helper function to map API data to component props
export function mapOperationalStatusToRiskLevel(
  status: 'EXCELENTE' | 'BOM' | 'MODERADO' | 'RESTRITO' | 'PROIBIDO'
): 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' {
  switch (status) {
    case 'EXCELENTE':
    case 'BOM':
      return 'LOW';
    case 'MODERADO':
      return 'MODERATE';
    case 'RESTRITO':
      return 'HIGH';
    case 'PROIBIDO':
      return 'CRITICAL';
    default:
      return 'MODERATE';
  }
}

export function mapTrendIndicatorToTrend(
  trend: 'MELHORANDO' | 'ESTAVEL' | 'PIORANDO'
): 'increasing' | 'decreasing' | 'stable' {
  switch (trend) {
    case 'MELHORANDO':
      return 'decreasing';
    case 'ESTAVEL':
      return 'stable';
    case 'PIORANDO':
      return 'increasing';
    default:
      return 'stable';
  }
}
