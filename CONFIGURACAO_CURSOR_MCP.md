# 🎯 Configurar MCP no Cursor

## ✅ Arquivo de Configuração Pronto

O arquivo `mcp-config.json` já está configurado com todas as credenciais!

---

## 📋 Passo a Passo:

### 1. Localizar o Arquivo de Configuração do Cursor

O Cursor precisa de um arquivo de configuração JSON. Ele pode estar em:

**Opção A (Recomendada):**
```
~/Library/Application Support/Cursor/User/globalStorage/mcp.json
```

**Opção B:**
```
~/.cursor/mcp.json
```

### 2. Copiar a Configuração

1. **Abra o arquivo `mcp-config.json`** no seu projeto
2. **Copie todo o conteúdo:**

```json
{
  "mcpServers": {
    "supabase": {
      "command": "supabase-mcp-server",
      "env": {
        "SUPABASE_PROJECT_REF": "lwtjeqvnyytxlecxnkpw",
        "SUPABASE_DB_PASSWORD": "jpGgiuFTUgOyPnQM",
        "SUPABASE_REGION": "us-east-1",
        "SUPABASE_ACCESS_TOKEN": "sbp_85d205a7eb454d896b8f4971ebd230d5ca52341f"
      }
    }
  }
}
```

### 3. Criar/Editar o Arquivo de Configuração do Cursor

**Via Terminal:**

```bash
# Criar diretório se não existir
mkdir -p ~/Library/Application\ Support/Cursor/User/globalStorage

# Copiar configuração
cp mcp-config.json ~/Library/Application\ Support/Cursor/User/globalStorage/mcp.json
```

**Ou manualmente:**

1. Abra o Finder
2. Pressione `Cmd + Shift + G`
3. Cole: `~/Library/Application Support/Cursor/User/globalStorage`
4. Crie o arquivo `mcp.json` (se não existir)
5. Cole o conteúdo do `mcp-config.json`

### 4. Reiniciar o Cursor

⚠️ **IMPORTANTE:** Reinicie o Cursor completamente para que a configuração seja carregada.

1. Feche todas as janelas do Cursor
2. Abra o Cursor novamente
3. Abra seu projeto

### 5. Verificar se Funcionou

1. **Abra o Command Palette:** `Cmd + Shift + P`
2. **Procure por:** "Supabase" ou "MCP"
3. **Você deve ver comandos do Supabase disponíveis**

---

## 🧪 Testar a Conexão

### Via Terminal:

```bash
# Verificar se o servidor está instalado
supabase-mcp-server --version

# Usar o inspector
supabase-mcp-inspector
```

### No Cursor:

1. Abra o Command Palette (`Cmd + Shift + P`)
2. Digite "Supabase"
3. Você deve ver opções como:
   - "Query Supabase database"
   - "Create table in Supabase"
   - etc.

---

## 🆘 Troubleshooting

### Problema: "MCP server not found"
**Solução:**
- Verifique se o `supabase-mcp-server` está no PATH
- Tente usar o caminho completo: `~/.local/bin/supabase-mcp-server`

### Problema: "Invalid credentials"
**Solução:**
- Verifique se o Access Token está correto
- Verifique se o Project Reference está correto
- Teste as credenciais no terminal primeiro

### Problema: "MCP not connecting"
**Solução:**
- Reinicie o Cursor completamente
- Verifique se o arquivo está no local correto
- Verifique os logs: `Help` → `Toggle Developer Tools` → `Console`

---

## ✅ Checklist

- [ ] Arquivo `mcp-config.json` criado no projeto
- [ ] Arquivo `mcp.json` criado no Cursor
- [ ] Configuração copiada corretamente
- [ ] Cursor reiniciado
- [ ] Comandos do Supabase aparecem no Command Palette
- [ ] Testado e funcionando

---

**Status:** ✅ Configuração pronta - Aguardando reiniciar o Cursor

