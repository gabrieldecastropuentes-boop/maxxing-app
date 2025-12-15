# 🚀 Configurar Supabase no Vercel

## ✅ Variáveis de Ambiente (sem credenciais reais)

Use **apenas placeholders**. Nunca commit credenciais reais. Gere novas chaves no dashboard do Supabase e configure somente no painel da Vercel.

---

## 📋 Variáveis de Ambiente para Adicionar no Vercel

### 1. Acesse o Vercel Dashboard

👉 **Link:** https://vercel.com/dashboard

1. Selecione o projeto: `maxxing-quiz`
2. Vá para: **Settings** → **Environment Variables**
3. Clique em **"Add New"**

### 2. Adicione estas variáveis (uma por uma):

#### 🔴 OBRIGATÓRIAS:

**DATABASE_URL (exemplo):**
```
postgresql://postgres:<SUPABASE_DB_PASSWORD>@db.<SUPABASE_PROJECT_REF>.supabase.co:5432/postgres
```
- Marque: ✅ Production, ✅ Preview, ✅ Development

**SUPABASE_URL:**
```
https://<SUPABASE_PROJECT_REF>.supabase.co
```
- Marque: ✅ Production, ✅ Preview, ✅ Development

**PUBLIC_SUPABASE_URL:**
```
https://<SUPABASE_PROJECT_REF>.supabase.co
```
- Marque: ✅ Production, ✅ Preview, ✅ Development

**SUPABASE_ANON_KEY:**
```
<SUPABASE_ANON_KEY>
```
- Marque: ✅ Production, ✅ Preview, ✅ Development

**PUBLIC_SUPABASE_ANON_KEY:**
```
<SUPABASE_ANON_KEY>
```
- Marque: ✅ Production, ✅ Preview, ✅ Development

**SUPABASE_PROJECT_REF:**
```
<SUPABASE_PROJECT_REF>
```
- Marque: ✅ Production, ✅ Preview, ✅ Development

**SUPABASE_DB_PASSWORD:**
```
<SUPABASE_DB_PASSWORD>
```
- Marque: ✅ Production, ✅ Preview, ✅ Development

**SUPABASE_REGION:**
```
us-east-1
```
- Marque: ✅ Production, ✅ Preview, ✅ Development

**SUPABASE_ACCESS_TOKEN:**
```
<SUPABASE_ACCESS_TOKEN>
```
- Marque: ✅ Production, ✅ Preview, ✅ Development

---

## 🔄 3. Fazer Redeploy

Após adicionar todas as variáveis:

1. Vá para: **Deployments**
2. Clique nos **três pontos (...)** do último deploy
3. Selecione **"Redeploy"**
4. Aguarde o deploy completar

---

## ✅ 4. Verificar se Funcionou

Após o redeploy:

1. Acesse a URL do site em produção
2. Teste as APIs que usam o banco:
   - `/api/leads` (deve salvar no Supabase)
   - `/api/quiz/result` (deve salvar no Supabase)
3. Verifique os logs no Vercel se houver erros

---

## 🆘 Troubleshooting

### Problema: "Database connection failed"
**Solução:**
- Verifique se `DATABASE_URL` está correta
- Verifique se a senha está correta
- Teste a conexão localmente primeiro

### Problema: "Supabase client not initialized"
**Solução:**
- Verifique se `PUBLIC_SUPABASE_URL` e `PUBLIC_SUPABASE_ANON_KEY` estão configuradas
- Certifique-se de que estão marcadas para Production

---

**Link direto:** https://vercel.com/dashboard

