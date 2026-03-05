'use client';

import { useMemo, useState, useEffect } from 'react';
import OperationalWindow from '@/components/operational-window';
import RiskIndicators from '@/components/risk-indicators';
import InterruptionProbability from '@/components/interruption-probability';
import RiskTrendChart from '@/components/risk-trend-chart';
import RiskClassification from '@/components/risk-classification';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { mapOperationalStatusToRiskLevel, mapTrendIndicatorToTrend } from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    operationalStatus,
    weatherHistory,
    decisionHistory,
    locations,
    currentLocation,
    loading,
    setLocationId,
    useMock,
  } = useDashboardData(1);

  // Process data for components
  const oceanData = useMemo(() => {
    if (!weatherHistory || weatherHistory.length === 0) {
      return {
        waveHeight: 0,
        windSpeed: 0,
        windDirection: 0,
        temperature: 0,
        pressure: 0,
        visibility: 0,
        currentSpeed: 0,
        humidity: 0,
      };
    }

    const latestWeather = weatherHistory[weatherHistory.length - 1];
    return {
      waveHeight: latestWeather.wave_height_m || 0,
      windSpeed: latestWeather.wind_speed_kmh || 0,
      windDirection: latestWeather.wind_direction_deg || 0,
      temperature: latestWeather.sea_temp_c || 0,
      pressure: latestWeather.pressure_hpa || 0,
      visibility: 0,
      currentSpeed: latestWeather.current_speed_ms || 0,
      humidity: 0,
    };
  }, [weatherHistory]);

  const riskMetrics = useMemo(() => {
    if (!operationalStatus || !operationalStatus.current_status) {
      return {
        environmentalRiskIndex: 0,
        operationalRiskLevel: 'LOW' as const,
        interruptionProbability: 0,
        riskTrend: [] as Array<{ hour: string; risk: number }>,
      };
    }

    const currentStatus = operationalStatus.current_status;
    const riskLevel = mapOperationalStatusToRiskLevel(currentStatus.operational_status);

    // Create trend data from decision history
    const riskTrend = decisionHistory
      .slice(-10)
      .map((record, index) => ({
        hour: index === decisionHistory.length - 1 ? 'Now' : `${index - 10}h`,
        risk: record.iea_score,
      }));

    return {
      environmentalRiskIndex: Math.round(currentStatus.iea_score),
      operationalRiskLevel: riskLevel,
      interruptionProbability: Math.round(currentStatus.interruption_probability_percent),
      riskTrend:
        riskTrend.length > 0
          ? riskTrend
          : [{ hour: 'Now', risk: currentStatus.iea_score }],
    };
  }, [operationalStatus, decisionHistory]);

  const operationalWindow = useMemo(
    () => {
      const qualityValue = riskMetrics.environmentalRiskIndex < 40 ? 'GOOD' : 'FAIR';
      return {
        start: '14:30',
        end: '18:15',
        quality: qualityValue as 'GOOD' | 'FAIR',
        duration: 225,
        confidence: 87,
      };
    },
    [riskMetrics.environmentalRiskIndex]
  );

  const trendIndicator = useMemo(() => {
    if (!operationalStatus?.current_status) return 'stable';
    return mapTrendIndicatorToTrend(operationalStatus.current_status.trend_indicator);
  }, [operationalStatus]);

  if (!isClient || loading) {
    return (
      <main className="min-h-screen bg-background text-foreground dark">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center">
            <Spinner className="w-12 h-12 mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground dark">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6 max-w-7xl mx-auto">
        {/* Header with Location Selector */}
        <div className="lg:col-span-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">MARIS Decision Engine</h1>
              {currentLocation && (
                <p className="text-muted-foreground">
                  {currentLocation.name} • {currentLocation.platform_type}
                </p>
              )}
            </div>
            {locations.length > 1 && (
              <div className="flex gap-2">
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => setLocationId(location.id)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentLocation?.id === location.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                  >
                    {location.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Row - Risk Classification and Operational Window */}
        <div className="lg:col-span-1">
          <RiskClassification
            riskLevel={riskMetrics.operationalRiskLevel}
            riskIndex={riskMetrics.environmentalRiskIndex}
          />
        </div>

        <div className="lg:col-span-2">
          <OperationalWindow
            startTime={operationalWindow.start}
            endTime={operationalWindow.end}
            quality={operationalWindow.quality}
            duration={operationalWindow.duration}
            confidence={operationalWindow.confidence}
            oceanData={oceanData}
          />
        </div>

        {/* Middle Row - Risk Indicators and Interruption Probability */}
        <div className="lg:col-span-2">
          <RiskIndicators oceanData={oceanData} />
        </div>

        <div className="lg:col-span-1">
          <InterruptionProbability
            probability={riskMetrics.interruptionProbability}
            trend={trendIndicator}
          />
        </div>

        {/* Bottom Row - Risk Trend */}
        <div className="lg:col-span-3">
          <RiskTrendChart trendData={riskMetrics.riskTrend} />
        </div>
      </div>

      {/* Status Indicator - API Connection Status */}
      <div className="fixed bottom-4 right-4 flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            useMock ? 'bg-red-500' : 'bg-emerald-500'
          }`}
          title={useMock ? 'Usando dados de teste (mock)' : 'Conectado à API'}
        />
      </div>
    </main>
  );
}
