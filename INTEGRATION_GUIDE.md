# Integração com Maris Decision Engine - Guia de Uso

## 🚀 Configuração da Integração

A aplicação foi totalmente integrada com a API REST do MARIS Decision Engine. Aqui estão os próximos passos:

### 1️⃣ Iniciar a API Backend

```bash
# Navegue até a pasta do backend
cd /caminho/para/maris-api

# Ativar virtual environment (Windows)
.venv\Scripts\Activate.ps1

# Iniciar servidor
python api.py
```

A API estará disponível em: **http://localhost:5000**

### 2️⃣ Iniciar o Frontend

```bash
# Navegue até a pasta do frontend
cd /caminho/para/MDE-FRONT/maris-decision-engine-front-end

# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev
```

A aplicação estará disponível em: **http://localhost:3000**

---

## 🔧 Configuração da URL da API

A URL da API está configurada em `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Se sua API roda em outro endereço, atualize este arquivo.

---

## 📊 Componentes Integrados

### 1. **Risk Classification** (Classificação do Dia)
- Mostra o Índice de Risco Ambiental (IEA)
- Status operacional: EXCELENTE → BOM → MODERADO → RESTRITO → PROIBIDO
- Cores dinâmicas baseadas no risco

### 2. **Operational Window** (Janela de Operação)
- Melhor horário para operações
- Qualidade: GOOD | FAIR | POOR
- Indicadores: Altura de onda, Vento, Temperatura

### 3. **Risk Indicators** (Indicadores)
- Altura de onda (m)
- Velocidade do vento (km/h)
- Temperatura do mar (°C)
- Pressão (hPa)
- Velocidade da corrente (m/s)
- Direção do vento (°)

### 4. **Interruption Probability** (Probabilidade de Interrupção)
- Percentual de chance de interrupção
- Tendência: Aumentando | Estável | Diminuindo
- Nível de risco: BAIXA | MODERADA | ALTA

### 5. **Risk Trend Chart** (Gráfico de Tendência)
- Histórico de risco (últimas 10 leituras)
- Mínimo, Máximo, Médio
- Visualização em tempo real

### 6. **Location Selector** (Seletor de Localização)
- Múltiplas plataformas/localizações
- Alternancia rápida entre locais
- Dados atualizan automaticamente

---

## 🔄 Atualização de Dados

Os dados são automaticamente atualizados a cada **30 segundos**. Você pode também:

1. **Mudar de localização**: Clique em qualquer plataforma no seletor
2. **Forçar atualização**: Os dados sincronizam a cada 30 segundos automaticamente

---

## 📱 API Endpoints Utilizados

A aplicação utiliza os seguintes endpoints:

| Endpoint | Descrição |
|----------|-----------|
| `GET /api/locations` | Lista todas as plataformas |
| `GET /api/operational-status/<id>` | Status atual de uma plataforma |
| `GET /api/weather/raw/<id>?hours=24` | Dados brutos das últimas 24h |
| `GET /api/decision/<id>` | Histórico processado (últimos 10 registros) |

---

## 🛠️ Estrutura de Arquivos Adicionados

```
lib/
├── api.ts                  # Serviço de chamadas à API (tipos e funções)

hooks/
├── use-dashboard-data.ts   # Hook customizado para gerenciar estado

.env.local                  # Configurações de ambiente
```

---

## 🔍 Troubleshooting

### ❌ Erro: "Erro de Conexão"
**Solução:** 
- Certifique-se de que a API está rodando em `http://localhost:5000`
- Verifique o .env.local: `NEXT_PUBLIC_API_URL=http://localhost:5000`
- Reinicie ambos os servidores

### ❌ Dados não atualizam
**Solução:**
- Os dados atualizam a cada 30 segundos automaticamente
- Verifique se a API está gerando dados novos (POST /api/process-weather)

### ❌ Componente não aparece
**Solução:**
- Verifique o console do navegador para erros
- Certifique-se de que o localStorage/sessionStorage não está bloqueado

---

## 📊 Fluxo de Dados

```
┌──────────────────┐
│   Backend API    │ (Python/Flask)
│  http://5000     │
└────────┬─────────┘
         │ (Endpoints: locations, weather, decision)
         ▼
┌──────────────────┐
│  Frontend App    │ (Next.js/React)
│  http://3000     │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│   Componentes Renderizados   │
│ - Risk Classification        │
│ - Operational Window         │
│ - Risk Indicators            │
│ - Interruption Probability   │
│ - Risk Trend Chart           │
└──────────────────────────────┘
```

---

## 🎯 Próximas Melhorias Sugeridas

1. **WebSocket em Tempo Real**
   - Substituir polling por WebSocket para atualizações instantâneas
   - Reduzir latência de dados

2. **Alertas e Notificações**
   - Notificar quando risco muda de nível
   - Avisos em tempo real de condições críticas

3. **Histórico e Gráficos Avançados**
   - Comparação entre períodos
   - Previsões 7-14 dias

4. **Integração com Incidentes**
   - Registrar quando interrupções realmente ocorrem
   - Correlacionar com previsões

5. **Mobile App**
   - React Native com mesmos componentes
   - PWA para acesso offline

---

## 📞 Dúvidas?

Revise a documentação da API original em:
- `Documentação MARIS Decision Engine.md`

Ou consulte os arquivos:
- `lib/api.ts` - Tipos e funções da API
- `hooks/use-dashboard-data.ts` - Lógica de busca de dados
- `app/page.tsx` - Integração dos componentes
