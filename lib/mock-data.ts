import { Location, WeatherRaw, DecisionData, OperationalStatus } from './api';
import { getMockOceanDataForHour } from './mock-ocean-data';

// Mock data para testes sem API
export const mockLocations: Location[] = [
  {
    id: 1,
    name: 'Plataforma Alpha',
    latitude: -12.345678,
    longitude: -38.456789,
    platform_type: 'Offshore Oil',
  },
  {
    id: 2,
    name: 'Plataforma Beta',
    latitude: -13.456789,
    longitude: -39.567890,
    platform_type: 'Offshore Gas',
  },
];

export function generateMockWeatherHistory(): WeatherRaw[] {
  const history: WeatherRaw[] = [];
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const oceanData = getMockOceanDataForHour(i);
    
    history.push({
      id: Math.floor(Math.random() * 10000),
      timestamp: timestamp.toISOString(),
      wind_speed_kmh: oceanData.windSpeed,
      wind_direction_deg: oceanData.windDirection,
      wave_height_m: oceanData.waveHeight,
      pressure_hpa: oceanData.pressure,
      sea_temp_c: oceanData.temperature,
      current_speed_ms: oceanData.currentSpeed,
    });
  }

  return history;
}

export function generateMockDecisionHistory(): DecisionData[] {
  const history: DecisionData[] = [];
  const now = new Date();
  const statuses: Array<'EXCELENTE' | 'BOM' | 'MODERADO' | 'RESTRITO' | 'PROIBIDO'> = [
    'EXCELENTE',
    'BOM',
    'MODERADO',
    'RESTRITO',
  ];
  const trends: Array<'MELHORANDO' | 'ESTAVEL' | 'PIORANDO'> = [
    'MELHORANDO',
    'ESTAVEL',
    'PIORANDO',
  ];

  for (let i = 9; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000);
    
    history.push({
      timestamp: timestamp.toISOString(),
      iea_score: 35 + Math.sin(i / 3) * 15 + Math.random() * 8,
      operational_status: statuses[Math.floor(Math.random() * statuses.length)],
      interruption_probability_percent: 25 + Math.sin(i / 4) * 20 + Math.random() * 10,
      trend_indicator: trends[Math.floor(Math.random() * trends.length)],
    });
  }

  return history;
}

export function generateMockOperationalStatus(locationId: number): OperationalStatus {
  const locations = mockLocations.find((loc) => loc.id === locationId) || mockLocations[0];
  const decisionHistory = generateMockDecisionHistory();
  const latestDecision = decisionHistory[decisionHistory.length - 1];

  return {
    status: 'success',
    location: locations,
    current_status: {
      ...latestDecision,
      is_operational: latestDecision.operational_status !== 'PROIBIDO',
    },
  };
}
