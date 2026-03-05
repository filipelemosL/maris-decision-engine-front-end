'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface TrendDataPoint {
  hour: string;
  risk: number;
}

interface RiskTrendChartProps {
  trendData: TrendDataPoint[];
}

export default function RiskTrendChart({ trendData }: RiskTrendChartProps) {
  const currentIndex = trendData.findIndex((d) => d.hour === 'Now');
  const maxRisk = Math.max(...trendData.map((d) => d.risk));
  const minRisk = Math.min(...trendData.map((d) => d.risk));
  const avgRisk = Math.round(trendData.reduce((acc, d) => acc + d.risk, 0) / trendData.length);

  return (
    <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b border-accent/10 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Tendência de Risco
          </CardTitle>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Próximas 12 Horas
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-accent/5 rounded-lg p-3 space-y-1 border border-accent/10">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Mínimo
            </div>
            <div className="text-2xl font-bold text-emerald-400">{minRisk}</div>
          </div>
          <div className="bg-accent/5 rounded-lg p-3 space-y-1 border border-accent/10">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Médio
            </div>
            <div className="text-2xl font-bold text-amber-400">{avgRisk}</div>
          </div>
          <div className="bg-accent/5 rounded-lg p-3 space-y-1 border border-accent/10">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Máximo
            </div>
            <div className="text-2xl font-bold text-red-400">{maxRisk}</div>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-80 -mx-6 px-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.7 0.2 262)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.7 0.2 262)" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.25 0.02 240)"
                vertical={false}
              />
              <XAxis
                dataKey="hour"
                stroke="oklch(0.65 0 0)"
                style={{ fontSize: '12px' }}
                tick={{ fill: 'oklch(0.65 0 0)' }}
              />
              <YAxis
                stroke="oklch(0.65 0 0)"
                style={{ fontSize: '12px' }}
                tick={{ fill: 'oklch(0.65 0 0)' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.15 0.02 240)',
                  border: '1px solid oklch(0.25 0.02 240)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
                labelStyle={{ color: 'oklch(0.95 0 0)' }}
                formatter={(value) => [
                  `${value}%`,
                  'Índice de Risco',
                ]}
                labelFormatter={(label) => `${label}`}
                cursor={{ stroke: 'oklch(0.65 0.2 262)', strokeWidth: 1 }}
              />
              {/* Reference lines for risk zones */}
              <ReferenceLine
                y={50}
                stroke="oklch(0.6 0.25 25)"
                strokeDasharray="5 5"
                label={{
                  value: 'Zona de Risco Alto',
                  position: 'right',
                  fill: 'oklch(0.65 0 0)',
                  fontSize: 12,
                }}
              />
              <ReferenceLine
                y={currentIndex >= 0 && trendData[currentIndex] ? trendData[currentIndex].risk : 42}
                stroke="oklch(0.65 0.2 262)"
                strokeDasharray="5 5"
                label={{
                  value: 'Risco Atual',
                  position: 'left',
                  fill: 'oklch(0.65 0.2 262)',
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="risk"
                stroke="oklch(0.7 0.2 262)"
                strokeWidth={3}
                dot={{
                  fill: 'oklch(0.7 0.2 262)',
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  fill: 'oklch(0.7 0.2 262)',
                }}
                isAnimationActive={true}
                animationDuration={1000}
                fillOpacity={1}
                fill="url(#riskGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Assessment */}
        <div className="pt-4 border-t border-accent/10">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Análise
            </div>
            <div className="text-sm text-foreground">
              <p>
                O índice de risco apresenta tendência{' '}
                <span className="font-semibold text-amber-400">ascendente</span> nas próximas
                horas. Recomenda-se monitoramento contínuo e ajustes operacionais conforme
                necessário.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
