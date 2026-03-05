import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wind, Waves, Gauge, Droplets } from 'lucide-react';

interface RiskIndicatorsProps {
  oceanData: {
    waveHeight: number;
    windSpeed: number;
    windDirection: number;
    currentSpeed: number;
    temperature: number;
    pressure: number;
    visibility: number;
    humidity: number;
  };
}

interface Indicator {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  risk: 'low' | 'moderate' | 'high';
  range: { min: number; max: number; warning: number };
}

function getRiskColor(value: number, range: { min: number; max: number; warning: number }) {
  if (value < range.min || value > range.max) return 'text-red-400';
  if (value > range.warning) return 'text-amber-400';
  return 'text-emerald-400';
}

function getRiskBgColor(value: number, range: { min: number; max: number; warning: number }) {
  if (value < range.min || value > range.max) return 'bg-red-500/10';
  if (value > range.warning) return 'bg-amber-500/10';
  return 'bg-emerald-500/10';
}

export default function RiskIndicators({ oceanData }: RiskIndicatorsProps) {
  const indicators: Indicator[] = [
    {
      label: 'Altura de Onda',
      value: oceanData.waveHeight.toFixed(1),
      unit: 'm',
      icon: <Waves className="w-5 h-5" />,
      risk: oceanData.waveHeight > 3.5 ? 'high' : oceanData.waveHeight > 2.5 ? 'moderate' : 'low',
      range: { min: 0, max: 5, warning: 3.5 },
    },
    {
      label: 'Velocidade do Vento',
      value: oceanData.windSpeed.toFixed(0),
      unit: 'kts',
      icon: <Wind className="w-5 h-5" />,
      risk: oceanData.windSpeed > 25 ? 'high' : oceanData.windSpeed > 15 ? 'moderate' : 'low',
      range: { min: 0, max: 40, warning: 25 },
    },
    {
      label: 'Corrente Marítima',
      value: oceanData.currentSpeed.toFixed(2),
      unit: 'kts',
      icon: <Gauge className="w-5 h-5" />,
      risk: oceanData.currentSpeed > 2 ? 'high' : oceanData.currentSpeed > 1.5 ? 'moderate' : 'low',
      range: { min: 0, max: 3, warning: 2 },
    },
    {
      label: 'Umidade Relativa',
      value: oceanData.humidity.toFixed(0),
      unit: '%',
      icon: <Droplets className="w-5 h-5" />,
      risk: oceanData.humidity > 90 ? 'high' : oceanData.humidity > 75 ? 'moderate' : 'low',
      range: { min: 0, max: 100, warning: 90 },
    },
  ];

  return (
    <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b border-accent/10 pb-4">
        <CardTitle className="text-lg font-semibold">
          Índice de Risco Ambiental
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          {indicators.map((indicator, idx) => {
            const riskColor = getRiskColor(
              parseFloat(indicator.value),
              indicator.range
            );
            const riskBg = getRiskBgColor(
              parseFloat(indicator.value),
              indicator.range
            );

            return (
              <div
                key={idx}
                className={`p-4 rounded-lg border border-accent/10 ${riskBg} space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {indicator.label}
                  </span>
                  <div className={`${riskColor}`}>
                    {indicator.icon}
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${riskColor}`}>
                    {indicator.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {indicator.unit}
                  </span>
                </div>
                <div className="pt-2 border-t border-accent/10">
                  <div className="text-xs text-muted-foreground">
                    {indicator.risk === 'low' && 'Risco: Baixo'}
                    {indicator.risk === 'moderate' && 'Risco: Moderado'}
                    {indicator.risk === 'high' && 'Risco: Alto'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional metrics */}
        <div className="mt-6 pt-6 border-t border-accent/10 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Visibilidade
            </span>
            <div className="text-2xl font-bold text-foreground">
              {oceanData.visibility.toFixed(1)} nm
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Direção do Vento
            </span>
            <div className="text-2xl font-bold text-foreground">
              {oceanData.windDirection}°
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
