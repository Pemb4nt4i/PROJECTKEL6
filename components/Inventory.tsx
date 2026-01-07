
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Package, Tag, Hash, DollarSign, AlertTriangle } from 'lucide-react';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  onAdd: (product: Product) => void;
  onUpdate: (product: Product) => void;
  onDelete: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '',
    price: 0,
    costPrice: 0,
    stock: 0,
    minStock: 0
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: '',
        price: 0,
        costPrice: 0,
        stock: 0,
        minStock: 5
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdate({ ...editingProduct, ...formData } as Product);
    } else {
      onAdd({ ...formData, id: `PROD-${Date.now()}` } as Product);
    }
    closeModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Cari item inventory..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          <span>Tambah Barang</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Info Produk</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Harga Jual</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stok</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">{product.name}</span>
                      <span className="text-xs text-gray-400 font-mono">{product.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-600">Rp {product.price.toLocaleString()}</span>
                    <div className="text-[10px] text-gray-400">Modal: Rp {product.costPrice.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${product.stock <= product.minStock ? 'text-red-500' : 'text-gray-800'}`}>
                        {product.stock}
                      </span>
                      {product.stock <= product.minStock && (
                        <AlertTriangle size={14} className="text-amber-500" />
                      )}
                    </div>
                    <div className="text-[10px] text-gray-400 italic">Min: {product.minStock}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openModal(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => { if(confirm('Hapus produk ini?')) onDelete(product.id) }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                    Tidak ada barang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-lg">
                {editingProduct ? 'Ubah Data Barang' : 'Tambah Barang Baru'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center">
                  <Package size={14} className="mr-1" /> Nama Barang
                </label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center">
                    <Tag size={14} className="mr-1" /> Kategori
                  </label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center">
                    <Hash size={14} className="mr-1" /> Stok Saat Ini
                  </label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center">
                    <DollarSign size={14} className="mr-1" /> Harga Modal
                  </label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.costPrice}
                    onChange={e => setFormData({ ...formData, costPrice: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center text-blue-600">
                    <DollarSign size={14} className="mr-1" /> Harga Jual
                  </label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-600"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center text-red-500">
                  <AlertTriangle size={14} className="mr-1" /> Batas Stok Minimum (Peringatan)
                </label>
                <input 
                  required
                  type="number" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.minStock}
                  onChange={e => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="pt-4 flex space-x-3">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-lg border border-gray-200 font-bold text-gray-500 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg active:scale-95"
                >
                  {editingProduct ? 'Simpan Perubahan' : 'Tambah Barang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
