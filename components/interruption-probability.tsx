import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface InterruptionProbabilityProps {
  probability: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export default function InterruptionProbability({
  probability,
  trend,
}: InterruptionProbabilityProps) {
  const getRiskLevel = (prob: number) => {
    if (prob < 20) return { level: 'BAIXA', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (prob < 50) return { level: 'MODERADA', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { level: 'ALTA', color: 'text-red-400', bg: 'bg-red-500/10' };
  };

  const getTrendLabel = (t: string) => {
    if (t === 'increasing') return { label: 'Aumentando', icon: '↑' };
    if (t === 'decreasing') return { label: 'Diminuindo', icon: '↓' };
    return { label: 'Estável', icon: '→' };
  };

  const riskInfo = getRiskLevel(probability);
  const trendInfo = getTrendLabel(trend);

  return (
    <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b border-accent/10 pb-4">
        <CardTitle className="text-lg font-semibold">
          Probabilidade de Interrupção
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Main Probability Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Circular progress background */}
              <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="55"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-accent/20"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="55"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${(probability / 100) * 345.575} 345.575`}
                  className={riskInfo.color}
                />
              </svg>
              {/* Center text */}
              <div className="text-center z-10">
                <div className={`text-4xl font-bold ${riskInfo.color}`}>
                  {probability}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">Probabilidade</div>
              </div>
            </div>
          </div>

          {/* Risk Level Badge */}
          <div className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${riskInfo.bg} mx-auto w-fit`}>
            <AlertTriangle className={`w-4 h-4 ${riskInfo.color}`} />
            <span className={`font-semibold text-sm ${riskInfo.color}`}>
              {riskInfo.level}
            </span>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="pt-4 border-t border-accent/10 space-y-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Tendência
          </div>
          <div className="flex items-center gap-3">
            <div className={`text-2xl font-bold ${trend === 'increasing' ? 'text-red-400' : trend === 'decreasing' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {trendInfo.icon}
            </div>
            <div>
              <div className={`font-semibold ${trend === 'increasing' ? 'text-red-400' : trend === 'decreasing' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {trendInfo.label}
              </div>
              <div className="text-xs text-muted-foreground">
                Próximas 6 horas
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="pt-4 border-t border-accent/10">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Recomendação
            </div>
            <div className="text-sm text-foreground">
              {probability < 20 && 'Operação segura. Proceda com vigilância padrão.'}
              {probability >= 20 && probability < 50 && 'Monitore atentamente. Prepare planos de contingência.'}
              {probability >= 50 && 'Alto risco. Considere atrasar operação.'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
