# 🔑 Como Obter o Access Token do Supabase

## ⚠️ IMPORTANTE: Você precisa deste token para completar a configuração!

---

## 📋 Passo a Passo:

### 1. Acesse o Dashboard do Supabase

👉 **Link direto:** https://supabase.com/dashboard/account/tokens

Ou:
- Vá para: https://supabase.com/dashboard
- Clique no seu **perfil** (canto superior direito)
- Selecione **"Account Settings"**
- Clique em **"Access Tokens"** no menu lateral

### 2. Criar Novo Token

1. Clique no botão **"Generate new token"**
2. Dê um nome descritivo:
   - Exemplo: `MCP Server Token` ou `Cursor MCP`
3. Clique em **"Generate token"**

### 3. Copiar o Token

⚠️ **ATENÇÃO:** O token será mostrado apenas UMA VEZ!

- **Copie o token imediatamente**
- É uma string longa (ex: `sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### 4. Adicionar ao Arquivo de Configuração

1. Abra o arquivo `mcp-config.json` no projeto
2. Substitua `SEU_ACCESS_TOKEN_AQUI` pelo token que você copiou
3. Salve o arquivo

### 5. Configurar no Cursor

1. Copie o conteúdo completo do `mcp-config.json`
2. Localize o arquivo de configuração do Cursor:
   - macOS: `~/Library/Application Support/Cursor/User/globalStorage/mcp.json`
   - Ou crie em: `~/.cursor/mcp.json`
3. Cole o conteúdo (com o token já preenchido)
4. Reinicie o Cursor

---

## ✅ Após Obter o Token:

1. ✅ Adicione ao `mcp-config.json`
2. ✅ Configure no Cursor
3. ✅ Reinicie o Cursor
4. ✅ Teste a conexão

---

## 🆘 Problemas?

- **Token não aparece?** Verifique se você está na página correta (Account Settings → Access Tokens)
- **Token expirado?** Gere um novo token
- **Não consegue copiar?** O token aparece em um campo de texto, selecione e copie

---

**Link direto:** https://supabase.com/dashboard/account/tokens

