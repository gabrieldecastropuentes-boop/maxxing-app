# 📚 GUIA COMPLETO: Configuração de Integrações

## 🎯 O QUE FOI IMPLEMENTADO?

Foram adicionadas **3 integrações principais** no arquivo `src/layouts/Layout.astro`:

---

## 1️⃣ GOOGLE ANALYTICS 4 (GA4)

### 📖 O QUE É?
Sistema de análise do Google que rastreia:
- Quantas pessoas visitam seu site
- Quais páginas são mais acessadas
- De onde vêm os visitantes (Google, Facebook, direto, etc.)
- Eventos personalizados (cliques em botões, progresso no quiz, etc.)

### 🎯 PARA QUE SERVE?
- **Medir conversão**: Quantos usuários completam o quiz e chegam ao checkout
- **Otimizar campanhas**: Ver qual anúncio traz mais clientes
- **Entender comportamento**: Onde os usuários desistem no quiz
- **Funil de vendas**: Acompanhar Landing → Quiz → Paywall → Checkout

### 🔧 COMO CONFIGURAR:

#### Passo 1: Criar conta no Google Analytics
1. Acesse: https://analytics.google.com
2. Crie uma propriedade (se ainda não tiver)
3. Escolha "Web" como plataforma
4. Anote o **Measurement ID** (formato: `G-XXXXXXXXXX`)

#### Passo 2: Adicionar no código
Abra `src/layouts/Layout.astro` e encontre a linha 23:

```javascript
const GA_MEASUREMENT_ID = ""; // ← COLE SEU ID AQUI
```

Exemplo:
```javascript
const GA_MEASUREMENT_ID = "G-ABC123XYZ"; // ← Seu ID do GA4
```

#### Passo 3: Verificar se está funcionando
1. Salve o arquivo
2. Recarregue o site
3. Abra o DevTools (F12) → Console
4. Digite: `gtag` → Se aparecer uma função, está funcionando! ✅

### 📊 EVENTOS QUE SERÃO RASTREADOS AUTOMATICAMENTE:
- `PageView` - Cada página visitada
- `QuizStep` - Quando usuário avança no quiz
- `QuizBackClick` - Quando usuário volta no quiz
- `CheckoutClick` - Clique em botão de checkout
- `LeadSubmit` - Lead capturado
- `PurchaseSuccess` - Compra concluída

---

## 2️⃣ FACEBOOK PIXEL

### 📖 O QUE É?
Código do Facebook que rastreia visitantes para:
- Criar públicos personalizados para anúncios
- Medir conversões de campanhas no Facebook/Instagram
- Fazer remarketing (mostrar anúncios para quem visitou mas não comprou)
- Otimizar campanhas automaticamente

### 🎯 PARA QUE SERVE?
- **Remarketing**: Mostrar anúncios para quem visitou o site mas não comprou
- **Lookalike Audiences**: Encontrar pessoas similares aos seus compradores
- **Otimização de campanhas**: Facebook usa os dados para mostrar anúncios para quem tem mais chance de comprar
- **Conversões**: Medir quantas vendas vieram do Facebook

### 🔧 COMO CONFIGURAR:

#### Passo 1: Criar Pixel no Facebook
1. Acesse: https://business.facebook.com
2. Vá em **Eventos** → **Pixels**
3. Clique em **Criar Pixel**
4. Escolha "Usar código de integração"
5. Anote o **Pixel ID** (formato: números, ex: `123456789012345`)

#### Passo 2: Adicionar no código
Abra `src/layouts/Layout.astro` e encontre a linha 22:

```javascript
const FB_PIXEL_ID = ""; // ← COLE SEU PIXEL ID AQUI
```

Exemplo:
```javascript
const FB_PIXEL_ID = "123456789012345"; // ← Seu Pixel ID
```

#### Passo 3: Verificar se está funcionando
1. Instale a extensão **Facebook Pixel Helper** no Chrome
2. Acesse seu site
3. Clique no ícone da extensão
4. Se aparecer "Pixel encontrado", está funcionando! ✅

### 📊 EVENTOS QUE SERÃO ENVIADOS:
- `PageView` - Visualização de página
- `ViewContent` - Visualização de conteúdo
- `Lead` - Lead capturado
- `Purchase` - Compra concluída
- `QuizStep` - Progresso no quiz (customizado)

---

## 3️⃣ TAWK.TO (CHAT DE ATENDIMENTO)

### 📖 O QUE É?
Sistema de chat ao vivo gratuito que permite:
- Atender clientes em tempo real
- Ver quem está no site
- Responder dúvidas antes da compra
- Aumentar conversão (pessoas com dúvidas podem perguntar)

### 🎯 PARA QUE SERVE?
- **Suporte**: Clientes podem tirar dúvidas antes de comprar
- **Conversão**: Resolver objeções em tempo real
- **Proximidade**: Mostrar que há suporte disponível
- **Gratuito**: Plano free permite até 3 agentes

### 🔧 COMO CONFIGURAR:

#### Passo 1: Criar conta no Tawk.to
1. Acesse: https://www.tawk.to
2. Clique em **Sign Up Free**
3. Crie sua conta
4. Após criar, você verá um código de instalação

#### Passo 2: Encontrar seus IDs
No painel do Tawk.to, você verá algo assim:
```
https://embed.tawk.to/SEU_PROPERTY_ID/SEU_WIDGET_ID
```

Exemplo:
```
https://embed.tawk.to/507f1f77d9b2c17aec060e5c/default
```

- **Property ID**: `507f1f77d9b2c17aec060e5c`
- **Widget ID**: `default` (geralmente é "default")

#### Passo 3: Adicionar no código
Abra `src/layouts/Layout.astro` e encontre as linhas 24-25:

```javascript
const TAWK_PROPERTY_ID = ""; // ← COLE SEU PROPERTY ID AQUI
const TAWK_WIDGET_ID = ""; // ← COLE SEU WIDGET ID AQUI
```

Exemplo:
```javascript
const TAWK_PROPERTY_ID = "507f1f77d9b2c17aec060e5c";
const TAWK_WIDGET_ID = "default";
```

#### Passo 4: Verificar se está funcionando
1. Salve o arquivo
2. Recarregue o site
3. Aguarde 3 segundos (o chat carrega com delay para não atrapalhar performance)
4. Um ícone de chat deve aparecer no canto inferior direito! ✅

### ⚡ OTIMIZAÇÃO:
O chat carrega **após 3 segundos** para não atrapalhar a velocidade inicial do site. Isso é automático e não precisa configurar nada.

---

## 🔄 FUNÇÃO GLOBAL DE TRACKING

### 📖 O QUE É?
Uma função JavaScript global (`window.trackEvent`) que envia eventos para:
- Google Analytics 4
- Facebook Pixel
- Servidor (opcional, para analytics interno)

### 🎯 PARA QUE SERVE?
Unificar todos os eventos em uma única função, facilitando o código.

### 📝 COMO USAR NO CÓDIGO:

```javascript
// Exemplo: quando usuário clica em um botão
window.trackEvent('CheckoutClick', {
  button_text: 'Desbloquear Agora',
  page: 'paywall',
  user_id: 'user123'
});
```

### ✅ JÁ ESTÁ IMPLEMENTADO:
- Quiz avança → `QuizStep`
- Usuário volta → `QuizBackClick`
- Clique em checkout → `CheckoutClick`
- Lead capturado → `LeadSubmit`

---

## 📋 CHECKLIST DE CONFIGURAÇÃO

### Google Analytics 4
- [ ] Criar conta no GA4
- [ ] Copiar Measurement ID (G-XXXXXXXXXX)
- [ ] Colar em `GA_MEASUREMENT_ID`
- [ ] Verificar no console do navegador

### Facebook Pixel
- [ ] Criar Pixel no Facebook Business
- [ ] Copiar Pixel ID (números)
- [ ] Colar em `FB_PIXEL_ID`
- [ ] Verificar com Facebook Pixel Helper

### Tawk.to Chat
- [ ] Criar conta no Tawk.to
- [ ] Copiar Property ID e Widget ID
- [ ] Colar em `TAWK_PROPERTY_ID` e `TAWK_WIDGET_ID`
- [ ] Verificar se chat aparece após 3 segundos

---

## 🚨 IMPORTANTE: SITE_URL

Na linha 21, você também precisa atualizar:

```javascript
const SITE_URL = "https://glowmax.app"; // ← ALTERE PARA SEU DOMÍNIO REAL
```

Isso é usado para:
- Open Graph (preview quando compartilha no Facebook/WhatsApp)
- Twitter Card (preview quando compartilha no Twitter)
- Canonical URLs (SEO)

**Exemplo:**
```javascript
const SITE_URL = "https://meusite.com.br";
```

---

## 🎯 RESUMO RÁPIDO

| Integração | Onde Configurar | O Que Precisa |
|------------|----------------|---------------|
| **GA4** | Linha 23 do `Layout.astro` | Measurement ID (G-XXXXXXXXXX) |
| **Facebook Pixel** | Linha 22 do `Layout.astro` | Pixel ID (números) |
| **Tawk.to** | Linhas 24-25 do `Layout.astro` | Property ID + Widget ID |
| **SITE_URL** | Linha 21 do `Layout.astro` | Seu domínio (https://...) |

---

## ❓ DÚVIDAS FREQUENTES

### "Preciso de todas as integrações?"
**Não!** Você pode ativar apenas as que quiser. Se deixar vazio (`""`), a integração não será carregada.

### "O chat está atrapalhando o site?"
O chat carrega após 3 segundos automaticamente para não atrapalhar a performance.

### "Como sei se está funcionando?"
- **GA4**: Abra o console (F12) e digite `gtag` → Se aparecer função, está OK
- **Facebook**: Use a extensão "Facebook Pixel Helper"
- **Tawk.to**: O chat deve aparecer no canto inferior direito após 3 segundos

### "Posso testar sem ativar?"
Sim! Deixe os campos vazios (`""`) e o site funciona normalmente, só não terá tracking/chat.

---

## ✅ PRONTO PARA CONFIGURAR?

1. Abra: `src/layouts/Layout.astro`
2. Encontre as linhas 21-25
3. Cole seus IDs/credenciais
4. Salve o arquivo
5. Recarregue o site
6. Verifique se está funcionando

**Boa sorte! 🚀**

