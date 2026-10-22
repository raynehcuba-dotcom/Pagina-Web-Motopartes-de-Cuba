import React, { useState } from 'react';
import { Repuesto } from '../types';
import {
  X,
  Database,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  RefreshCw,
  LogIn,
  LogOut,
  AlertCircle,
  Package,
  Wrench,
  BarChart3,
} from 'lucide-react';
import {
  updateRepuestoStock,
  updateRepuestoPrice,
  saveRepuesto,
  deleteRepuestoFromDb,
  loginWithGoogle,
  logoutUser,
  isUserAdmin,
} from '../lib/firebase';
import { User } from 'firebase/auth';
import { CatalogStatisticsPanel } from './CatalogStatisticsPanel';

interface InventoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  repuestos: Repuesto[];
  currentUser: User | null;
  onToast: (msg: string) => void;
}

export const InventoryManagerModal: React.FC<InventoryManagerModalProps> = ({
  isOpen,
  onClose,
  repuestos,
  currentUser,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'stats'>('inventory');
  const [filterModel, setFilterModel] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<'disponible' | 'bajo_stock' | 'encargo'>('disponible');
  const [editStockCount, setEditStockCount] = useState<number>(10);
  const [editPriceCUP, setEditPriceCUP] = useState<number>(0);
  const [editPriceUSD, setEditPriceUSD] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // New repuesto state
  const [newPart, setNewPart] = useState<Partial<Repuesto>>({
    name: '',
    code: '',
    model: 'MZ',
    modelLabel: 'MZ ETZ 250 / TS 250',
    category: 'motor',
    categoryLabel: 'Motor y Conjunto Cilindro',
    priceCUP: 12000,
    priceUSD: 35,
    stock: 'disponible',
    stockCount: 15,
    origin: 'Alemania / Importación',
    description: '',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    compatibility: ['MZ ETZ 250'],
    specs: { Material: 'Acero templado' },
    isFeatured: false,
  });

  if (!isOpen) return null;

  const isAdmin = isUserAdmin(currentUser);

  const filtered = repuestos.filter((r) => {
    if (filterModel !== 'all' && r.model !== filterModel) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        r.model.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStartEdit = (rep: Repuesto) => {
    setEditingId(rep.id);
    setEditStock(rep.stock);
    setEditStockCount(rep.stockCount);
    setEditPriceCUP(rep.priceCUP);
    setEditPriceUSD(rep.priceUSD);
  };

  const handleSaveStockAndPrice = async (id: string) => {
    setIsSaving(true);
    try {
      await updateRepuestoStock(id, editStock, editStockCount);
      await updateRepuestoPrice(id, editPriceCUP, editPriceUSD);
      onToast('Inventario y precio actualizados en Firestore en tiempo real.');
      setEditingId(null);
    } catch (err: any) {
      onToast(`Error al actualizar: ${err.message || 'Verifica permisos de administrador'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Seguro que deseas eliminar "${name}" de la base de datos?`)) return;
    try {
      await deleteRepuestoFromDb(id);
      onToast(`Pieza "${name}" eliminada de Firestore.`);
    } catch (err: any) {
      onToast(`Error al eliminar: ${err.message}`);
    }
  };

  const handleCreatePart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPart.name || !newPart.code) {
      onToast('Completa el nombre y código de la pieza.');
      return;
    }

    const id = newPart.code.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const completeItem: Repuesto = {
      id,
      name: newPart.name || 'Repuesto',
      code: newPart.code || 'COD-00',
      model: newPart.model as any,
      modelLabel: newPart.modelLabel || `${newPart.model} Especial`,
      category: newPart.category as any,
      categoryLabel: newPart.categoryLabel || 'Repuestos',
      priceCUP: Number(newPart.priceCUP) || 0,
      priceUSD: Number(newPart.priceUSD) || 0,
      stock: newPart.stock as any,
      stockCount: Number(newPart.stockCount) || 1,
      origin: newPart.origin || 'Importación',
      description: newPart.description || 'Pieza para motocicleta con garantía de ajuste.',
      image: newPart.image || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
      compatibility: newPart.compatibility || [newPart.model as string],
      specs: newPart.specs || { Tipo: 'Estándar' },
      isFeatured: !!newPart.isFeatured,
    };

    setIsSaving(true);
    try {
      await saveRepuesto(completeItem);
      onToast(`¡Pieza "${completeItem.name}" agregada a la base de datos!`);
      setShowAddForm(false);
      setNewPart({
        name: '',
        code: '',
        model: 'MZ',
        modelLabel: 'MZ ETZ 250 / TS 250',
        category: 'motor',
        categoryLabel: 'Motor y Conjunto Cilindro',
        priceCUP: 12000,
        priceUSD: 35,
        stock: 'disponible',
        stockCount: 15,
        origin: 'Alemania / Importación',
        description: '',
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
        compatibility: ['MZ ETZ 250'],
        specs: { Material: 'Acero templado' },
        isFeatured: false,
      });
    } catch (err: any) {
      onToast(`Error al guardar: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-5xl rounded-2xl border border-white/15 bg-[#12151d] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#0d0f14] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-condensed text-2xl font-bold uppercase tracking-wide text-white">
                  Gestión de Base de Datos e Inventario
                </h2>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-400 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Firestore Live
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Sincronización en tiempo real de catálogo, disponibilidad de almacén y precios
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-300 hidden sm:inline">
                  {currentUser.email}
                </span>
                <button
                  onClick={() => logoutUser()}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => loginWithGoogle()}
                className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-mono font-bold text-black hover:bg-amber-400 transition-colors shadow"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Acceso Administrador</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Subheader: Tabs & Context Controls */}
        <div className="bg-[#0f1118] border-b border-white/10 px-6 pt-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 pb-3 px-3 text-xs font-mono font-bold border-b-2 transition-all ${
                activeTab === 'inventory'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Gestión de Inventario ({repuestos.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 pb-3 px-3 text-xs font-mono font-bold border-b-2 transition-all ${
                activeTab === 'stats'
                  ? 'border-red-500 text-red-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Estadísticas del Catálogo</span>
              <span className="rounded bg-red-600/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 text-[10px]">
                Recharts Live
              </span>
            </button>
          </div>

          {activeTab === 'inventory' && (
            <div className="flex items-center gap-2 pb-2">
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-mono font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{showAddForm ? 'Cerrar formulario' : 'Añadir Nueva Pieza'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Secondary Filter Bar only for Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="bg-[#12151d] border-b border-white/10 px-6 py-2.5 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <input
                type="text"
                placeholder="Filtrar por pieza o código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#161921] px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
              <select
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                className="rounded-lg border border-white/10 bg-[#161921] px-2.5 py-1.5 text-xs font-mono text-slate-200"
              >
                <option value="all">Todos los modelos</option>
                <option value="MZ">MZ (250/150)</option>
                <option value="GN125">Suzuki GN125</option>
                <option value="AX100">Suzuki AX100</option>
                <option value="Karpaty">Karpaty 50</option>
                <option value="Universal">Universal</option>
              </select>
            </div>
            <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
              {filtered.length} {filtered.length === 1 ? 'pieza listada' : 'piezas listadas'}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'stats' ? (
            <CatalogStatisticsPanel repuestos={repuestos} />
          ) : (
            <>
              {/* Add New Part Drawer/Panel */}
          {showAddForm && (
            <form
              onSubmit={handleCreatePart}
              className="rounded-xl border border-amber-500/30 bg-[#161a24] p-5 animate-in slide-in-from-top duration-200"
            >
              <h3 className="font-condensed text-lg font-bold uppercase text-white mb-3 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-amber-500" />
                Registrar nuevo repuesto en base de datos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">Nombre de la pieza *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Kit Pistón + Aros 69mm"
                    value={newPart.name}
                    onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
                    className="w-full rounded bg-[#0d0f14] border border-white/10 px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Código de pieza *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. MZ-ENG-09"
                    value={newPart.code}
                    onChange={(e) => setNewPart({ ...newPart, code: e.target.value })}
                    className="w-full rounded bg-[#0d0f14] border border-white/10 px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Modelo de Moto</label>
                  <select
                    value={newPart.model}
                    onChange={(e) => setNewPart({ ...newPart, model: e.target.value as any })}
                    className="w-full rounded bg-[#0d0f14] border border-white/10 px-2.5 py-1.5 text-white"
                  >
                    <option value="MZ">MZ</option>
                    <option value="GN125">GN125</option>
                    <option value="AX100">AX100</option>
                    <option value="Karpaty">Karpaty</option>
                    <option value="Universal">Universal</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Categoría</label>
                  <select
                    value={newPart.category}
                    onChange={(e) => setNewPart({ ...newPart, category: e.target.value as any })}
                    className="w-full rounded bg-[#0d0f14] border border-white/10 px-2.5 py-1.5 text-white"
                  >
                    <option value="motor">Motor</option>
                    <option value="transmision">Transmisión</option>
                    <option value="carburacion">Carburación</option>
                    <option value="electrico">Eléctrico</option>
                    <option value="frenos">Frenos</option>
                    <option value="suspension">Suspensión</option>
                    <option value="accesorios">Accesorios</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Precio en CUP</label>
                  <input
                    type="number"
                    value={newPart.priceCUP}
                    onChange={(e) => setNewPart({ ...newPart, priceCUP: Number(e.target.value) })}
                    className="w-full rounded bg-[#0d0f14] border border-white/10 px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Precio en USD</label>
                  <input
                    type="number"
                    value={newPart.priceUSD}
                    onChange={(e) => setNewPart({ ...newPart, priceUSD: Number(e.target.value) })}
                    className="w-full rounded bg-[#0d0f14] border border-white/10 px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Stock Almacén</label>
                  <select
                    value={newPart.stock}
                    onChange={(e) => setNewPart({ ...newPart, stock: e.target.value as any })}
                    className="w-full rounded bg-[#0d0f14] border border-white/10 px-2.5 py-1.5 text-white"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="bajo_stock">Bajo Stock</option>
                    <option value="encargo">Por Encargo</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Cantidad Unidades</label>
                  <input
                    type="number"
                    value={newPart.stockCount}
                    onChange={(e) => setNewPart({ ...newPart, stockCount: Number(e.target.value) })}
                    className="w-full rounded bg-[#0d0f14] border border-white/10 px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded bg-amber-500 px-4 py-1.5 text-xs font-mono font-bold text-black hover:bg-amber-400 transition-colors shadow"
                >
                  {isSaving ? 'Guardando en Firestore...' : 'Guardar en Base de Datos'}
                </button>
              </div>
            </form>
          )}

          {/* Table of Repuestos */}
          <div className="rounded-xl border border-white/10 bg-[#0e1017] overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/10 bg-[#141720] text-[11px] font-mono uppercase text-slate-400">
                  <th className="p-3">Pieza / Código</th>
                  <th className="p-3">Modelo</th>
                  <th className="p-3">Precio CUP</th>
                  <th className="p-3">Precio USD</th>
                  <th className="p-3">Disponibilidad</th>
                  <th className="p-3">Unidades</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filtered.map((item) => {
                  const isEditing = editingId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white max-w-xs truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-400">Cód: {item.code}</div>
                      </td>
                      <td className="p-3">
                        <span className="rounded bg-black/50 px-2 py-0.5 text-amber-400 font-bold border border-white/10">
                          {item.model}
                        </span>
                      </td>

                      {/* CUP Price */}
                      <td className="p-3 tabular-nums">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPriceCUP}
                            onChange={(e) => setEditPriceCUP(Number(e.target.value))}
                            className="w-24 rounded bg-[#161a23] border border-amber-500 px-2 py-1 text-white text-xs"
                          />
                        ) : (
                          <span className="text-amber-400 font-bold">
                            ${item.priceCUP.toLocaleString('es-ES')}
                          </span>
                        )}
                      </td>

                      {/* USD Price */}
                      <td className="p-3 tabular-nums">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPriceUSD}
                            onChange={(e) => setEditPriceUSD(Number(e.target.value))}
                            className="w-20 rounded bg-[#161a23] border border-amber-500 px-2 py-1 text-white text-xs"
                          />
                        ) : (
                          <span className="text-emerald-400 font-bold">
                            ${item.priceUSD.toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Stock Status */}
                      <td className="p-3">
                        {isEditing ? (
                          <select
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value as any)}
                            className="rounded bg-[#161a23] border border-amber-500 px-2 py-1 text-white text-xs"
                          >
                            <option value="disponible">En Stock</option>
                            <option value="bajo_stock">Poco Stock</option>
                            <option value="encargo">Por Encargo</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                              item.stock === 'disponible'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : item.stock === 'bajo_stock'
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {item.stock === 'disponible'
                              ? 'Disponible'
                              : item.stock === 'bajo_stock'
                              ? 'Bajo Stock'
                              : 'Por Encargo'}
                          </span>
                        )}
                      </td>

                      {/* Stock Count */}
                      <td className="p-3 tabular-nums">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStockCount}
                            onChange={(e) => setEditStockCount(Number(e.target.value))}
                            className="w-16 rounded bg-[#161a23] border border-amber-500 px-2 py-1 text-white text-xs text-center"
                          />
                        ) : (
                          <span className="text-white font-semibold">{item.stockCount} un.</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="p-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingId(null)}
                              className="rounded px-2 py-1 text-[11px] text-slate-400 hover:text-white"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleSaveStockAndPrice(item.id)}
                              disabled={isSaving}
                              className="flex items-center gap-1 rounded bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-black hover:bg-emerald-400"
                            >
                              <Save className="h-3 w-3" />
                              <span>Guardar</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="rounded bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white hover:bg-white/10"
                            >
                              Modificar
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.name)}
                              className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                              title="Eliminar de Firestore"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-[#0d0f14] px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>
              Cualquier cambio guardado se refleja de inmediato para todos los clientes en la web y catálogo.
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 px-4 py-1.5 text-white hover:bg-white/20 transition-colors"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
};
