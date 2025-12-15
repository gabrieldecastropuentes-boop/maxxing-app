# 🚀 Guia de Configuração do MCP Server Supabase

## ✅ Status da Instalação

- ✅ **pipx:** Instalado
- ✅ **supabase-mcp-server:** Instalado (versão 0.4)
- ⚠️ **PATH:** Precisa ser atualizado (veja abaixo)

---

## 📋 1. CONFIGURAR O PATH (Opcional mas Recomendado)

Para usar o `supabase-mcp-server` diretamente no terminal:

```bash
# Adicionar ao seu ~/.zshrc (já foi feito automaticamente, mas pode precisar recarregar)
source ~/.zshrc

# Ou adicionar manualmente:
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

## 🔑 2. OBTER CREDENCIAIS DO SUPABASE

### Passo a Passo:

1. **Acesse o Supabase:**
   - Vá para: https://supabase.com
   - Faça login com sua conta (pode usar GitHub)

2. **Criar um novo projeto (se ainda não tiver):**
   - Clique em "New Project"
   - Preencha:
     - **Nome do projeto:** `maxxing-quiz` (ou outro nome)
     - **Database Password:** Anote esta senha! (você precisará dela)
     - **Region:** Escolha a região mais próxima (ex: `us-east-1`)
   - Clique em "Create new project"

3. **Obter as credenciais:**
   - No painel do projeto, vá em **Settings** → **API**
   - Você verá:
     - **Project URL:** `https://xxxxx.supabase.co`
     - **anon/public key:** `eyJhbGc...` (chave longa)
     - **service_role key:** `eyJhbGc...` (chave longa - mantenha segura!)

4. **Obter Project Reference:**
   - No painel, vá em **Settings** → **General**
   - Procure por **Reference ID** ou **Project ID**
   - Exemplo: `abcdefghijklmnop`

5. **Criar Access Token:**
   - Vá para: https://supabase.com/dashboard/account/tokens
   - Clique em "Generate new token"
   - Dê um nome (ex: "MCP Server Token")
   - Copie o token gerado (você só verá uma vez!)

---

## ⚙️ 3. CONFIGURAR VARIÁVEIS DE AMBIENTE

### Opção A: Arquivo `.env` (Recomendado para desenvolvimento)

Crie um arquivo `.env` na raiz do projeto:

```bash
# Supabase MCP Server Configuration
SUPABASE_PROJECT_REF=seu_project_ref_aqui
SUPABASE_DB_PASSWORD=sua_senha_do_banco
SUPABASE_REGION=us-east-1
SUPABASE_ACCESS_TOKEN=seu_access_token_aqui

# Supabase Client (para uso no código)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

**⚠️ IMPORTANTE:** Adicione `.env` ao `.gitignore` (já está lá!)

### Opção B: Variáveis de Ambiente do Sistema

```bash
# Adicionar ao ~/.zshrc
export SUPABASE_PROJECT_REF="seu_project_ref"
export SUPABASE_DB_PASSWORD="sua_senha"
export SUPABASE_REGION="us-east-1"
export SUPABASE_ACCESS_TOKEN="seu_token"

# Recarregar
source ~/.zshrc
```

---

## 🎯 4. CONFIGURAR MCP NO CURSOR

### Localização do Arquivo de Configuração:

O Cursor usa um arquivo de configuração JSON para MCP servers. O arquivo geralmente está em:

**macOS:**
```
~/Library/Application Support/Cursor/User/globalStorage/mcp.json
```

ou

```
~/.cursor/mcp.json
```

### Criar/Editar a Configuração:

1. **Abra o Cursor**
2. **Pressione:** `Cmd + Shift + P` (Command Palette)
3. **Digite:** "Preferences: Open User Settings (JSON)"
4. **Ou crie manualmente o arquivo:**

Crie o arquivo `~/.cursor/mcp.json` com o seguinte conteúdo:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "supabase-mcp-server",
      "env": {
        "SUPABASE_PROJECT_REF": "seu_project_ref_aqui",
        "SUPABASE_DB_PASSWORD": "sua_senha_do_banco",
        "SUPABASE_REGION": "us-east-1",
        "SUPABASE_ACCESS_TOKEN": "seu_access_token_aqui"
      }
    }
  }
}
```

**⚠️ Substitua os valores pelos seus dados reais!**

### Alternativa: Configuração via Settings do Cursor

1. Abra **Settings** (`Cmd + ,`)
2. Procure por "MCP" ou "Model Context Protocol"
3. Adicione a configuração do Supabase

---

## 🔗 5. INTEGRAR COM GITHUB

### Configurar GitHub Integration no Supabase:

1. **No painel do Supabase:**
   - Vá em **Settings** → **Integrations**
   - Clique em **GitHub**
   - Clique em **Authorize GitHub**
   - Autorize o acesso ao seu repositório

2. **Conectar o repositório:**
   - Selecione o repositório: `gabrieldecastropuentes-boop/maxxing-app`
   - Configure as opções de sincronização:
     - ✅ Sync branches
     - ✅ Auto-apply migrations
     - ✅ Preview branches

3. **Configurar GitHub Actions (Opcional):**
   - Crie `.github/workflows/supabase.yml` no seu projeto
   - Isso permite deploy automático via GitHub Actions

---

## 🚀 6. INTEGRAR COM VERCEL

### Configurar Variáveis no Vercel:

1. **No painel da Vercel:**
   - Vá para seu projeto → **Settings** → **Environment Variables**

2. **Adicione as variáveis do Supabase:**

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

**Onde obter DATABASE_URL:**
- No Supabase: **Settings** → **Database**
- Copie a **Connection string** (URI)
- Substitua `[PASSWORD]` pela senha do banco
- Substitua `[PROJECT_REF]` pelo Project Reference

### Instalar Supabase Client no Projeto:

```bash
npm install @supabase/supabase-js
```

### Usar no Código:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 🧪 7. TESTAR A CONFIGURAÇÃO

### Testar o MCP Server:

```bash
# Verificar se está instalado
supabase-mcp-server --version

# Ou usar o inspector
supabase-mcp-inspector
```

### Testar no Cursor:

1. **Reinicie o Cursor** após configurar
2. **Abra o Command Palette** (`Cmd + Shift + P`)
3. **Procure por comandos do Supabase**
4. **Teste criando uma tabela ou consultando dados**

---

## 📊 8. MIGRAR DO PRISMA PARA SUPABASE (Opcional)

Se quiser usar Supabase diretamente em vez de Prisma:

1. **Criar tabelas no Supabase:**
   - Use o SQL Editor no painel do Supabase
   - Execute os comandos SQL baseados no seu `schema.prisma`

2. **Ou usar Migrations:**
   ```bash
   # Instalar Supabase CLI
   npm install -g supabase
   
   # Inicializar
   supabase init
   
   # Linkar ao projeto
   supabase link --project-ref seu_project_ref
   
   # Criar migration
   supabase migration new nome_da_migration
   ```

---

## 🆘 TROUBLESHOOTING

### Problema: "Command not found: supabase-mcp-server"
**Solução:**
```bash
# Adicionar ao PATH
export PATH="$HOME/.local/bin:$PATH"
# Ou usar caminho completo
~/.local/bin/supabase-mcp-server
```

### Problema: "Invalid credentials"
**Solução:**
- Verifique se todas as variáveis de ambiente estão corretas
- Certifique-se de que o Access Token está válido
- Verifique se o Project Reference está correto

### Problema: "MCP server not connecting"
**Solução:**
- Reinicie o Cursor
- Verifique se o arquivo de configuração está no local correto
- Verifique os logs do Cursor: `Help` → `Toggle Developer Tools` → `Console`

---

## 📚 Recursos Úteis

- **Documentação Supabase:** https://supabase.com/docs
- **MCP Server Supabase:** https://github.com/alexander-zuev/supabase-mcp-server
- **Supabase CLI:** https://supabase.com/docs/guides/cli
- **Vercel + Supabase:** https://supabase.com/partners/vercel

---

## ✅ Checklist Final

- [ ] pipx instalado
- [ ] supabase-mcp-server instalado
- [ ] Projeto criado no Supabase
- [ ] Credenciais obtidas
- [ ] Variáveis de ambiente configuradas
- [ ] MCP configurado no Cursor
- [ ] GitHub integrado ao Supabase
- [ ] Vercel configurado com variáveis do Supabase
- [ ] Testado e funcionando

---

**Última atualização:** $(date)

