// Exemplos de Uso - Como Integrar Novos Componentes

// ============================================
// EXEMPLO 1: Usar a API em um novo componente
// ============================================

import { useEffect, useState } from 'react';
import { getOperationalStatus, OperationalStatus } from '@/lib/api';

export function MinhaComponent({ locationId }: { locationId: number }) {
  const [status, setStatus] = useState<OperationalStatus | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getOperationalStatus(locationId)
      .then(setStatus)
      .finally(() => setLoading(false));
  }, [locationId]);
  
  if (loading) return <div>Carregando...</div>;
  if (!status) return <div>Erro ao carregar dados</div>;
  
  return (
    <div>
      <h2>{status.location.name}</h2>
      <p>Risco: {status.current_status.iea_score}</p>
    </div>
  );
}

// ============================================
// EXEMPLO 2: Usar o hook em um componente
// ============================================

import { useDashboardData } from '@/hooks/use-dashboard-data';

export function MeuDashboard() {
  const { 
    operationalStatus,     // Status operacional atual
    weatherHistory,        // Histórico de clima (últimas 24h)
    decisionHistory,       // Histórico de inteligência (últimos 10)
    locations,             // Lista de plataformas
    loading,               // Está carregando?
    error,                 // Tem erro?
    setLocationId,         // Mudar localização
    refetch,               // Forçar atualização
  } = useDashboardData(1); // locationId padrão = 1
  
  if (error) return <div className="error">{error}</div>;
  if (loading) return <div>Carregando...</div>;
  
  return (
    <div>
      <h1>{currentLocation?.name}</h1>
      
      {/* Status Atual */}
      <div>
        <p>IEA Score: {operationalStatus?.current_status.iea_score}</p>
        <p>Status: {operationalStatus?.current_status.operational_status}</p>
      </div>
      
      {/* Dados de Vento */}
      <div>
        <p>Vento: {weatherHistory[0]?.wind_speed_kmh} km/h</p>
      </div>
      
      {/* Histórico */}
      <div>
        {decisionHistory.map((record, i) => (
          <div key={i}>
            {record.timestamp}: IEA {record.iea_score}
          </div>
        ))}
      </div>
      
      {/* Seletor de Localização */}
      <div>
        {locations.map((loc) => (
          <button 
            key={loc.id}
            onClick={() => setLocationId(loc.id)}
          >
            {loc.name}
          </button>
        ))}
      </div>
      
      {/* Forçar atualização */}
      <button onClick={refetch}>Atualizar Agora</button>
    </div>
  );
}

// ============================================
// EXEMPLO 3: Mapeamento de Status/Cores
// ============================================

import { 
  mapOperationalStatusToRiskLevel,
  mapTrendIndicatorToTrend,
  type DecisionData 
} from '@/lib/api';

export function MapeadorStatus(decision: DecisionData) {
  const riskLevel = mapOperationalStatusToRiskLevel(
    decision.operational_status
  );
  switch (riskLevel) {
    case 'LOW':
      return '🟢 BAIXO RISCO - Operações normais';
    case 'MODERATE':
      return '🟡 MODERADO - Monitorar';
    case 'HIGH':
      return '🔴 ALTO - Restringir operações';
    case 'CRITICAL':
      return '⚫ CRÍTICO - Suspender operações';
  }
}

// ============================================
// EXEMPLO 4: Criar um gráfico com histórico
// ============================================

import { LineChart, Line, XAxis, YAxis } from 'recharts';
import { useDashboardData } from '@/hooks/use-dashboard-data';

export function GraficoIea() {
  const { decisionHistory } = useDashboardData();
  
  const data = decisionHistory.map((record) => ({
    timestamp: new Date(record.timestamp).toLocaleTimeString(),
    iea: record.iea_score,
  }));
  
  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="timestamp" />
      <YAxis domain={[0, 100]} />
      <Line type="monotone" dataKey="iea" stroke="#8884d8" />
    </LineChart>
  );
}

// ============================================
// EXEMPLO 5: Buscar dados específicos manualmente
// ============================================

import { 
  getRawWeather,
  getDecisionHistory,
  getOperationLimits,
  type WeatherRaw 
} from '@/lib/api';

async function exemploFetchManual() {
  // Buscar dados brutos das últimas 24h
  const weather: WeatherRaw[] = await getRawWeather(1, 24);
  console.log('Vento médio:', 
    weather.reduce((sum, w) => sum + w.wind_speed_kmh, 0) / weather.length
  );
  
  // Buscar histórico de decisão
  const decisions = await getDecisionHistory(1);
  console.log('IEA média:', 
    decisions.reduce((sum, d) => sum + d.iea_score, 0) / decisions.length
  );
  
  // Buscar limites operacionais
  const limits = await getOperationLimits();
  console.log('Limite vento ROV:', limits[0].max_wind_kmh);
}

// ============================================
// EXEMPLO 6: Criar um componente personalizado
// ============================================

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardData } from '@/hooks/use-dashboard-data';

export function StatusCard() {
  const { operationalStatus, loading, error } = useDashboardData();
  
  if (error) {
    return (
      <Card className="border-red-500">
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }
  
  if (loading) {
    return <Card><CardContent>Carregando...</CardContent></Card>;
  }
  
  const status = operationalStatus?.current_status;
  if (!status) return null;
  
  const colorMap = {
    'EXCELENTE': 'bg-green-500',
    'BOM': 'bg-lime-500',
    'MODERADO': 'bg-yellow-500',
    'RESTRITO': 'bg-orange-500',
    'PROIBIDO': 'bg-red-500',
  };
  
  return (
    <Card className={colorMap[status.operational_status]}>
      <CardHeader>
        <CardTitle>{status.operational_status}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>IEA: {status.iea_score}</p>
        <p>Interrupção: {status.interruption_probability_percent}%</p>
        <p>Tendência: {status.trend_indicator}</p>
      </CardContent>
    </Card>
  );
}

// ============================================
// EXEMPLO 7: Configurar polling customizado
// ============================================

import { useEffect, useState } from 'react';
import { getOperationalStatus } from '@/lib/api';

export function PollingCustomizado(locationId: number) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Buscar imediatamente
    getOperationalStatus(locationId).then(setData);
    
    // Polling a cada 10 segundos (customize conforme necessário)
    const interval = setInterval(
      () => getOperationalStatus(locationId).then(setData),
      10000
    );
    
    return () => clearInterval(interval);
  }, [locationId]);
  
  return <div>{/* Renderizar data */}</div>;
}

// ============================================
// EXEMPLO 8: Adicionar notificações de alerta
// ============================================

import { useEffect } from 'react';
import { useDashboardData } from '@/hooks/use-dashboard-data';

export function TriggerAlerts() {
  const { operationalStatus } = useDashboardData();
  const [previousStatus, setPreviousStatus] = useState<string>('');
  
  useEffect(() => {
    if (!operationalStatus) return;
    
    const currentStatus = operationalStatus.current_status.operational_status;
    
    if (previousStatus && previousStatus !== currentStatus) {
      // Status mudou - disparar alerta
      console.warn(`⚠️ Status mudou de ${previousStatus} para ${currentStatus}`);
      
      // Aqui você pode adicionar:
      // - Toast notification
      // - Email
      // - SMS
      // - Som
    }
    
    setPreviousStatus(currentStatus);
  }, [operationalStatus?.current_status.operational_status]);
  
  return null;
}
