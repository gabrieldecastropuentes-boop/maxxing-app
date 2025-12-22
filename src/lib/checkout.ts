// ═══════════════════════════════════════════════════════════════
// Configuração Centralizada de Checkout e Preços
// ═══════════════════════════════════════════════════════════════

/**
 * URL do checkout PerfectPay
 * Pode ser sobrescrita via variável de ambiente PUBLIC_PERFECTPAY_CHECKOUT_URL
 */
export const PERFECTPAY_CHECKOUT_URL =
  import.meta.env.PUBLIC_PERFECTPAY_CHECKOUT_URL ||
  'https://go.perfectpay.com.br/PPU38CQ4H5K';

/**
 * Preço principal exibido na Paywall
 */
export const PRICE_MAIN = 'R$29,90';

/**
 * Texto formatado do preço para exibição
 */
export const PRICE_TEXT = PRICE_MAIN;
