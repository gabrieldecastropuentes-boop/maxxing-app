# 🚀 Configurar Supabase no Vercel

## ✅ Credenciais Configuradas Localmente

Agora você precisa adicionar as mesmas credenciais no Vercel para que o deploy funcione.

---

## 📋 Variáveis de Ambiente para Adicionar no Vercel

### 1. Acesse o Vercel Dashboard

👉 **Link:** https://vercel.com/dashboard

1. Selecione o projeto: `maxxing-quiz`
2. Vá para: **Settings** → **Environment Variables**
3. Clique em **"Add New"**

### 2. Adicione estas variáveis (uma por uma):

#### 🔴 OBRIGATÓRIAS:

**DATABASE_URL:**
```
postgresql://postgres:jpGgiuFTUgOyPnQM@db.lwtjeqvnyytxlecxnkpw.supabase.co:5432/postgres
```
- Marque: ✅ Production, ✅ Preview, ✅ Development

**SUPABASE_URL:**
```
https://lwtjeqvnyytxlecxnkpw.supabase.co
```
- Marque: ✅ Production, ✅ Preview, ✅ Development

**PUBLIC_SUPABASE_URL:**
```
https://lwtjeqvnyytxlecxnkpw.supabase.co
```
- Marque: ✅ Production, ✅ Preview, ✅ Development

**SUPABASE_ANON_KEY:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3dGplcXZueXl0eGxlY3hua3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NTkxOTksImV4cCI6MjA4MTEzNTE5OX0.D_7mjPmK2A7Suq7fCKGNNPDu5xaHLBJS3aJIwCJ-b4A
```
- Marque: ✅ Production, ✅ Preview, ✅ Development

**PUBLIC_SUPABASE_ANON_KEY:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3dGplcXZueXl0eGxlY3hua3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NTkxOTksImV4cCI6MjA4MTEzNTE5OX0.D_7mjPmK2A7Suq7fCKGNNPDu5xaHLBJS3aJIwCJ-b4A
```
- Marque: ✅ Production, ✅ Preview, ✅ Development

**SUPABASE_PROJECT_REF:**
```
lwtjeqvnyytxlecxnkpw
```
- Marque: ✅ Production, ✅ Preview, ✅ Development

**SUPABASE_DB_PASSWORD:**
```
jpGgiuFTUgOyPnQM
```
- Marque: ✅ Production, ✅ Preview, ✅ Development

**SUPABASE_REGION:**
```
us-east-1
```
- Marque: ✅ Production, ✅ Preview, ✅ Development

**SUPABASE_ACCESS_TOKEN:**
```
sbp_85d205a7eb454d896b8f4971ebd230d5ca52341f
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

