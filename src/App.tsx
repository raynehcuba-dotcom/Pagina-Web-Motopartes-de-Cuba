/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
import { FavoritesModal } from './components/FavoritesModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { MyOrdersModal } from './components/MyOrdersModal';
import { REPUESTOS } from './data/repuestos';
import { Repuesto, CartItem, MotorcycleModel, Currency, CompletedOrder } from './types';
import { ShoppingBag, Check, MessageCircle, Sparkles, Bell } from 'lucide-react';
import {
  subscribeToRepuestos,
  seedInitialCatalogIfEmpty,
  testConnection,
  auth,
  subscribeToUserOrders,
  getLocalOrders,
  loginWithGoogle,
} from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  CatalogNotification,
  getStoredNotifications,
  saveNotifications,
  dispatchRepuestoNotification,
} from './lib/notifications';

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

  // State: Wishlist (Favoritos) with localStorage persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('motopartes_cuba_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // State: Theme ('dark' | 'light') with localStorage persistence
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('motopartes_cuba_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Sync theme with DOM and localStorage
  useEffect(() => {
    try {
      localStorage.setItem('motopartes_cuba_theme', theme);
    } catch {
      // ignore
    }
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      showToast(next === 'light' ? 'Modo Claro activado' : 'Modo Oscuro activado');
      return next;
    });
  };

  // State: Notifications feed
  const [notifications, setNotifications] = useState<CatalogNotification[]>(() =>
    getStoredNotifications()
  );
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [newPartAlert, setNewPartAlert] = useState<{
    repuesto: Repuesto;
    title: string;
  } | null>(null);

  // Ref to track known catalog item IDs for push alert dispatch on new additions
  const knownRepuestoIdsRef = useRef<Set<string>>(new Set(REPUESTOS.map((r) => r.id)));
  const isInitialLoadDoneRef = useRef(false);

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

  // State: Historical Orders ('Mis Pedidos')
  const [orders, setOrders] = useState<CompletedOrder[]>(() => getLocalOrders());
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

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

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time Firestore synchronization & push notification triggers
  useEffect(() => {
    testConnection()
      .then((connected) => {
        setIsDbConnected(connected);
        if (connected) {
          seedInitialCatalogIfEmpty();
        }
      })
      .catch(() => setIsDbConnected(false));

    let unsubscribeOrders: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Subscribe to user's real-time orders in Firestore
        unsubscribeOrders = subscribeToUserOrders(user.uid, (remoteOrders) => {
          setOrders((prev) => {
            const local = getLocalOrders();
            const map = new Map<string, CompletedOrder>();
            remoteOrders.forEach((o) => map.set(o.id, o));
            local.forEach((o) => {
              if (!map.has(o.id)) map.set(o.id, o);
            });
            prev.forEach((o) => {
              if (!map.has(o.id)) map.set(o.id, o);
            });
            return Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        });
      }
    });

    const unsubscribeRepuestos = subscribeToRepuestos(
      (liveItems) => {
        if (liveItems && liveItems.length > 0) {
          setRepuestos(liveItems);
          setIsDbConnected(true);

          // Check if any brand-new repuestos were added since boot
          if (isInitialLoadDoneRef.current) {
            const newlyAdded = liveItems.filter(
              (item) => !knownRepuestoIdsRef.current.has(item.id)
            );

            if (newlyAdded.length > 0) {
              newlyAdded.forEach((newItem) => {
                const notif = dispatchRepuestoNotification(newItem);
                setNotifications((prev) => [notif, ...prev]);
                setNewPartAlert({
                  repuesto: newItem,
                  title: `¡Nuevo repuesto en almacén: ${newItem.name}!`,
                });
              });
            }
          } else {
            isInitialLoadDoneRef.current = true;
          }

          // Update set of known IDs
          liveItems.forEach((it) => knownRepuestoIdsRef.current.add(it.id));
        }
      },
      (err) => {
        console.warn('Real-time listener notice:', err);
      }
    );

    return () => {
      if (unsubscribeOrders) unsubscribeOrders();
      unsubscribeAuth();
      unsubscribeRepuestos();
    };
  }, []);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('motopartes_cuba_cart', JSON.stringify(cart));
    } catch {
      // ignore
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

  // Wishlist toggle handler
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((itemId) => itemId !== id) : [...prev, id];
      try {
        localStorage.setItem('motopartes_cuba_favorites', JSON.stringify(updated));
      } catch {
        // ignore
      }
      const item = repuestos.find((r) => r.id === id);
      if (exists) {
        showToast(`"${item?.name || 'Pieza'}" eliminada de Favoritos.`);
      } else {
        showToast(`"${item?.name || 'Pieza'}" guardada en Favoritos.`);
      }
      return updated;
    });
  };

  const handleClearFavorites = () => {
    setFavorites([]);
    try {
      localStorage.removeItem('motopartes_cuba_favorites');
    } catch {
      // ignore
    }
    showToast('Lista de favoritos vaciada.');
  };

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

  // Set of IDs in cart & favorites for fast lookup
  const cartItemIds = new Set(cart.map((it) => it.repuesto.id));
  const comparedItemIdsSet = new Set(comparedItemIds);
  const favoritesSet = new Set(favorites);
  const totalItemsCount = cart.reduce((sum, it) => sum + it.quantity, 0);

  // Resolved compared parts
  const comparedRepuestos = comparedItemIds
    .map((id) => repuestos.find((r) => r.id === id))
    .filter(Boolean) as Repuesto[];

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-[#f6f8fa] text-slate-800' : 'bg-[#0c0e12] text-slate-100'} flex flex-col font-sans selection:bg-red-600 selection:text-white transition-colors duration-200`}>
      
      {/* Top Navbar with Predictive Search, FCM Bell, Wishlist, Theme Toggle & DB Manager */}
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
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        notificationsCount={notifications.filter((n) => !n.read).length}
        onOpenNotifications={() => {
          setIsNotificationsOpen(true);
          // Mark as read
          const updated = notifications.map((n) => ({ ...n, read: true }));
          setNotifications(updated);
          saveNotifications(updated);
        }}
        ordersCount={orders.length}
        onOpenOrders={() => setIsOrdersModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onSelectModel={setActiveModel}
          onOpenWhatsAppGeneral={handleOpenWhatsAppGeneral}
          theme={theme}
        />

        {/* Model Showcase (MZ, GN125, AX100, Karpaty) */}
        <ModelShowcase
          activeModel={activeModel}
          onSelectModel={setActiveModel}
        />

        {/* Interactive Catalog with Filters, Search, Wishlist and Comparison */}
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
              favorites={favoritesSet}
              onToggleFavorite={handleToggleFavorite}
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
        theme={theme}
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
        isFavorite={selectedRepuesto ? favorites.includes(selectedRepuesto.id) : false}
        onToggleFavorite={handleToggleFavorite}
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

      {/* Wishlist 'Favoritos' Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        repuestos={repuestos}
        currency={currency}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        onClearFavorites={handleClearFavorites}
        onOpenDetails={handleOpenDetails}
        cartItemIds={cartItemIds}
      />

      {/* FCM & Push Notifications Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        repuestos={repuestos}
        onSelectRepuesto={handleOpenDetails}
        onClearNotifications={() => {
          setNotifications([]);
          saveNotifications([]);
        }}
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
        onOrderCompleted={(newOrder) => {
          setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
          showToast(`¡Pedido #${newOrder.id} guardado en 'Mis Pedidos'!`);
        }}
      />

      {/* Mis Pedidos Modal (Historical tracking & PDF voucher generator) */}
      <MyOrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        orders={orders}
        currentUser={currentUser}
        onLogin={async () => {
          try {
            await loginWithGoogle();
            showToast('Sesión iniciada con Google');
          } catch (err: any) {
            showToast(`Error al iniciar sesión: ${err.message}`);
          }
        }}
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
            className="flex items-center gap-2 rounded-full bg-red-600 text-white px-4 py-3 shadow-2xl font-mono text-xs font-bold hover:bg-red-500 active:scale-95 transition-all border border-red-400/40 shadow-red-600/30"
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

      {/* Live New Part Push Notification Alert Banner */}
      {newPartAlert && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 flex items-center gap-3 rounded-2xl border border-red-500/50 bg-[#161a24]/95 backdrop-blur-md p-4 text-xs font-mono text-white shadow-2xl animate-in slide-in-from-top-4 duration-300 max-w-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white font-bold">
            <Bell className="h-5 w-5 animate-bounce" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-red-400 font-bold uppercase">¡Nueva Pieza en Almacén!</div>
            <div className="font-semibold text-white truncate text-xs mt-0.5">{newPartAlert.repuesto.name}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              ${newPartAlert.repuesto.priceCUP.toLocaleString('es-ES')} CUP · {newPartAlert.repuesto.model}
            </div>
          </div>
          <div className="flex flex-col gap-1 shrink-0">
            <button
              onClick={() => {
                handleOpenDetails(newPartAlert.repuesto);
                setNewPartAlert(null);
              }}
              className="rounded-lg bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-red-500 transition-colors"
            >
              Ver Pieza
            </button>
            <button
              onClick={() => setNewPartAlert(null)}
              className="text-[10px] text-slate-400 hover:text-white text-center"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Standard Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-xl border border-white/20 bg-[#161921] px-4 py-3 text-xs font-mono text-white shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-black">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </div>
          <span className="truncate max-w-xs">{toastMessage}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-red-400 underline underline-offset-2 ml-2 hover:text-red-300 font-bold"
          >
            Ver Pedido
          </button>
        </div>
      )}

    </div>
  );
}
