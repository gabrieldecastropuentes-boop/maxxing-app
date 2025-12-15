# 📊 Guia Completo: Analytics e Tracking de Conversões

## 🎯 Índice
1. [Google Analytics 4 (GA4)](#google-analytics-4-ga4)
2. [Facebook Pixel](#facebook-pixel)
3. [Eventos de Conversão Rastreados](#eventos-de-conversão-rastreados)
4. [Como Testar Conversões](#como-testar-conversões)
5. [Verificar se está Funcionando](#verificar-se-está-funcionando)

---

## 📈 Google Analytics 4 (GA4)

### Passo 1: Criar Conta GA4

1. Acesse: https://analytics.google.com/
2. Clique em **"Começar a medir"** ou **"Criar conta"**
3. Preencha:
   - **Nome da conta**: Ex: "Maxxing Quiz"
   - **Nome da propriedade**: Ex: "GlowMax"
   - **Fuso horário**: (GMT-03:00) Brasília
   - **Moeda**: Real brasileiro (BRL)

### Passo 2: Obter Measurement ID

1. Após criar, vá em **Administrador** (⚙️)
2. Em **Propriedade**, clique em **Fluxos de dados**
3. Clique no fluxo **Web**
4. Copie o **ID de medição** (formato: `G-XXXXXXXXXX`)

### Passo 3: Configurar no Projeto

Edite o arquivo `src/layouts/Layout.astro`:

```typescript
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // Cole seu ID aqui
```

### Passo 4: Configurar Eventos de Conversão

1. No GA4, vá em **Administrador** → **Eventos**
2. Clique em **Criar evento**
3. Crie eventos personalizados baseados nos eventos abaixo

---

## 📱 Facebook Pixel

### Passo 1: Criar Pixel

1. Acesse: https://business.facebook.com/
2. Vá em **Gerenciador de Eventos** → **Pixels**
3. Clique em **Criar Pixel**
4. Nome: "Maxxing Quiz Pixel"
5. Copie o **Pixel ID** (formato: `1234567890123456`)

### Passo 2: Configurar no Projeto

Edite o arquivo `src/layouts/Layout.astro`:

```typescript
const FB_PIXEL_ID = "1234567890123456"; // Cole seu Pixel ID aqui
```

### Passo 3: Configurar Eventos de Conversão

1. No Facebook Events Manager, vá em **Eventos**
2. Configure eventos personalizados conforme abaixo

---

## 🎯 Eventos de Conversão Rastreados

### Eventos Automáticos Já Implementados:

#### 1. **Quiz Iniciado**
```javascript
Evento: 'quiz_started'
Quando: Usuário seleciona gênero
Parâmetros: { gender: 'male' | 'female' }
```

#### 2. **Etapa do Quiz**
```javascript
Evento: 'quiz_step_completed'
Quando: Usuário responde uma pergunta
Parâmetros: { questionNumber: 1-17 }
```

#### 3. **Quiz Completo**
```javascript
Evento: 'quiz_completed'
Quando: Usuário responde todas as perguntas
```

#### 4. **Paywall Visualizado**
```javascript
Evento: 'paywall_viewed'
Quando: Usuário chega na página de pagamento
Parâmetros: { score: 0-100 }
```

#### 5. **Checkout Iniciado** ⭐ CONVERSÃO PRINCIPAL
```javascript
Evento: 'checkout_initiated'
Quando: Usuário clica no botão de compra
Parâmetros: { score: 0-100 }
```

#### 6. **Lead Capturado**
```javascript
Evento: 'Lead'
Quando: Usuário preenche email/nome
Parâmetros: { email: 'user@email.com' }
```

---

## 🧪 Como Testar Conversões

### Método 1: Google Analytics DebugView (Recomendado)

1. **Instalar extensão**: [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
2. **Ativar DebugView**:
   - Abra o GA4
   - Vá em **Configurar** → **DebugView**
   - Ative a extensão no Chrome
3. **Testar no site**:
   - Acesse seu site
   - Complete o quiz
   - Veja os eventos aparecendo em tempo real no DebugView

### Método 2: Facebook Events Manager Test Events

1. **Acesse**: https://business.facebook.com/events_manager2
2. **Vá em**: Seu Pixel → **Testar eventos**
3. **Adicione URL de teste**: Cole a URL do seu site
4. **Teste no site**:
   - Abra o site em outra aba
   - Complete ações (quiz, paywall, etc.)
   - Veja eventos aparecendo em tempo real

### Método 3: Console do Navegador

1. Abra o **DevTools** (F12)
2. Vá na aba **Console**
3. Complete o quiz
4. Você verá logs como:
   ```
   [Track] quiz_started { gender: 'male' }
   [Track] quiz_step_completed { questionNumber: 1 }
   [Track] checkout_initiated { score: 75 }
   ```

### Método 4: Google Tag Assistant

1. **Instalar**: [Tag Assistant Legacy](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. **Ativar** e testar no site
3. Veja todos os eventos sendo disparados

---

## ✅ Verificar se está Funcionando

### Checklist de Verificação:

#### Google Analytics 4:
- [ ] Measurement ID configurado em `Layout.astro`
- [ ] Eventos aparecem no DebugView
- [ ] Eventos aparecem em **Relatórios** → **Tempo real**
- [ ] Conversões configuradas em **Administrador** → **Eventos** → **Marcar como conversão**

#### Facebook Pixel:
- [ ] Pixel ID configurado em `Layout.astro`
- [ ] Pixel Helper mostra "Pixel carregado" (extensão Chrome)
- [ ] Eventos aparecem em **Testar eventos**
- [ ] Eventos aparecem em **Eventos** → **Visão geral**

### Extensões Úteis para Teste:

1. **Facebook Pixel Helper**: 
   - https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc

2. **Google Analytics Debugger**:
   - https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna

3. **Tag Assistant Legacy**:
   - https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk

---

## 🎯 Configurar Eventos como Conversões

### Google Analytics 4:

1. Vá em **Administrador** → **Eventos**
2. Encontre o evento `checkout_initiated`
3. Ative o toggle **"Marcar como conversão"**
4. Repita para outros eventos importantes:
   - `quiz_completed`
   - `paywall_viewed`
   - `Lead`

### Facebook Pixel:

1. Vá em **Gerenciador de Eventos** → **Eventos**
2. Clique em **Configurar eventos**
3. Mapeie eventos:
   - `checkout_initiated` → **InitiateCheckout**
   - `Lead` → **Lead**
   - `paywall_viewed` → **ViewContent**

---

## 📊 Métricas Importantes para Acompanhar

### Funil de Conversão:

1. **Visualizações** → `PageView`
2. **Quiz Iniciado** → `quiz_started`
3. **Quiz Completo** → `quiz_completed`
4. **Paywall Visualizado** → `paywall_viewed`
5. **Checkout Iniciado** → `checkout_initiated` ⭐

### Taxa de Conversão Esperada:

- Quiz Iniciado → Quiz Completo: **60-80%**
- Quiz Completo → Paywall: **100%** (automático)
- Paywall → Checkout: **10-30%**
- Checkout → Compra: **Depende do checkout externo**

---

## 🔧 Troubleshooting

### Eventos não aparecem?

1. **Verifique IDs**: Confirme que os IDs estão corretos em `Layout.astro`
2. **Limpe cache**: Ctrl+Shift+R (hard refresh)
3. **Verifique console**: Veja se há erros no DevTools
4. **Teste em modo anônimo**: Para evitar bloqueadores de anúncios
5. **Verifique AdBlockers**: Desative temporariamente

### Pixel não carrega?

1. Verifique se `FB_PIXEL_ID` não está vazio
2. Use Facebook Pixel Helper para diagnosticar
3. Verifique console do navegador para erros

### GA4 não rastreia?

1. Verifique se `GA_MEASUREMENT_ID` começa com `G-`
2. Use DebugView para ver eventos em tempo real
3. Verifique se não há bloqueadores

---

## 📱 Testar no Celular

### Android (Chrome):

1. Conecte via USB
2. Ative **Depuração USB**
3. Abra `chrome://inspect`
4. Veja console e eventos em tempo real

### iOS (Safari):

1. Ative **Inspeção Web** em Configurações → Safari → Avançado
2. Conecte ao Mac
3. Abra Safari → Desenvolver → [Seu iPhone]
4. Veja console e eventos

---

## 🚀 Próximos Passos

1. ✅ Configurar IDs no `Layout.astro`
2. ✅ Testar eventos localmente
3. ✅ Fazer deploy
4. ✅ Verificar eventos em produção
5. ✅ Configurar conversões no GA4 e Facebook
6. ✅ Criar campanhas baseadas nos dados

---

**💡 Dica**: Sempre teste em produção após deploy para garantir que tudo está funcionando!

