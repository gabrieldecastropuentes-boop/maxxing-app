import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════

interface Purchase {
  id: string;
  externalId: string;
  gateway: string;
  status: string;
  paymentMethod: string | null;
  customerEmail: string;
  customerName: string | null;
  customerPhone: string | null;
  productName: string | null;
  planName: string | null;
  amount: number;
  currency: string;
  utmSource: string | null;
  utmCampaign: string | null;
  paidAt: string | null;
  refundedAt: string | null;
  createdAt: string;
}

interface Stats {
  [key: string]: {
    count: number;
    total: number;
  };
}

interface Filters {
  status: string;
  email: string;
  startDate: string;
  endDate: string;
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const statusColors: Record<string, string> = {
  approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  refused: 'bg-red-500/20 text-red-400 border-red-500/30',
  refunded: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  chargeback: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  canceled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const statusLabels: Record<string, string> = {
  approved: 'Aprovado',
  pending: 'Pendente',
  refused: 'Recusado',
  refunded: 'Reembolsado',
  chargeback: 'Chargeback',
  canceled: 'Cancelado',
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: LOGIN
// ═══════════════════════════════════════════════════════════════

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/purchases?token=${encodeURIComponent(token)}&limit=1`);
      if (res.ok) {
        localStorage.setItem('admin_token', token);
        onLogin(token);
      } else {
        setError('Token inválido');
      }
    } catch {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#12121a] border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin</h1>
            <p className="text-white/50 mt-2">Insira o token de acesso</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Token de acesso"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
            />

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !token.trim()}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: STAT CARD
// ═══════════════════════════════════════════════════════════════

function StatCard({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  return (
    <div className={`bg-[#12121a] border border-white/10 rounded-xl p-4 ${color}`}>
      <p className="text-white/50 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{count}</p>
      <p className="text-white/70 text-sm mt-1">{formatCurrency(total)}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: MODAL DE DETALHES
// ═══════════════════════════════════════════════════════════════

function PurchaseModal({ purchase, onClose }: { purchase: Purchase; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#12121a] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Detalhes da Compra</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm border ${statusColors[purchase.status] || statusColors.pending}`}>
              {statusLabels[purchase.status] || purchase.status}
            </span>
            <span className="text-white/50 text-sm">{formatDate(purchase.createdAt)}</span>
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-white/70 text-sm font-medium mb-2">Cliente</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-white/40">Email</p>
                <p className="text-white">{purchase.customerEmail}</p>
              </div>
              <div>
                <p className="text-white/40">Nome</p>
                <p className="text-white">{purchase.customerName || '-'}</p>
              </div>
              <div>
                <p className="text-white/40">Telefone</p>
                <p className="text-white">{purchase.customerPhone || '-'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-white/70 text-sm font-medium mb-2">Produto</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-white/40">Produto</p>
                <p className="text-white">{purchase.productName || '-'}</p>
              </div>
              <div>
                <p className="text-white/40">Plano</p>
                <p className="text-white">{purchase.planName || '-'}</p>
              </div>
              <div>
                <p className="text-white/40">Valor</p>
                <p className="text-white text-lg font-semibold">{formatCurrency(purchase.amount)}</p>
              </div>
              <div>
                <p className="text-white/40">Método</p>
                <p className="text-white">{purchase.paymentMethod || '-'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-white/70 text-sm font-medium mb-2">Tracking</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-white/40">Gateway</p>
                <p className="text-white">{purchase.gateway}</p>
              </div>
              <div>
                <p className="text-white/40">ID Externo</p>
                <p className="text-white font-mono text-xs">{purchase.externalId}</p>
              </div>
              <div>
                <p className="text-white/40">UTM Source</p>
                <p className="text-white">{purchase.utmSource || '-'}</p>
              </div>
              <div>
                <p className="text-white/40">UTM Campaign</p>
                <p className="text-white">{purchase.utmCampaign || '-'}</p>
              </div>
            </div>
          </div>

          {purchase.paidAt && (
            <div className="text-sm text-emerald-400">
              ✓ Pago em {formatDate(purchase.paidAt)}
            </div>
          )}

          {purchase.refundedAt && (
            <div className="text-sm text-purple-400">
              ↩ Reembolsado em {formatDate(purchase.refundedAt)}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export function PurchasesAdmin() {
  const [token, setToken] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [filters, setFilters] = useState<Filters>({
    status: '',
    email: '',
    startDate: '',
    endDate: '',
  });

  // Verificar token salvo
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Buscar dados
  const fetchPurchases = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        token,
        page: page.toString(),
        limit: '20',
      });

      if (filters.status) params.append('status', filters.status);
      if (filters.email) params.append('email', filters.email);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const res = await fetch(`/api/purchases?${params}`);
      
      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        setToken(null);
        return;
      }

      const data = await res.json();
      
      if (data.success) {
        setPurchases(data.data);
        setStats(data.stats);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Erro ao buscar compras:', error);
    } finally {
      setLoading(false);
    }
  }, [token, page, filters]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  // Export CSV
  const handleExport = async () => {
    if (!token) return;

    try {
      const res = await fetch(`/api/purchases?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'export',
          status: filters.status || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compras_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  // Tela de login
  if (!token) {
    return <LoginScreen onLogin={setToken} />;
  }

  const approvedStats = stats.approved || { count: 0, total: 0 };
  const pendingStats = stats.pending || { count: 0, total: 0 };
  const refundedStats = stats.refunded || { count: 0, total: 0 };
  const chargebackStats = stats.chargeback || { count: 0, total: 0 };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Compras</h1>
          <p className="text-white/50 mt-1">{total} compras encontradas</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm"
          >
            Exportar CSV
          </button>
          <button
            onClick={fetchPurchases}
            disabled={loading}
            className="px-4 py-2 bg-violet-600 rounded-lg text-white hover:bg-violet-700 transition-colors text-sm"
          >
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors text-sm"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Aprovadas" count={approvedStats.count} total={approvedStats.total} color="border-l-4 border-l-emerald-500" />
        <StatCard label="Pendentes" count={pendingStats.count} total={pendingStats.total} color="border-l-4 border-l-amber-500" />
        <StatCard label="Reembolsos" count={refundedStats.count} total={refundedStats.total} color="border-l-4 border-l-purple-500" />
        <StatCard label="Chargebacks" count={chargebackStats.count} total={chargebackStats.total} color="border-l-4 border-l-rose-500" />
      </div>

      {/* Filtros */}
      <div className="bg-[#12121a] border border-white/10 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <select
            value={filters.status}
            onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500/50"
          >
            <option value="">Todos os status</option>
            <option value="approved">Aprovado</option>
            <option value="pending">Pendente</option>
            <option value="refused">Recusado</option>
            <option value="refunded">Reembolsado</option>
            <option value="chargeback">Chargeback</option>
            <option value="canceled">Cancelado</option>
          </select>

          <input
            type="text"
            value={filters.email}
            onChange={(e) => { setFilters({ ...filters, email: e.target.value }); setPage(1); }}
            placeholder="Buscar por email"
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-violet-500/50"
          />

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => { setFilters({ ...filters, startDate: e.target.value }); setPage(1); }}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500/50"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => { setFilters({ ...filters, endDate: e.target.value }); setPage(1); }}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500/50"
          />

          <button
            onClick={() => { setFilters({ status: '', email: '', startDate: '', endDate: '' }); setPage(1); }}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/50 hover:text-white text-sm transition-colors"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-[#12121a] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">Produto</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-white/50 uppercase tracking-wider">Valor</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-white/50 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && purchases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-white/50">
                    Carregando...
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-white/50">
                    Nenhuma compra encontrada
                  </td>
                </tr>
              ) : (
                purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-white/70">{formatDate(purchase.createdAt)}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs border ${statusColors[purchase.status] || statusColors.pending}`}>
                        {statusLabels[purchase.status] || purchase.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-white">{purchase.customerName || '-'}</p>
                        <p className="text-xs text-white/50">{purchase.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-white/70">{purchase.productName || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-white">{formatCurrency(purchase.amount)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedPurchase(purchase)}
                        className="text-violet-400 hover:text-violet-300 text-sm"
                      >
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <p className="text-sm text-white/50">
              Página {page} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded text-white/70 hover:text-white disabled:opacity-50 text-sm"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded text-white/70 hover:text-white disabled:opacity-50 text-sm"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalhes */}
      <AnimatePresence>
        {selectedPurchase && (
          <PurchaseModal
            purchase={selectedPurchase}
            onClose={() => setSelectedPurchase(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

