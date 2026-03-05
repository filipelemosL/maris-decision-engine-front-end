// Mock ocean data for realistic development experience
export interface OceanData {
  waveHeight: number;
  windSpeed: number;
  windDirection: number;
  temperature: number;
  pressure: number;
  visibility: number;
  currentSpeed: number;
  humidity: number;
}

/**
 * Generates realistic mock ocean data
 * Values fluctuate slightly to simulate real conditions
 */
export function generateMockOceanData(): OceanData {
  const now = Date.now();
  const timeInHours = (now / (1000 * 60 * 60)) % 24;
  
  // Simulate daily cycles and realistic variations
  const waveHeightBase = 2.5 + Math.sin(timeInHours / 6) * 0.8;
  const windSpeedBase = 18 + Math.sin(timeInHours / 8) * 7;
  const temperatureBase = 16 + Math.sin(timeInHours / 12) * 2;
  const pressureBase = 1015 + Math.cos(timeInHours / 10) * 5;

  return {
    waveHeight: Number((waveHeightBase + Math.random() * 0.3).toFixed(2)),
    windSpeed: Number((windSpeedBase + Math.random() * 2).toFixed(1)),
    windDirection: (180 + Math.cos(timeInHours / 6) * 45 + Math.random() * 30) % 360,
    temperature: Number((temperatureBase + Math.random() * 0.5).toFixed(1)),
    pressure: Number((pressureBase + Math.random() * 2).toFixed(1)),
    visibility: Number((10 - Math.abs(Math.sin(timeInHours / 12)) * 3 + Math.random() * 1).toFixed(1)),
    currentSpeed: Number((1.2 + Math.sin(timeInHours / 7) * 0.5 + Math.random() * 0.2).toFixed(2)),
    humidity: Number((75 + Math.sin(timeInHours / 8) * 10 + Math.random() * 5).toFixed(0)),
  };
}

/**
 * Returns consistent mock data for a specific hour
 */
export function getMockOceanDataForHour(hoursAgo: number): OceanData {
  const seed = Math.floor(hoursAgo);
  const random = (Math.sin(seed) + 1) / 2; // Seeded random 0-1
  
  const waveHeightBase = 2.5 + Math.sin(seed / 3) * 0.8;
  const windSpeedBase = 18 + Math.sin(seed / 4) * 7;
  const temperatureBase = 16 + Math.sin(seed / 6) * 2;

  return {
    waveHeight: Number((waveHeightBase + random * 0.3).toFixed(2)),
    windSpeed: Number((windSpeedBase + random * 2).toFixed(1)),
    windDirection: (180 + Math.cos(seed / 2) * 45 + random * 30) % 360,
    temperature: Number((temperatureBase + random * 0.5).toFixed(1)),
    pressure: Number((1015 + Math.cos(seed / 2) * 5 + random * 2).toFixed(1)),
    visibility: Number((10 - Math.abs(Math.sin(seed / 3)) * 3 + random).toFixed(1)),
    currentSpeed: Number((1.2 + Math.sin(seed / 2) * 0.5 + random * 0.2).toFixed(2)),
    humidity: Number((75 + Math.sin(seed / 3) * 10 + random * 5).toFixed(0)),
  };
}
