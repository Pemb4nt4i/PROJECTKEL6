
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { DollarSign, Package, TrendingUp, AlertCircle, ShoppingBag } from 'lucide-react';
import { Product, Sale } from '../types';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales }) => {
  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
    const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
    const totalItems = products.reduce((sum, p) => sum + p.stock, 0);

    return [
      { label: 'Total Omzet', value: `Rp ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-100' },
      { label: 'Total Keuntungan', value: `Rp ${totalProfit.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
      { label: 'Total Stok', value: totalItems.toLocaleString(), icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
      { label: 'Stok Menipis', value: lowStockCount.toString(), icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
    ];
  }, [sales, products]);

  // Data for the chart (last 7 transactions)
  const chartData = useMemo(() => {
    return sales.slice(0, 7).reverse().map(s => ({
      time: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      total: s.total,
      profit: s.profit
    }));
  }, [sales]);

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Analisa Penjualan Terakhir</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `Rp ${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Omzet" />
                <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Untung" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            Peringatan Stok
          </h3>
          <div className="space-y-4">
            {products
              .filter(p => p.stock <= p.minStock)
              .slice(0, 6)
              .map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">{p.name}</span>
                    <span className="text-xs text-red-600">Sisa: {p.stock} {p.stock === 0 ? '(Habis)' : ''}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-gray-500">Min: {p.minStock}</span>
                  </div>
                </div>
              ))}
            {products.filter(p => p.stock <= p.minStock).length === 0 && (
              <div className="text-center py-8 text-gray-400 italic">
                Semua stok aman
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
