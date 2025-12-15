# 🚀 Guia Completo de Configuração e Deploy

## ✅ Status Atual

- ✅ **Build:** Sucesso
- ✅ **Deploy:** Concluído
- ✅ **APIs com persistência:** Implementado
- 🔗 **URL Produção:** https://maxxing-quiz-c5lf7315g-gabriel-puentes-projects-52980dc2.vercel.app

---

## 📋 1. CONFIGURAR VARIÁVEIS DE AMBIENTE NO VERCEL

### Passo a Passo:

1. **Acesse o painel da Vercel:**
   - Vá para: https://vercel.com/dashboard
   - Faça login com sua conta

2. **Encontre seu projeto:**
   - Procure por `maxxing-quiz` na lista de projetos
   - Clique no projeto

3. **Acesse as configurações:**
   - Clique na aba **"Settings"** (Configurações)
   - No menu lateral, clique em **"Environment Variables"** (Variáveis de Ambiente)

4. **Adicione as variáveis obrigatórias:**

   #### 🔴 OBRIGATÓRIAS:

   ```
   DATABASE_URL=postgresql://usuario:senha@host:porta/database
   ```
   - **Onde obter:** URL de conexão do seu banco PostgreSQL (Supabase, Neon, Railway, etc.)
   - **Formato:** `postgresql://user:password@host:port/database?sslmode=require`

   ```
   PERFECTPAY_WEBHOOK_TOKEN=seu_token_secreto_aqui
   ```
   - **Onde obter:** Painel da PerfectPay → Configurações → Webhooks
   - **Uso:** Validação de segurança dos webhooks de compra

   ```
   ADMIN_API_TOKEN=seu_token_admin_secreto
   ```
   - **Onde obter:** Gere um token aleatório seguro (ex: `openssl rand -hex 32`)
   - **Uso:** Proteção da área admin (`/admin/purchases`)

   #### 🟡 OPCIONAIS (mas recomendadas):

   ```
   PUBLIC_FB_PIXEL_ID=1234567890
   ```
   - **Onde obter:** Facebook Events Manager → Pixel ID

   ```
   FB_ACCESS_TOKEN=seu_access_token
   FB_PIXEL_ID=1234567890
   FB_BUSINESS_ID=seu_business_id
   ```
   - **Onde obter:** Facebook Business Manager → Configurações → CAPI

   ```
   PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
   - **Onde obter:** Google Analytics 4 → Admin → Data Streams

   ```
   PUBLIC_SITE_URL=https://seu-dominio.com
   PUBLIC_SITE_NAME=Maxxing Inteligente
   ```

5. **Configure para cada ambiente:**
   - Marque as caixas: **Production**, **Preview**, **Development**
   - Clique em **"Add"** para cada variável

6. **Redeploy após adicionar variáveis:**
   - Vá para a aba **"Deployments"**
   - Clique nos três pontos (...) do último deploy
   - Selecione **"Redeploy"**

---

## 🧪 2. TESTAR O SITE EM PRODUÇÃO

### Checklist de Testes:

#### ✅ Testes Básicos:

1. **Homepage:**
   - [ ] Acesse: https://maxxing-quiz-c5lf7315g-gabriel-puentes-projects-52980dc2.vercel.app
   - [ ] Verifique se a página carrega corretamente
   - [ ] Teste em mobile (use DevTools ou dispositivo real)
   - [ ] Verifique se todas as imagens carregam

2. **Quiz:**
   - [ ] Acesse: `/quiz`
   - [ ] Complete o quiz masculino
   - [ ] Complete o quiz feminino
   - [ ] Verifique se os resultados aparecem
   - [ ] Teste upload de fotos (se disponível)

3. **APIs:**
   - [ ] Teste `/api/leads` (POST)
   - [ ] Teste `/api/quiz/result` (POST)
   - [ ] Verifique se os dados estão sendo salvos no banco

4. **Pre-checkout:**
   - [ ] Acesse `/pre-checkout`
   - [ ] Verifique se o formulário funciona
   - [ ] Teste o redirecionamento para checkout

5. **Admin:**
   - [ ] Acesse `/admin/purchases`
   - [ ] Verifique se requer autenticação (token)
   - [ ] Teste listagem de compras

### Ferramentas de Teste:

**Teste de API (usando curl):**

```bash
# Testar /api/leads
curl -X POST https://seu-dominio.vercel.app/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "user_id": "user_123",
    "source": "quiz"
  }'

# Testar /api/quiz/result
curl -X POST https://seu-dominio.vercel.app/api/quiz/result \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "quiz_id": "quiz_123",
    "score": 75,
    "gender": "male",
    "answers": []
  }'
```

**Teste no navegador (Console):**

```javascript
// Testar API de leads
fetch('/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'teste@example.com',
    user_id: 'user_123',
    source: 'quiz'
  })
}).then(r => r.json()).then(console.log);
```

### Verificar Logs:

1. **No painel da Vercel:**
   - Vá para **"Deployments"**
   - Clique no deploy mais recente
   - Aba **"Functions"** → Veja logs das APIs

2. **No banco de dados:**
   - Conecte ao seu banco PostgreSQL
   - Verifique se os dados estão sendo salvos:
     ```sql
     SELECT * FROM leads ORDER BY created_at DESC LIMIT 10;
     SELECT * FROM quiz_results ORDER BY created_at DESC LIMIT 10;
     ```

---

## 💾 3. IMPLEMENTAÇÃO DA PERSISTÊNCIA NO BANCO

### ✅ O que foi implementado:

1. **`/api/leads`:**
   - ✅ Salva leads no banco de dados
   - ✅ Verifica duplicatas (mesmo email + user_id)
   - ✅ Retorna status: `captured`, `duplicate`, ou `error`

2. **`/api/quiz/result`:**
   - ✅ Salva resultados do quiz no banco
   - ✅ Calcula plano recomendado automaticamente
   - ✅ Associa com lead (se fornecido)

### 📊 Estrutura do Banco:

As APIs agora salvam nos seguintes modelos:

**Leads:**
- `leads` table: email, userId, name, phone, source, UTM params

**Quiz Results:**
- `quiz_results` table: userId, quizId, score, gender, recommendedPlan, answers (JSON)

### 🔗 Associar Lead com Quiz Result:

Ao chamar `/api/quiz/result`, você pode incluir o `lead_id`:

```json
{
  "user_id": "user_123",
  "quiz_id": "quiz_123",
  "score": 75,
  "gender": "male",
  "answers": [...],
  "lead_id": "lead_abc123"  // ← ID retornado por /api/leads
}
```

---

## 🌐 4. CONFIGURAR DOMÍNIO PERSONALIZADO

### Passo a Passo:

1. **No painel da Vercel:**
   - Vá para **Settings** → **Domains**
   - Clique em **"Add Domain"**

2. **Digite seu domínio:**
   - Exemplo: `maxxing.com` ou `www.maxxing.com`
   - Clique em **"Add"**

3. **Configure DNS no seu provedor:**
   
   A Vercel fornecerá instruções específicas. Geralmente:

   **Para domínio raiz (maxxing.com):**
   ```
   Tipo: A
   Nome: @
   Valor: 76.76.21.21
   ```

   **Para subdomínio (www.maxxing.com):**
   ```
   Tipo: CNAME
   Nome: www
   Valor: cname.vercel-dns.com
   ```

4. **Aguarde propagação DNS:**
   - Pode levar de alguns minutos a 48 horas
   - Verifique status em: https://dnschecker.org

5. **SSL automático:**
   - A Vercel configura SSL automaticamente
   - Certificado Let's Encrypt é gerado automaticamente

### Configurar Variáveis com Novo Domínio:

Após configurar o domínio, atualize:

```
PUBLIC_SITE_URL=https://seu-dominio.com
```

E faça um redeploy.

---

## 🔧 5. CONFIGURAR BANCO DE DADOS

### Opções Recomendadas:

1. **Supabase** (Recomendado):
   - https://supabase.com
   - Gratuito até 500MB
   - PostgreSQL gerenciado
   - Dashboard incluído

2. **Neon:**
   - https://neon.tech
   - PostgreSQL serverless
   - Plano gratuito generoso

3. **Railway:**
   - https://railway.app
   - PostgreSQL fácil de configurar
   - $5/mês após créditos gratuitos

### Configurar Prisma:

1. **Crie o banco:**
   - Escolha um dos serviços acima
   - Crie um novo projeto/banco
   - Copie a connection string

2. **Configure a variável:**
   - No Vercel: `DATABASE_URL=postgresql://...`

3. **Execute migrations:**
   ```bash
   # Localmente (com DATABASE_URL no .env)
   npx prisma migrate dev
   
   # Ou push direto (desenvolvimento)
   npx prisma db push
   ```

4. **Verifique no Prisma Studio:**
   ```bash
   npx prisma studio
   ```

---

## 📝 6. CHECKLIST FINAL

### Antes de ir para produção:

- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] `DATABASE_URL` configurada e testada
- [ ] Banco de dados criado e migrations executadas
- [ ] APIs testadas e salvando dados corretamente
- [ ] Webhook da PerfectPay configurado (se aplicável)
- [ ] Facebook Pixel/GA configurados (se aplicável)
- [ ] Domínio personalizado configurado (opcional)
- [ ] Testes em mobile realizados
- [ ] Logs verificados no painel da Vercel

---

## 🆘 TROUBLESHOOTING

### Problema: "Database connection failed"
**Solução:**
- Verifique se `DATABASE_URL` está correta
- Verifique se o banco aceita conexões externas
- Teste a conexão localmente com `npx prisma studio`

### Problema: "API retorna 500"
**Solução:**
- Verifique logs no painel da Vercel
- Verifique se todas as variáveis estão configuradas
- Teste localmente com `npm run dev`

### Problema: "Dados não aparecem no banco"
**Solução:**
- Verifique se as migrations foram executadas
- Verifique se o schema do Prisma está atualizado
- Use `npx prisma studio` para inspecionar o banco

---

## 📚 Recursos Úteis

- **Documentação Vercel:** https://vercel.com/docs
- **Documentação Prisma:** https://www.prisma.io/docs
- **Documentação Astro:** https://docs.astro.build

---

**Última atualização:** $(date)
**Status:** ✅ Pronto para produção

