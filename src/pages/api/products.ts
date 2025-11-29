/**
 * ═══════════════════════════════════════════════════════════════
 * API ENDPOINT: GET /api/products
 * Retorna recomendações de produtos personalizadas
 * ═══════════════════════════════════════════════════════════════
 */

import type { APIRoute } from 'astro';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  link: string;
  affiliate_link?: string;
  image?: string;
  fit_score: number;
  category: 'skincare' | 'haircare' | 'supplement' | 'grooming';
  tier: 'budget' | 'standard' | 'premium';
}

export interface ProductsResponse {
  products: Product[];
  recommended_routine: string[];
}

// Produtos mockados - substituir por banco de dados
const PRODUCTS_DB: Product[] = [
  {
    id: 'p1',
    title: 'Gel Esfoliante BHA 2%',
    description: 'Remove células mortas e desobstrui poros',
    price: 49.90,
    original_price: 79.90,
    link: '#',
    fit_score: 95,
    category: 'skincare',
    tier: 'budget'
  },
  {
    id: 'p2',
    title: 'Niacinamida 10% + Zinco 1%',
    description: 'Reduz oleosidade e minimiza poros',
    price: 89.90,
    link: '#',
    fit_score: 100,
    category: 'skincare',
    tier: 'standard'
  },
  {
    id: 'p3',
    title: 'CeraVe Hidratante Facial',
    description: 'Hidratação profunda com ceramidas',
    price: 79.90,
    link: '#',
    fit_score: 92,
    category: 'skincare',
    tier: 'standard'
  },
  {
    id: 'p4',
    title: 'Protetor Solar FPS 50',
    description: 'Proteção UVA/UVB sem oleosidade',
    price: 59.90,
    link: '#',
    fit_score: 98,
    category: 'skincare',
    tier: 'budget'
  },
  {
    id: 'p5',
    title: 'Retinol 0.5%',
    description: 'Anti-aging e renovação celular',
    price: 149.90,
    link: '#',
    fit_score: 85,
    category: 'skincare',
    tier: 'premium'
  },
  {
    id: 'p6',
    title: 'Minoxidil 5%',
    description: 'Estimula crescimento capilar',
    price: 89.90,
    link: '#',
    fit_score: 88,
    category: 'haircare',
    tier: 'standard'
  },
  {
    id: 'p7',
    title: 'Biotina 10000mcg',
    description: 'Fortalece cabelo, pele e unhas',
    price: 69.90,
    link: '#',
    fit_score: 90,
    category: 'supplement',
    tier: 'budget'
  },
  {
    id: 'p8',
    title: 'Aparador de Barba Profissional',
    description: 'Corte preciso com múltiplos pentes',
    price: 199.90,
    original_price: 299.90,
    link: '#',
    fit_score: 94,
    category: 'grooming',
    tier: 'premium'
  }
];

export const GET: APIRoute = async ({ url }) => {
  try {
    const user_id = url.searchParams.get('user_id');
    const category = url.searchParams.get('category');
    const tier = url.searchParams.get('tier');

    let products = [...PRODUCTS_DB];

    // Filtrar por categoria se especificado
    if (category) {
      products = products.filter(p => p.category === category);
    }

    // Filtrar por tier se especificado
    if (tier) {
      products = products.filter(p => p.tier === tier);
    }

    // Ordenar por fit_score
    products.sort((a, b) => b.fit_score - a.fit_score);

    // TODO: Personalizar baseado no user_id e resultados do quiz

    const recommended_routine = [
      '1. Lavar o rosto com água morna',
      '2. Aplicar BHA/Esfoliante (noite)',
      '3. Aplicar Niacinamida',
      '4. Hidratar com CeraVe',
      '5. Protetor Solar (manhã)',
    ];

    console.log('[API/products] Produtos retornados:', products.length);

    return new Response(JSON.stringify({
      products,
      recommended_routine
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[API/products] Erro:', error);
    return new Response(JSON.stringify({
      products: [],
      recommended_routine: [],
      error: 'Erro ao buscar produtos'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

