# 🌊 Integração Maris Decision Engine - Resumo

## ✅ O que foi integrado

Sua aplicação Next.js foi **totalmente conectada** à API MARIS Decision Engine.

### 📂 Arquivos Criados:

1. **`lib/api.ts`** - Serviço centralizado para chamadas à API
   - Função para cada endpoint
   - Tipos TypeScript para dados
   - Mapeamento de status operacional

2. **`hooks/use-dashboard-data.ts`** - Hook React para gerenciar dados
   - Busca automática de dados
   - Atualização a cada 30 segundos
   - Tratamento de erro e loading

3. **`.env.local`** - Configuração da API
   - URL padrão: `http://localhost:5000`

4. **`app/page.tsx`** - Página principal atualizada
   - Usa dados reais da API
   - Seletor de múltiplas localizações
   - Estados de loading e erro

5. **`INTEGRATION_GUIDE.md`** - Documentação completa

---

## 🚀 Como Usar

### 1️⃣ Inicie a API Backend
```bash
# Terminal 1 - Backend
cd /caminho/para/api/backend
.venv\Scripts\Activate.ps1  # Windows
python api.py
```
✅ API estará em: `http://localhost:5000`

### 2️⃣ Inicie o Frontend (já iniciado)
```bash
# Terminal 2 - Frontend
cd C:\Users\Filipe\Desktop\MDE-FRONT\maris-decision-engine-front-end
pnpm dev
```
✅ App estará em: `http://localhost:3000`

---

## 📊 Dados em Tempo Real

A aplicação agora mostra:

| Componente | Dados da API |
|-----------|--------------|
| **Classificação do Dia** | IEA Score + Status Operacional |
| **Janela de Operação** | Dados de Vento, Onda, Temperatura |
| **Indicadores** | Vento, Onda, Temperatura, Pressão, Corrente |
| **Probabilidade** | % de Interrupção + Tendência |
| **Gráfico** | Histórico de Risco (últimos 10) |

---

## 🔧 Configuração da API

Se sua API não está em `http://localhost:5000`, edite `.env.local`:

```
NEXT_PUBLIC_API_URL=http://seu-servidor:5000
```

---

## 🎯 Próximas Melhorias Opcionais

- [ ] WebSocket para atualizações instantâneas
- [ ] Alertas quando risco muda
- [ ] Histórico e análises avançadas  
- [ ] Sincronização de incidentes

---

## 💡 Dicas

- ✅ Dados atualizam a cada 30 segundos automaticamente
- ✅ Mude de localização com o seletor no topo
- ✅ Console mostra erros se API não estiver disponível
- ✅ TypeScript com type-safe para todos os dados

---

## 📞 Dúvidas?

Veja:
- `INTEGRATION_GUIDE.md` - Documentação detalhada
- `lib/api.ts` - Código do serviço
- `hooks/use-dashboard-data.ts` - Lógica de dados
