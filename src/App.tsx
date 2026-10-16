/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ModelShowcase } from './components/ModelShowcase';
import { Catalog } from './components/Catalog';
import { ProductModal } from './components/ProductModal';
import { ProductCompareModal } from './components/ProductCompareModal';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import { CartDrawer } from './components/CartDrawer';
import { CustomOrderSection } from './components/CustomOrderSection';
import { WarehouseDeliveryInfo } from './components/WarehouseDeliveryInfo';
import { Footer } from './components/Footer';
import { InventoryManagerModal } from './components/InventoryManagerModal';
import { REPUESTOS } from './data/repuestos';
import { Repuesto, CartItem, MotorcycleModel, Currency } from './types';
import { ShoppingBag, Check, MessageCircle, Scale } from 'lucide-react';
import {
  subscribeToRepuestos,
  seedInitialCatalogIfEmpty,
  testConnection,
  auth,
} from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  // State: Repuestos catalog (initialized with authentic data, updated live from Firestore)
  const [repuestos, setRepuestos] = useState<Repuesto[]>(REPUESTOS);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // State: Cart with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('motopartes_cuba_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // State: Active motorcycle model filter
  const [activeModel, setActiveModel] = useState<MotorcycleModel>('all');

  // State: Currency display ('CUP' or 'USD')
  const [currency, setCurrency] = useState<Currency>(() => {
    try {
      return (localStorage.getItem('motopartes_cuba_currency') as Currency) || 'CUP';
    } catch {
      return 'CUP';
    }
  });

  // Exchange rate (1 USD = 340 CUP)
  const exchangeRate = 340;

  // State: Drawers and modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedRepuesto, setSelectedRepuesto] = useState<Repuesto | null>(null);

  // State: Compare up to 3 parts
  const [comparedItemIds, setComparedItemIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // State: Recently viewed / searched product IDs (max 5)
  const [recentProductIds, setRecentProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('motopartes_cuba_recent_viewed');
      return saved ? JSON.parse(saved) : ['mz-cilindro-250', 'gn-kit-arrastre', 'ax-carburador-mikuni'];
    } catch {
      return ['mz-cilindro-250', 'gn-kit-arrastre', 'ax-carburador-mikuni'];
    }
  });

  // Real-time Firestore synchronization & boot connection test
  useEffect(() => {
    testConnection()
      .then((connected) => {
        setIsDbConnected(connected);
        if (connected) {
          seedInitialCatalogIfEmpty();
        }
      })
      .catch(() => setIsDbConnected(false));

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    const unsubscribeRepuestos = subscribeToRepuestos(
      (liveItems) => {
        if (liveItems && liveItems.length > 0) {
          setRepuestos(liveItems);
          setIsDbConnected(true);
        }
      },
      (err) => {
        console.warn('Real-time listener notice:', err);
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeRepuestos();
    };
  }, []);

  // Track product view (add to top of recent, keep max 5 unique)
  const trackProductView = (id: string) => {
    setRecentProductIds((prev) => {
      const updated = [id, ...prev.filter((itemId) => itemId !== id)].slice(0, 5);
      try {
        localStorage.setItem('motopartes_cuba_recent_viewed', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleOpenDetails = (repuesto: Repuesto) => {
    trackProductView(repuesto.id);
    setSelectedRepuesto(repuesto);
  };

  const handleClearRecent = () => {
    setRecentProductIds([]);
    try {
      localStorage.removeItem('motopartes_cuba_recent_viewed');
    } catch {
      // ignore
    }
  };

  // Compare toggle handler (max 3)
  const handleToggleCompare = (id: string) => {
    setComparedItemIds((prev) => {
      if (prev.includes(id)) {
        showToast('Pieza removida del comparador.');
        return prev.filter((itemId) => itemId !== id);
      }
      if (prev.length >= 3) {
        showToast('Máximo 3 repuestos para comparar. Quita una pieza primero.');
        return prev;
      }
      const item = repuestos.find((r) => r.id === id);
      showToast(`"${item?.name || 'Pieza'}" añadida al comparador (${prev.length + 1}/3).`);
      return [...prev, id];
    });
  };

  const handleRemoveCompareItem = (id: string) => {
    setComparedItemIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  const handleClearCompare = () => {
    setComparedItemIds([]);
    showToast('Comparador limpiado.');
  };

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('motopartes_cuba_cart', JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  // Persist currency
  useEffect(() => {
    try {
      localStorage.setItem('motopartes_cuba_currency', currency);
    } catch {
      // ignore
    }
  }, [currency]);

  // Toast trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Add to cart
  const handleAddToCart = (repuesto: Repuesto, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.repuesto.id === repuesto.id);
      if (existing) {
        return prev.map((item) =>
          item.repuesto.id === repuesto.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { repuesto, quantity }];
    });
    showToast(`Se agregó "${repuesto.name}" al pedido.`);
  };

  // Update quantity in cart
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.repuesto.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove single item
  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.repuesto.id !== id));
  };

  // Clear all
  const handleClearCart = () => {
    setCart([]);
  };

  // Toggle currency
  const handleToggleCurrency = () => {
    setCurrency((prev) => (prev === 'CUP' ? 'USD' : 'CUP'));
  };

  // General WhatsApp contact
  const handleOpenWhatsAppGeneral = () => {
    const text = encodeURIComponent(
      `🏍️ *HOLA MOTOPARTES DE CUBA S.R.L*\n\n` +
      `Hola, me comunico a través de su página web para consultar información sobre repuestos disponibles para mi moto en La Habana o envíos a provincia. Gracias.`
    );
    window.open(`https://wa.me/5350000000?text=${text}`, '_blank');
  };

  // Set of IDs in cart for fast lookup
  const cartItemIds = new Set(cart.map((it) => it.repuesto.id));
  const comparedItemIdsSet = new Set(comparedItemIds);
  const totalItemsCount = cart.reduce((sum, it) => sum + it.quantity, 0);

  // Resolved compared parts
  const comparedRepuestos = comparedItemIds
    .map((id) => repuestos.find((r) => r.id === id))
    .filter(Boolean) as Repuesto[];

  return (
    <div className="min-h-screen bg-[#0c0e12] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Top Navbar with Predictive Real-Time Search & DB Manager */}
      <Navbar
        cartCount={totalItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        currency={currency}
        onToggleCurrency={handleToggleCurrency}
        exchangeRate={exchangeRate}
        repuestos={repuestos}
        activeModel={activeModel}
        onSelectRepuesto={handleOpenDetails}
        onOpenInventoryManager={() => setIsInventoryModalOpen(true)}
        isDbConnected={isDbConnected}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onSelectModel={setActiveModel}
          onOpenWhatsAppGeneral={handleOpenWhatsAppGeneral}
        />

        {/* Model Showcase (MZ, GN125, AX100, Karpaty) */}
        <ModelShowcase
          activeModel={activeModel}
          onSelectModel={setActiveModel}
        />

        {/* Interactive Catalog with Filters, Search and Comparison */}
        {(() => {
          const recentRepuestos = recentProductIds
            .map((id) => repuestos.find((r) => r.id === id))
            .filter(Boolean) as Repuesto[];

          return (
            <Catalog
              repuestos={repuestos}
              activeModel={activeModel}
              onSelectModel={setActiveModel}
              currency={currency}
              onOpenDetails={handleOpenDetails}
              onAddToCart={handleAddToCart}
              cartItemIds={cartItemIds}
              recentRepuestos={recentRepuestos}
              onClearRecent={handleClearRecent}
              onToggleCompare={handleToggleCompare}
              comparedItemIds={comparedItemIdsSet}
            />
          );
        })()}

        {/* Custom Out-of-Stock and Special Import Requests */}
        <CustomOrderSection />

        {/* Warehouse, Delivery in Havana & Provinces, Payment Methods */}
        <WarehouseDeliveryInfo />
      </main>

      {/* Footer */}
      <Footer
        onSelectModel={setActiveModel}
        onOpenWhatsAppGeneral={handleOpenWhatsAppGeneral}
        onOpenInventoryManager={() => setIsInventoryModalOpen(true)}
      />

      {/* Product Detail Modal */}
      <ProductModal
        repuesto={selectedRepuesto}
        onClose={() => setSelectedRepuesto(null)}
        currency={currency}
        onAddToCart={handleAddToCart}
        isInCart={selectedRepuesto ? cartItemIds.has(selectedRepuesto.id) : false}
        onToggleCompare={handleToggleCompare}
        isCompared={selectedRepuesto ? comparedItemIds.includes(selectedRepuesto.id) : false}
      />

      {/* Side-by-side Product Comparison Modal (up to 3 items) */}
      <ProductCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        comparedRepuestos={comparedRepuestos}
        currency={currency}
        onAddToCart={handleAddToCart}
        onRemoveCompareItem={handleRemoveCompareItem}
        onClearCompare={handleClearCompare}
        cartItemIds={cartItemIds}
      />

      {/* Real-time Inventory & Catalog Database Management Modal */}
      <InventoryManagerModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        repuestos={repuestos}
        currentUser={currentUser}
        onToast={showToast}
      />

      {/* Sticky Bottom Compare Bar when items are selected */}
      <CompareFloatingBar
        comparedRepuestos={comparedRepuestos}
        onOpenModal={() => setIsCompareModalOpen(true)}
        onRemoveItem={handleRemoveCompareItem}
        onClear={handleClearCompare}
      />

      {/* Cart & WhatsApp Order Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onToggleCurrency={handleToggleCurrency}
        exchangeRate={exchangeRate}
      />

      {/* Floating Quick WhatsApp and Cart Buttons */}
      <aside
        aria-label="Contacto flotante"
        className={`fixed ${comparedRepuestos.length > 0 ? 'bottom-24 sm:bottom-6' : 'bottom-6'} right-4 sm:right-6 z-40 flex flex-col gap-3 transition-all duration-300`}
      >
        {totalItemsCount > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 rounded-full bg-amber-500 text-black px-4 py-3 shadow-2xl font-mono text-xs font-bold hover:bg-amber-400 active:scale-95 transition-all border border-amber-400/40"
            aria-label="Ver pedido actual"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Ver Pedido ({totalItemsCount})</span>
          </button>
        )}

        <button
          onClick={handleOpenWhatsAppGeneral}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-black shadow-2xl hover:bg-emerald-400 active:scale-95 transition-all border border-emerald-400/40"
          title="Consultar por WhatsApp"
          aria-label="Abrir WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </aside>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-xl border border-white/20 bg-[#161921] px-4 py-3 text-xs font-mono text-white shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-black">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </div>
          <span className="truncate max-w-xs">{toastMessage}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-amber-400 underline underline-offset-2 ml-2 hover:text-amber-300 font-bold"
          >
            Ver Pedido
          </button>
        </div>
      )}

    </div>
  );
}
