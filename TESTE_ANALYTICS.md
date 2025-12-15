# 🧪 Script de Teste Rápido - Analytics

## ⚡ Teste Rápido (5 minutos)

### 1. Configurar IDs

Edite `src/layouts/Layout.astro` e adicione seus IDs:

```typescript
const FB_PIXEL_ID = "SEU_PIXEL_ID_AQUI";
const GA_MEASUREMENT_ID = "G-SEU_ID_AQUI";
```

### 2. Testar Localmente

1. **Abra o DevTools** (F12)
2. **Vá na aba Console**
3. **Complete o quiz** e observe os logs:
   ```
   [Track] quiz_started { gender: 'male' }
   [Track] quiz_step_completed { questionNumber: 1 }
   [Track] quiz_completed
   [Track] paywall_viewed { score: 75 }
   [Track] checkout_initiated { score: 75 }
   ```

### 3. Verificar no Navegador

#### Google Analytics:
- Abra: https://analytics.google.com/
- Vá em **Relatórios** → **Tempo real**
- Deve mostrar 1 usuário ativo

#### Facebook Pixel:
- Instale: [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
- Recarregue a página
- Deve mostrar "Pixel carregado" ✅

### 4. Testar Eventos de Conversão

Complete este fluxo e verifique cada evento:

```
1. Acessar site → PageView ✅
2. Selecionar gênero → quiz_started ✅
3. Responder perguntas → quiz_step_completed ✅
4. Completar quiz → quiz_completed ✅
5. Ver paywall → paywall_viewed ✅
6. Clicar em comprar → checkout_initiated ✅ (CONVERSÃO!)
```

---

## 📱 Testar no Celular

### Método 1: Console Remoto

1. **Android**: Conecte USB → `chrome://inspect`
2. **iOS**: Safari → Desenvolver → [Seu iPhone]

### Método 2: Testar em Produção

1. Acesse a URL de produção no celular
2. Complete o quiz
3. Verifique eventos no GA4/Facebook em tempo real

---

## ✅ Checklist Final

- [ ] IDs configurados em `Layout.astro`
- [ ] Eventos aparecem no console
- [ ] GA4 mostra eventos em tempo real
- [ ] Facebook Pixel Helper mostra "Pixel carregado"
- [ ] Testado no celular
- [ ] Conversões configuradas no GA4/Facebook

---

**🎯 Pronto!** Seu tracking está funcionando! 🚀

