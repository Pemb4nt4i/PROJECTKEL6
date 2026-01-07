
import React, { useState } from 'react';
// Added History to the imports to resolve conflict with the global DOM History type
import { Search, FileSpreadsheet, ChevronDown, ChevronUp, Clock, User, ArrowRight, History } from 'lucide-react';
import { Sale } from '../types';

interface SalesHistoryProps {
  sales: Sale[];
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ sales }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredSales = sales.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportToCSV = () => {
    // Basic CSV Export logic for report
    const headers = ['ID Transaksi', 'Waktu', 'Total Tagihan', 'Keuntungan', 'Item'];
    const rows = filteredSales.map(s => [
      s.id,
      new Date(s.timestamp).toLocaleString(),
      s.total,
      s.profit,
      s.items.map(i => `${i.name} (${i.quantity}x)`).join('; ')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_penjualan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Cari ID transaksi atau barang..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <FileSpreadsheet size={20} />
          <span>Ekspor Laporan (Excel/CSV)</span>
        </button>
      </div>

      <div className="space-y-4">
        {filteredSales.map(sale => (
          <div key={sale.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div 
              className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedId(expandedId === sale.id ? null : sale.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="text-gray-500" size={20} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-800">{sale.id}</span>
                    <span className="text-xs text-gray-400">• {new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-gray-500">{new Date(sale.timestamp).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-8 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Total</p>
                  <p className="font-black text-gray-900">Rp {sale.total.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Profit</p>
                  <p className="font-bold text-green-600">Rp {sale.profit.toLocaleString()}</p>
                </div>
                {expandedId === sale.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </div>
            </div>

            {expandedId === sale.id && (
              <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center">
                  <ArrowRight size={14} className="mr-1" /> Detail Item Belanja
                </h4>
                <div className="space-y-2">
                  {sale.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center rounded">
                          {item.quantity}
                        </span>
                        <span className="font-medium text-gray-700 text-sm">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400">@ Rp {item.price.toLocaleString()}</span>
                        <p className="font-bold text-gray-800 text-sm">Rp {item.subtotal.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-400 italic">
                  <span>Dilayani oleh: Admin Utama</span>
                  <span>ID Kasir: CS-001</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredSales.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
            {/* History icon component from lucide-react */}
            <History size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">Belum ada riwayat transaksi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesHistory;
