
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  History, 
  Settings, 
  Menu, 
  X,
  LogOut,
  TrendingUp,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Inventory from './components/Inventory';
import SalesHistory from './components/SalesHistory';
import { Product, Sale, ViewType } from './types';

// Initial data for demo purposes
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Kopi Kapal Api 165g', category: 'Minuman', price: 15000, costPrice: 12000, stock: 50, minStock: 10 },
  { id: '2', name: 'Indomie Goreng Original', category: 'Makanan', price: 3000, costPrice: 2400, stock: 120, minStock: 20 },
  { id: '3', name: 'Minyak Goreng Filma 2L', category: 'Sembako', price: 38000, costPrice: 34000, stock: 5, minStock: 10 },
  { id: '4', name: 'Beras Pandan Wangi 5kg', category: 'Sembako', price: 75000, costPrice: 65000, stock: 15, minStock: 5 },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('finantech_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('finantech_sales');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('finantech_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('finantech_sales', JSON.stringify(sales));
  }, [sales]);

  const addSale = (sale: Sale) => {
    // Update products stock
    const updatedProducts = products.map(p => {
      const soldItem = sale.items.find(item => item.productId === p.id);
      if (soldItem) {
        return { ...p, stock: p.stock - soldItem.quantity };
      }
      return p;
    });
    setProducts(updatedProducts);
    setSales(prev => [sale, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const addProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const NavItem = ({ id, label, icon: Icon }: { id: ViewType; label: string; icon: any }) => (
    <button
      onClick={() => setActiveView(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        activeView === id 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      {isSidebarOpen && <span className="font-medium">{label}</span>}
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold">F</span>
            </div>
            {isSidebarOpen && <span className="text-white font-bold text-xl truncate">FinanTech</span>}
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="pos" label="Kasir (POS)" icon={ShoppingCart} />
          <NavItem id="inventory" label="Stok Barang" icon={Package} />
          <NavItem id="sales-history" label="Riwayat Penjualan" icon={History} />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700 hidden lg:block"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 capitalize">
              {activeView.replace('-', ' ')}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">Admin Utama</p>
              <p className="text-xs text-gray-500">Super User</p>
            </div>
            <img 
              src="https://picsum.photos/seed/admin/40/40" 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border-2 border-blue-100"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {activeView === 'dashboard' && (
            <Dashboard products={products} sales={sales} />
          )}
          {activeView === 'pos' && (
            <POS products={products} onCheckout={addSale} />
          )}
          {activeView === 'inventory' && (
            <Inventory 
              products={products} 
              onUpdate={updateProduct} 
              onAdd={addProduct} 
              onDelete={deleteProduct} 
            />
          )}
          {activeView === 'sales-history' && (
            <SalesHistory sales={sales} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
