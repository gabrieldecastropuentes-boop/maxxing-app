/**
 * ═══════════════════════════════════════════════════════════════
 * API ENDPOINT: GET /api/purchases
 * Lista compras com filtros
 * ═══════════════════════════════════════════════════════════════
 */

import type { APIRoute } from 'astro';
import { prisma } from '../../lib/db';

export const prerender = false;

// ═══════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════

interface PurchaseFilters {
  status?: string;
  email?: string;
  gateway?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ═══════════════════════════════════════════════════════════════
// VALIDAÇÃO DE ACESSO (simples - melhore para produção)
// ═══════════════════════════════════════════════════════════════

function validateAccess(request: Request): boolean {
  const adminToken = import.meta.env.ADMIN_API_TOKEN;
  
  // Se não tiver token configurado, bloquear acesso
  if (!adminToken) {
    console.warn('[API/purchases] ⚠️ ADMIN_API_TOKEN não configurado');
    return false;
  }
  
  const authHeader = request.headers.get('authorization');
  const queryToken = new URL(request.url).searchParams.get('token');
  
  return authHeader === `Bearer ${adminToken}` || queryToken === adminToken;
}

// ═══════════════════════════════════════════════════════════════
// GET - Listar compras
// ═══════════════════════════════════════════════════════════════

export const GET: APIRoute = async ({ request }) => {
  try {
    // Validar acesso
    if (!validateAccess(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(request.url);
    const params = url.searchParams;

    // Extrair filtros
    const filters: PurchaseFilters = {
      status: params.get('status') || undefined,
      email: params.get('email') || undefined,
      gateway: params.get('gateway') || undefined,
      startDate: params.get('startDate') || undefined,
      endDate: params.get('endDate') || undefined,
      page: parseInt(params.get('page') || '1'),
      limit: Math.min(parseInt(params.get('limit') || '50'), 100),
    };

    // Construir where clause
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.email) {
      where.customerEmail = {
        contains: filters.email,
        mode: 'insensitive',
      };
    }

    if (filters.gateway) {
      where.gateway = filters.gateway;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(filters.endDate);
      }
    }

    // Buscar compras
    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: ((filters.page || 1) - 1) * (filters.limit || 50),
        take: filters.limit || 50,
        select: {
          id: true,
          externalId: true,
          gateway: true,
          status: true,
          paymentMethod: true,
          customerEmail: true,
          customerName: true,
          customerPhone: true,
          productName: true,
          planName: true,
          amount: true,
          currency: true,
          utmSource: true,
          utmCampaign: true,
          paidAt: true,
          refundedAt: true,
          createdAt: true,
        },
      }),
      prisma.purchase.count({ where }),
    ]);

    // Calcular estatísticas
    const stats = await prisma.purchase.groupBy({
      by: ['status'],
      where: filters.startDate || filters.endDate ? where : {},
      _count: { id: true },
      _sum: { amount: true },
    });

    const totalPages = Math.ceil(total / (filters.limit || 50));

    return new Response(JSON.stringify({
      success: true,
      data: purchases,
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 50,
        total,
        totalPages,
        hasMore: (filters.page || 1) < totalPages,
      },
      stats: stats.reduce((acc, s) => {
        acc[s.status] = {
          count: s._count.id,
          total: s._sum.amount || 0,
        };
        return acc;
      }, {} as Record<string, { count: number; total: number }>),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[API/purchases] Erro:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// GET por ID - Detalhes de uma compra
// ═══════════════════════════════════════════════════════════════

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validar acesso
    if (!validateAccess(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { id, action } = body;

    if (action === 'get') {
      const purchase = await prisma.purchase.findUnique({
        where: { id },
        include: {
          lead: true,
        },
      });

      if (!purchase) {
        return new Response(JSON.stringify({ error: 'Purchase not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({
        success: true,
        data: purchase,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ação de exportar CSV
    if (action === 'export') {
      const { status, startDate, endDate } = body;
      
      const where: any = {};
      if (status) where.status = status;
      if (startDate) where.createdAt = { gte: new Date(startDate) };
      if (endDate) {
        where.createdAt = { ...where.createdAt, lte: new Date(endDate) };
      }

      const purchases = await prisma.purchase.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      // Gerar CSV
      const headers = ['ID', 'Data', 'Status', 'Email', 'Nome', 'Produto', 'Valor', 'Gateway', 'Método'];
      const rows = purchases.map(p => [
        p.id,
        p.createdAt.toISOString(),
        p.status,
        p.customerEmail,
        p.customerName || '',
        p.productName || '',
        p.amount.toString(),
        p.gateway,
        p.paymentMethod || '',
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');

      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="purchases_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[API/purchases] Erro:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

