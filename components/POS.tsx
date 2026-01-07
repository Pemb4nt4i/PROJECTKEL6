
import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, CheckCircle } from 'lucide-react';
import { Product, Sale, SaleItem } from '../types';

interface POSProps {
  products: Product[];
  onCheckout: (sale: Sale) => void;
}

const POS: React.FC<POSProps> = ({ products, onCheckout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price } 
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        quantity: 1,
        price: product.price,
        subtotal: product.price
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const product = products.find(p => p.id === productId);
        const newQty = Math.max(1, item.quantity + delta);
        if (product && newQty > product.stock) return item;
        return { ...item, quantity: newQty, subtotal: newQty * item.price };
      }
      return item;
    }));
  };

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.subtotal, 0), [cart]);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const profit = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      const cost = product ? product.costPrice : item.price * 0.8; // Fallback
      return sum + (item.price - cost) * item.quantity;
    }, 0);

    const newSale: Sale = {
      id: `TRX-${Date.now()}`,
      timestamp: Date.now(),
      items: [...cart],
      total,
      profit
    };

    onCheckout(newSale);
    setCart([]);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="flex h-full gap-6">
      {/* Product Selection */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Cari nama barang atau kategori..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 content-start">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              disabled={product.stock <= 0}
              onClick={() => addToCart(product)}
              className={`p-4 rounded-xl border text-left transition-all ${
                product.stock <= 0 
                ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed' 
                : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-md active:scale-95'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">
                  {product.category}
                </span>
                <span className={`text-xs font-medium ${product.stock <= product.minStock ? 'text-red-500' : 'text-gray-500'}`}>
                  Stok: {product.stock}
                </span>
              </div>
              <h4 className="font-bold text-gray-800 line-clamp-1">{product.name}</h4>
              <p className="text-blue-600 font-bold mt-1">Rp {product.price.toLocaleString()}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart/Checkout */}
      <div className="w-96 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="text-gray-400" size={20} />
            <h3 className="font-bold text-gray-800 text-lg">Keranjang</h3>
          </div>
          <span className="bg-blue-100 text-blue-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
            {cart.length} Item
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 py-20">
              <ShoppingCart size={48} strokeWidth={1.5} />
              <p>Belum ada item dipilih</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="flex flex-col p-3 bg-gray-50 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800 text-sm line-clamp-1 flex-1 pr-2">{item.name}</span>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3 bg-white rounded-lg border border-gray-200 p-1">
                    <button 
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="p-1 hover:bg-gray-100 rounded text-gray-500"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="p-1 hover:bg-gray-100 rounded text-gray-500"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-blue-600 text-sm">Rp {item.subtotal.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-4 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Total Tagihan</span>
            <span className="text-2xl font-black text-gray-900">Rp {total.toLocaleString()}</span>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
              cart.length === 0 
                ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
            }`}
          >
            Bayar Sekarang
          </button>
          
          {isSuccess && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl animate-bounce">
              <CheckCircle size={20} />
              <span className="font-bold">Transaksi Berhasil!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default POS;
