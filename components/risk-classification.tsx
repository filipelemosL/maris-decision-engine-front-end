import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface RiskClassificationProps {
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskIndex: number;
}

const riskConfig = {
  LOW: {
    label: 'Baixo',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    icon: CheckCircle,
    description: 'Condições operacionais ótimas',
  },
  MODERATE: {
    label: 'Moderado',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    icon: AlertCircle,
    description: 'Monitorar próximas mudanças',
  },
  HIGH: {
    label: 'Alto',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    icon: AlertTriangle,
    description: 'Risco significativo detectado',
  },
  CRITICAL: {
    label: 'Crítico',
    color: 'text-red-600',
    bg: 'bg-red-600/10',
    borderColor: 'border-red-600/20',
    icon: AlertTriangle,
    description: 'Suspenda operações imediatamente',
  },
};

export default function RiskClassification({
  riskLevel,
  riskIndex,
}: RiskClassificationProps) {
  const config = riskConfig[riskLevel];
  const Icon = config.icon;

  const getDayClassification = () => {
    if (riskLevel === 'LOW') return '🟢 Dia Seguro';
    if (riskLevel === 'MODERATE') return '🟡 Dia Viável';
    if (riskLevel === 'HIGH') return '🔴 Dia Crítico';
    return '⚫ Dia Inviável';
  };

  return (
    <Card className={`border-accent/20 bg-card/50 backdrop-blur-sm ${config.borderColor} border-2`}>
      <CardHeader className="border-b border-accent/10 pb-4">
        <CardTitle className="text-lg font-semibold">
          Classificação do Dia
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Main Risk Display */}
        <div className={`${config.bg} rounded-xl p-6 space-y-4 border ${config.borderColor}`}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Risco Ambiental
              </div>
              <div className={`text-4xl font-bold ${config.color}`}>
                {riskIndex}
              </div>
            </div>
            <Icon className={`w-12 h-12 ${config.color}`} />
          </div>

          <div className={`text-lg font-bold ${config.color}`}>
            {config.label}
          </div>
        </div>

        {/* Day Classification */}
        <div className="pt-2 border-t border-accent/10">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Status da Operação
          </div>
          <div className="text-2xl font-bold text-foreground">
            {getDayClassification()}
          </div>
        </div>

        {/* Description */}
        <div className="pt-2 border-t border-accent/10">
          <p className="text-sm text-muted-foreground">
            {config.description}
          </p>
        </div>

        {/* Risk Breakdown */}
        <div className="pt-4 border-t border-accent/10 space-y-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Fatores
          </div>
          <div className="space-y-2">
            {[
              { factor: 'Ondas', status: 'Moderado', color: 'text-amber-400' },
              { factor: 'Vento', status: 'Baixo', color: 'text-emerald-400' },
              { factor: 'Corrente', status: 'Baixo', color: 'text-emerald-400' },
              { factor: 'Visibilidade', status: 'Bom', color: 'text-emerald-400' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.factor}</span>
                <span className={`font-semibold ${item.color}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <div className="pt-4 border-t border-accent/10">
          <div className="text-xs text-muted-foreground">
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
