'use client';

import { useState, useEffect } from 'react';
import OperationalWindow from '@/components/operational-window';
import RiskIndicators from '@/components/risk-indicators';
import InterruptionProbability from '@/components/interruption-probability';
import RiskTrendChart from '@/components/risk-trend-chart';
import RiskClassification from '@/components/risk-classification';

export default function Home() {
  const [oceanData, setOceanData] = useState({
    waveHeight: 2.8,
    windSpeed: 18,
    windDirection: 245,
    temperature: 16.2,
    pressure: 1018,
    visibility: 8.5,
    currentSpeed: 1.2,
    humidity: 78,
  });

  const [riskMetrics, setRiskMetrics] = useState({
    environmentalRiskIndex: 42,
    operationalRiskLevel: 'MODERATE',
    interruptionProbability: 28,
    riskTrend: [
      { hour: '-5h', risk: 38 },
      { hour: '-4h', risk: 40 },
      { hour: '-3h', risk: 41 },
      { hour: '-2h', risk: 42 },
      { hour: '-1h', risk: 42 },
      { hour: 'Now', risk: 42 },
      { hour: '+1h', risk: 44 },
      { hour: '+2h', risk: 46 },
      { hour: '+3h', risk: 48 },
      { hour: '+4h', risk: 50 },
    ],
  });

  const [operationalWindow, setOperationalWindow] = useState({
    start: '14:30',
    end: '18:15',
    quality: 'GOOD',
    duration: 225,
    confidence: 87,
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOceanData((prev) => ({
        ...prev,
        waveHeight: prev.waveHeight + (Math.random() - 0.5) * 0.3,
        windSpeed: Math.max(5, prev.windSpeed + (Math.random() - 0.5) * 2),
        temperature: prev.temperature + (Math.random() - 0.5) * 0.1,
        pressure: prev.pressure + (Math.random() - 0.5) * 1,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground dark">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6 max-w-7xl mx-auto">
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
            trend="increasing"
          />
        </div>

        {/* Bottom Row - Risk Trend */}
        <div className="lg:col-span-3">
          <RiskTrendChart trendData={riskMetrics.riskTrend} />
        </div>
      </div>
    </main>
  );
}
