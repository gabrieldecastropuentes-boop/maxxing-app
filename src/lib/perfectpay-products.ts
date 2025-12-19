// ═══════════════════════════════════════════════════════════════
// PerfectPay Product Mapping
// Mapeamento fixo de códigos de produto para tipos de oferta
// ═══════════════════════════════════════════════════════════════

export const PERFECTPAY_PRODUCTS = {
  MAIN: {
    product_code: 'PPPBDPJI',
    affiliate_code: 'PPA23VRV',
  },
  BUMP_1: {
    product_code: 'PPPBDPJF',
    affiliate_code: 'PPA23VRR',
  },
  BUMP_2: {
    product_code: 'PPPBDPJH',
    affiliate_code: 'PPA23VRU',
  },
  BUMP_3: {
    product_code: 'PPPBDPJK',
    affiliate_code: 'PPA23VRX',
  },
  BUMP_4: {
    product_code: 'PPPBDPJO',
    affiliate_code: 'PPA23VS1',
  },
  BUMP_5: {
    product_code: 'PPPBDPJL',
    affiliate_code: 'PPA23VRY',
  },
} as const;

export type OfferType = 'MAIN' | 'BUMP_1' | 'BUMP_2' | 'BUMP_3' | 'BUMP_4' | 'BUMP_5' | 'UNKNOWN';

export interface ProductMapping {
  offer_type: OfferType;
  is_bump: boolean;
  bump_index: number | null;
  affiliate_code: string | null;
}

/**
 * Encontra o mapeamento de produto pelo product_code
 */
export function mapProductCode(productCode: string | null | undefined): ProductMapping {
  if (!productCode) {
    return {
      offer_type: 'UNKNOWN',
      is_bump: false,
      bump_index: null,
      affiliate_code: null,
    };
  }

  const normalizedCode = productCode.trim().toUpperCase();

  // Verificar MAIN
  if (normalizedCode === PERFECTPAY_PRODUCTS.MAIN.product_code) {
    return {
      offer_type: 'MAIN',
      is_bump: false,
      bump_index: null,
      affiliate_code: PERFECTPAY_PRODUCTS.MAIN.affiliate_code,
    };
  }

  // Verificar BUMPs
  for (let i = 1; i <= 5; i++) {
    const bumpKey = `BUMP_${i}` as keyof typeof PERFECTPAY_PRODUCTS;
    const bump = PERFECTPAY_PRODUCTS[bumpKey];
    if (normalizedCode === bump.product_code) {
      return {
        offer_type: bumpKey as OfferType,
        is_bump: true,
        bump_index: i,
        affiliate_code: bump.affiliate_code,
      };
    }
  }

  return {
    offer_type: 'UNKNOWN',
    is_bump: false,
    bump_index: null,
    affiliate_code: null,
  };
}

/**
 * Procura product_code recursivamente em objetos e arrays
 */
export function findProductCodeInPayload(payload: any): string | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  // Lista de product codes conhecidos para busca rápida
  const knownProductCodes = Object.values(PERFECTPAY_PRODUCTS).map(p => p.product_code);
  
  // Função recursiva para buscar
  function search(obj: any, visited = new Set()): string | null {
    // Prevenir loops infinitos
    if (visited.has(obj)) {
      return null;
    }
    visited.add(obj);

    if (Array.isArray(obj)) {
      for (const item of obj) {
        const result = search(item, visited);
        if (result) return result;
      }
      return null;
    }

    if (typeof obj === 'object' && obj !== null) {
      // Verificar propriedades diretas
      const directProps = ['product_code', 'productCode', 'product_id', 'productId', 'code', 'sku'];
      for (const prop of directProps) {
        if (obj[prop] && typeof obj[prop] === 'string') {
          const value = obj[prop].trim().toUpperCase();
          if (knownProductCodes.includes(value)) {
            return value;
          }
        }
      }

      // Buscar recursivamente em todas as propriedades
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const result = search(obj[key], visited);
          if (result) return result;
        }
      }
    }

    return null;
  }

  return search(payload);
}
