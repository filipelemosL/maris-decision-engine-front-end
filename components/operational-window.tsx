import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface OperationalWindowProps {
  startTime: string;
  endTime: string;
  quality: 'GOOD' | 'FAIR' | 'POOR';
  duration: number;
  confidence: number;
  oceanData: {
    waveHeight: number;
    windSpeed: number;
    temperature: number;
    pressure: number;
  };
}

const qualityConfig = {
  GOOD: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Excelente' },
  FAIR: { color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Aceitável' },
  POOR: { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Crítica' },
};

export default function OperationalWindow({
  startTime,
  endTime,
  quality,
  duration,
  confidence,
  oceanData,
}: OperationalWindowProps) {
  const config = qualityConfig[quality];

  return (
    <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b border-accent/10 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Melhor Janela de Operação
          </CardTitle>
          {quality === 'GOOD' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
          {quality === 'FAIR' && <AlertCircle className="w-5 h-5 text-amber-400" />}
          {quality === 'POOR' && <AlertCircle className="w-5 h-5 text-red-400" />}
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Time Window */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Horário
          </div>
          <div className="flex items-center justify-between text-3xl font-bold">
            <span className="text-primary">{startTime}</span>
            <div className="text-sm text-muted-foreground">→</div>
            <span className="text-primary">{endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Duração: {duration} minutos</span>
          </div>
        </div>

        {/* Quality Indicator */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Qualidade
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-lg ${config.bg}`}>
            <div className={`w-3 h-3 rounded-full ${config.color}`} />
            <span className={`font-semibold ${config.color}`}>{config.label}</span>
          </div>
        </div>

        {/* Confidence */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Confiabilidade
            </span>
            <span className="text-sm font-bold text-primary">{confidence}%</span>
          </div>
          <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-accent/10">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Altura de Onda</div>
            <div className="text-xl font-bold text-foreground">
              {oceanData.waveHeight.toFixed(1)}m
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Vento</div>
            <div className="text-xl font-bold text-foreground">
              {oceanData.windSpeed.toFixed(0)} kts
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Temperatura</div>
            <div className="text-xl font-bold text-foreground">
              {oceanData.temperature.toFixed(1)}°C
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Pressão</div>
            <div className="text-xl font-bold text-foreground">
              {oceanData.pressure.toFixed(0)} mb
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
