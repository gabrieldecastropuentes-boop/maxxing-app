# ✅ Configuração Completa do Supabase

## 📋 Credenciais Configuradas

- ✅ **Project ID:** `lwtjeqvnyytxlecxnkpw`
- ✅ **Database Password:** `jpGgiuFTUgOyPnQM`
- ✅ **Region:** `us-east-1` (América)
- ⚠️ **Access Token:** **PRECISA OBTER** (veja abaixo)

---

## 🔑 1. OBTER ACCESS TOKEN DO SUPABASE

### Passo a Passo:

1. **Acesse o Supabase Dashboard:**
   - Vá para: https://supabase.com/dashboard
   - Faça login com sua conta

2. **Navegue até Tokens:**
   - Clique no seu perfil (canto superior direito)
   - Selecione **"Account Settings"** ou **"Access Tokens"**
   - Ou acesse diretamente: https://supabase.com/dashboard/account/tokens

3. **Criar novo token:**
   - Clique em **"Generate new token"**
   - Dê um nome: `MCP Server Token` ou `Cursor MCP`
   - Clique em **"Generate token"**
   - ⚠️ **COPIE O TOKEN IMEDIATAMENTE** (você só verá uma vez!)

4. **Adicionar ao arquivo de configuração:**
   - Abra o arquivo `mcp-config.json`
   - Substitua `SEU_ACCESS_TOKEN_AQUI` pelo token copiado

---

## 📝 2. OBTER OUTRAS CREDENCIAIS DO SUPABASE

### URL e Chaves da API:

1. **No painel do Supabase:**
   - Vá para: **Settings** → **API**

2. **Você verá:**
   - **Project URL:** `https://lwtjeqvnyytxlecxnkpw.supabase.co`
   - **anon/public key:** (chave longa começando com `eyJhbGc...`)
   - **service_role key:** (chave longa - mantenha segura!)

3. **Adicione ao arquivo `.env`** (crie se não existir):
   ```env
   SUPABASE_URL=https://lwtjeqvnyytxlecxnkpw.supabase.co
   SUPABASE_ANON_KEY=sua_anon_key_aqui
   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
   DATABASE_URL=postgresql://postgres:jpGgiuFTUgOyPnQM@db.lwtjeqvnyytxlecxnkpw.supabase.co:5432/postgres
   ```

---

## ⚙️ 3. CONFIGURAR MCP NO CURSOR

### Opção A: Copiar arquivo de configuração

1. **Localizar o arquivo de configuração do Cursor:**
   - macOS: `~/Library/Application Support/Cursor/User/globalStorage/mcp.json`
   - Ou criar em: `~/.cursor/mcp.json`

2. **Copiar o conteúdo de `mcp-config.json`:**
   ```bash
   # Ver o conteúdo
   cat mcp-config.json
   ```

3. **Colar no arquivo de configuração do Cursor** (após adicionar o Access Token)

### Opção B: Usar via Settings do Cursor

1. Abra **Settings** (`Cmd + ,`)
2. Procure por "MCP" ou "Model Context Protocol"
3. Adicione a configuração manualmente

---

## 🚀 4. CONFIGURAR NO VERCEL

### Adicionar Variáveis de Ambiente:

1. **Acesse o Vercel Dashboard:**
   - Vá para: https://vercel.com/dashboard
   - Selecione seu projeto `maxxing-quiz`

2. **Vá para Settings → Environment Variables**

3. **Adicione estas variáveis:**

   ```
   DATABASE_URL=postgresql://postgres:jpGgiuFTUgOyPnQM@db.lwtjeqvnyytxlecxnkpw.supabase.co:5432/postgres
   ```

   ```
   SUPABASE_URL=https://lwtjeqvnyytxlecxnkpw.supabase.co
   ```

   ```
   PUBLIC_SUPABASE_URL=https://lwtjeqvnyytxlecxnkpw.supabase.co
   ```

   ```
   SUPABASE_ANON_KEY=sua_anon_key_aqui
   ```

   ```
   PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
   ```

   ```
   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
   ```

4. **Marque para:** Production, Preview, Development

5. **Clique em "Save"**

6. **Faça um redeploy:**
   - Vá para **Deployments**
   - Clique nos três pontos do último deploy
   - Selecione **"Redeploy"**

---

## 🔗 5. CONECTAR COM GITHUB

### No Supabase Dashboard:

1. **Vá para:** Settings → Integrations
2. **Clique em "GitHub"**
3. **Clique em "Authorize GitHub"**
4. **Autorize o acesso ao repositório:**
   - `gabrieldecastropuentes-boop/maxxing-app`
5. **Configure as opções:**
   - ✅ Sync branches
   - ✅ Auto-apply migrations
   - ✅ Preview branches

---

## 🗄️ 6. CONFIGURAR BANCO DE DADOS

### Opção A: Usar Prisma (Recomendado)

O projeto já está configurado com Prisma. Para conectar ao Supabase:

1. **Atualize o `.env` local:**
   ```env
   DATABASE_URL=postgresql://postgres:jpGgiuFTUgOyPnQM@db.lwtjeqvnyytxlecxnkpw.supabase.co:5432/postgres
   ```

2. **Execute as migrations:**
   ```bash
   npx prisma migrate dev
   # ou
   npx prisma db push
   ```

3. **Verifique no Prisma Studio:**
   ```bash
   npx prisma studio
   ```

### Opção B: Criar Tabelas Diretamente no Supabase

1. **Acesse o SQL Editor no Supabase:**
   - Vá para: **SQL Editor** no painel
   - Clique em **"New query"**

2. **Execute o SQL baseado no seu `schema.prisma`**

---

## 🧪 7. TESTAR A CONEXÃO

### Testar MCP Server:

```bash
# Verificar se está funcionando
supabase-mcp-server --version

# Usar o inspector
supabase-mcp-inspector
```

### Testar Conexão do Banco:

```bash
# Usar Prisma Studio
npx prisma studio
```

### Testar no Cursor:

1. **Reinicie o Cursor** após configurar
2. **Abra o Command Palette** (`Cmd + Shift + P`)
3. **Procure por comandos do Supabase**
4. **Teste criando uma tabela ou consultando dados**

---

## 📊 8. INSTALAR CLIENTE SUPABASE (Opcional)

Se quiser usar o cliente Supabase diretamente no código:

```bash
npm install @supabase/supabase-js
```

Criar arquivo `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## ✅ Checklist Final

- [ ] Access Token obtido e adicionado ao `mcp-config.json`
- [ ] Anon Key e Service Role Key obtidas
- [ ] Arquivo `.env` criado com todas as credenciais
- [ ] MCP configurado no Cursor
- [ ] Variáveis adicionadas no Vercel
- [ ] GitHub conectado ao Supabase
- [ ] Banco de dados configurado (migrations executadas)
- [ ] Testado e funcionando

---

## 🔗 Links Rápidos

- **Supabase Dashboard:** https://supabase.com/dashboard/project/lwtjeqvnyytxlecxnkpw
- **API Settings:** https://supabase.com/dashboard/project/lwtjeqvnyytxlecxnkpw/settings/api
- **Access Tokens:** https://supabase.com/dashboard/account/tokens
- **SQL Editor:** https://supabase.com/dashboard/project/lwtjeqvnyytxlecxnkpw/sql/new

---

**Status:** ⚠️ Aguardando Access Token para completar a configuração

