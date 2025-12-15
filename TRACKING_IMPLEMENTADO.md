# ✅ Sistema de Tracking Implementado

## 🎯 Métricas Implementadas

### Eventos Mínimos (Práticos):

- ✅ `home_view` - Visualização da homepage
- ✅ `start_quiz_click` - Clique para iniciar quiz
- ✅ `quiz_step_view` - Visualização de cada etapa (com step_index e step_id)
- ✅ `quiz_answer_select` - Seleção de resposta (com step_index e answer_id)
- ✅ `photo_upload_start` - Início do upload de foto
- ✅ `photo_upload_success` - Upload bem-sucedido
- ✅ `photo_upload_skip` - Pular upload (se implementado)
- ✅ `photo_upload_error` - Erro no upload
- ✅ `quiz_complete` - Quiz completo
- ✅ `vsl_view` - Visualização do VSL (pre-checkout)
- ✅ `checkout_click` - Clique para checkout (saída para PerfectPay)

---

## 🔐 Dados Coletados (Pseudônimo)

### Session Tracking:
- ✅ `session_id` - UUID salvo no localStorage
- ✅ Persiste durante toda a sessão do usuário

### UTMs e Parâmetros:
- ✅ `utm_source`
- ✅ `utm_medium`
- ✅ `utm_campaign`
- ✅ `utm_content`
- ✅ `utm_term`
- ✅ `fbclid` - Facebook Click ID

### Cookies do Facebook:
- ✅ `_fbp` - Facebook Pixel Browser ID
- ✅ `_fbc` - Facebook Click ID

### Metadados:
- ✅ `user_agent` - User agent do navegador
- ✅ `referrer` - URL de referência
- ✅ `url` - URL atual
- ✅ `timestamp` - Timestamp do evento

---

## 📁 Arquivos Criados/Modificados

### Novos:
1. ✅ `src/lib/tracking.ts` - Sistema completo de tracking
   - Geração de session_id
   - Captura de UTMs
   - Captura de cookies do Facebook
   - Funções helper para cada evento

### Modificados:
1. ✅ `src/pages/api/track.ts` - Endpoint atualizado
   - Aceita todos os novos campos
   - Salva session_id como user_id (pseudônimo)
   - Armazena UTMs e cookies no event_data

2. ✅ `src/components/home/HomePage.tsx` - Tracking de home_view

3. ✅ `src/components/quiz/IntroScreen.tsx` - Tracking de start_quiz_click

4. ✅ `src/components/quiz/QuestionScreen.tsx` - Tracking de quiz_step_view e quiz_answer_select

5. ✅ `src/components/quiz/PhotoUploadScreen.tsx` - Tracking de photo_upload_*

6. ✅ `src/components/Quiz.tsx` - Tracking de quiz_complete

7. ✅ `src/components/pre-checkout/PreCheckoutPage.tsx` - Tracking de vsl_view e checkout_click

---

## 🔄 Fluxo de Dados

```
Frontend (Browser)
    ↓
tracking.homeView() / tracking.quizStepView() / etc.
    ↓
POST /api/track
    ↓
┌─────────────────────────┐
│ 1. Salvar no Supabase   │ → events table (com session_id, UTMs, cookies)
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ 2. Disparar Facebook CAPI│ → Facebook Graph API (quando configurado)
└─────────────────────────┘
    ↓
Resposta de sucesso
```

---

## 📊 Estrutura dos Dados no Banco

### Tabela `events`:

```typescript
{
  id: string;
  userId: string; // session_id (pseudônimo)
  eventName: string; // 'home_view', 'quiz_step_view', etc.
  eventData: {
    session_id: string;
    step_index?: number;
    step_id?: string;
    answer_id?: number;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    fbclid?: string;
    fbp?: string;
    fbc?: string;
    // ... outros metadados
  };
  source: string; // 'home', 'quiz', 'vsl', 'web'
  createdAt: DateTime;
}
```

---

## 🧪 Como Usar

### Exemplo Básico:

```typescript
import { tracking } from '../lib/tracking';

// Home view
tracking.homeView();

// Quiz step
tracking.quizStepView(1, 'question_1');

// Answer selection
tracking.quizAnswerSelect(1, 2);

// Photo upload
tracking.photoUploadStart();
tracking.photoUploadSuccess();

// Quiz complete
tracking.quizComplete({ total_questions: 16 });

// VSL view
tracking.vslView();

// Checkout click
tracking.checkoutClick();
```

---

## ✅ Checklist de Implementação

- [x] Sistema de tracking criado
- [x] Session ID implementado (localStorage)
- [x] Captura de UTMs implementada
- [x] Captura de cookies Facebook implementada
- [x] Endpoint /api/track atualizado
- [x] Todos os eventos implementados
- [x] Integração nos componentes
- [x] Build testado e funcionando
- [ ] Testes end-to-end
- [ ] Dashboard de métricas

---

## 📈 Próximos Passos

1. **Criar Dashboard de Métricas:**
   - Query eventos por session_id
   - Funil de conversão
   - Taxa de abandono por etapa

2. **Análise de Funil:**
   ```sql
   -- Exemplo: Funil de conversão
   SELECT 
     COUNT(DISTINCT CASE WHEN event_name = 'home_view' THEN user_id END) as home_views,
     COUNT(DISTINCT CASE WHEN event_name = 'start_quiz_click' THEN user_id END) as quiz_starts,
     COUNT(DISTINCT CASE WHEN event_name = 'quiz_complete' THEN user_id END) as quiz_completes,
     COUNT(DISTINCT CASE WHEN event_name = 'checkout_click' THEN user_id END) as checkout_clicks
   FROM events
   WHERE created_at > NOW() - INTERVAL '7 days';
   ```

3. **Match com CAPI:**
   - Usar session_id + fbp/fbc para match futuro
   - Quando tiver email/telefone (após compra), fazer match

---

## 🔗 Links Úteis

- **Tracking Helper:** `src/lib/tracking.ts`
- **API Endpoint:** `src/pages/api/track.ts`
- **Arquitetura:** `ARQUITETURA_SERVERLESS.md`

---

**Status:** ✅ Implementado e funcionando
**Última atualização:** $(date)

