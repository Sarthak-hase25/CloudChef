import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, AlertTriangle, Plus, RefreshCw, Edit2, Trash2,
  TrendingDown, MoreVertical
} from "lucide-react";
import toast from "react-hot-toast";
import { Modal, ConfirmDialog } from "../components/ui/Modal";
import { EmptyState, ErrorState } from "../components/ui/EmptyState";
import { SkeletonTableRow, SkeletonStatCard } from "../components/ui/Skeleton";
import { SearchInput, SelectField, InputField } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import {
  useInventoryQuery,
  useAddIngredientMutation,
  useUpdateIngredientMutation,
  useDeleteIngredientMutation,
  useAddStockMutation,
  useRestoreIngredientMutation
} from "../hooks/useInventory";

/* ─── Constants ────────────────────────────────────────── */
const CATEGORIES = ["All", "Vegetables", "Meat", "Dairy", "Grains", "Spices", "Oils", "Other"];
const UNITS       = ["kg", "L", "pieces", "packets", "grams", "ml"];

const FILTERS = [
  { key: "all",      label: "All" },
  { key: "low",      label: "Low Stock" },
  { key: "expiring", label: "Expiring Soon" },
];

/* ─── Stock Level Bar ───────────────────────────────────── */
function StockBar({ stock, reorder }) {
  const pct   = Math.min((stock / Math.max(reorder * 2, 1)) * 100, 100);
  const color  = pct < 30 ? "#ef4444" : pct < 60 ? "#eab308" : "#22c55e";
  return (
    <div
      className="h-1.5 w-full max-w-[80px] bg-white/[0.07] rounded-full overflow-hidden"
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Stock level ${Math.round(pct)}%`}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}

/* ─── Stat Card ─────────────────────────────────────────── */
function StatCard({ label, value, color, icon: Icon, suffix }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <span className="stat-label">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
            <Icon size={15} className={color} aria-hidden="true" />
          </div>
        )}
      </div>
      <p className={`stat-value ${color}`} aria-live="polite">
        {suffix}{value}
      </p>
    </div>
  );
}

/* ─── Add Stock Modal ───────────────────────────────────── */
function AddStockModal({ item, onClose, onSuccess }) {
  const [qty, setQty]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const validate = () => {
    const n = parseFloat(qty);
    if (!qty || isNaN(n) || n <= 0) return "Enter a valid quantity greater than 0";
    return null;
  };

  const addStockMutation = useAddStockMutation();

  const handleAdd = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    if (item.id?.toString().startsWith("temp-")) { onClose(); return; } // Cannot add stock to optimistic item

    setLoading(true);
    try {
      await addStockMutation.mutateAsync({ id: item.id, quantity: qty });
      toast.success(`Added ${qty} ${item.unit} to ${item.name}`);
      onSuccess();
      onClose();
    } catch (err) {
      // toast is handled in mutation
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={`Add Stock — ${item.name}`} size="sm">
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Current stock:{" "}
          <span className="text-white font-semibold">{item.currentStock} {item.unit}</span>
        </p>
        <InputField
          label={`Quantity to add (${item.unit})`}
          type="number"
          min="0"
          step="0.1"
          placeholder="e.g. 5"
          value={qty}
          onChange={(e) => { setQty(e.target.value); setError(""); }}
          error={error}
          required
          autoFocus
        />
      </div>
      <div className="modal-footer -mx-5 -mb-5 mt-4">
        <Button variant="secondary" onClick={onClose} fullWidth>Cancel</Button>
        <Button variant="primary" onClick={handleAdd} loading={loading} fullWidth>
          Add to Inventory
        </Button>
      </div>
    </Modal>
  );
}

/* ─── Ingredient Form Modal (Add / Edit) ────────────────── */
function IngredientFormModal({ item, onClose, onSuccess }) {
  const isEdit = Boolean(item);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const [form, setForm] = useState({
    name:         item?.name        ?? "",
    category:     item?.category    ?? "Vegetables",
    unit:         item?.unit        ?? "kg",
    currentStock: item?.currentStock ?? "",
    reorderLevel: item?.reorderLevel ?? "",
    costPerUnit:  item?.costPerUnit  ?? "",
    expiry:       item?.expiry       ?? "",
  });

  const patch = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                e.name         = "Name is required";
    if (form.name.trim().length > 80)     e.name         = "Name must be under 80 characters";
    if (form.currentStock === "")         e.currentStock = "Stock is required";
    if (parseFloat(form.currentStock) < 0) e.currentStock = "Stock cannot be negative";
    if (form.reorderLevel === "")         e.reorderLevel = "Reorder level is required";
    if (parseFloat(form.reorderLevel) < 0) e.reorderLevel = "Reorder level cannot be negative";
    if (form.costPerUnit === "")          e.costPerUnit  = "Cost is required";
    if (parseFloat(form.costPerUnit) < 0) e.costPerUnit  = "Cost cannot be negative";
    return e;
  };

  const addMutation = useAddIngredientMutation();
  const updateMutation = useUpdateIngredientMutation();

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: item.id, data: form });
        toast.success("Ingredient updated successfully");
      } else {
        await addMutation.mutateAsync(form);
        toast.success("Ingredient added successfully");
      }
      onSuccess();
      onClose();
    } catch (err) {
      // Error handled by mutation toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isEdit ? "Edit Ingredient" : "New Ingredient"}
      subtitle={isEdit ? `Editing ${item.name}` : "Add an ingredient to your inventory"}
      size="md"
    >
      <div className="space-y-4">
        {/* Name — full width */}
        <InputField
          label="Ingredient Name"
          required
          placeholder="e.g. Tomatoes"
          value={form.name}
          onChange={(e) => patch("name", e.target.value)}
          error={errors.name}
          autoFocus={!isEdit}
        />

        {/* Category + Unit */}
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Category"
            required
            value={form.category}
            onChange={(e) => patch("category", e.target.value)}
            options={CATEGORIES.slice(1)}
          />
          <SelectField
            label="Unit"
            required
            value={form.unit}
            onChange={(e) => patch("unit", e.target.value)}
            options={UNITS}
          />
        </div>

        {/* Stock + Reorder Level */}
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Current Stock"
            type="number" min="0" step="0.1"
            required
            placeholder="0"
            value={form.currentStock}
            onChange={(e) => patch("currentStock", e.target.value)}
            error={errors.currentStock}
          />
          <InputField
            label="Reorder Level"
            type="number" min="0" step="0.1"
            required
            placeholder="5"
            value={form.reorderLevel}
            onChange={(e) => patch("reorderLevel", e.target.value)}
            error={errors.reorderLevel}
          />
        </div>

        {/* Cost + Expiry */}
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Cost per Unit (₹)"
            type="number" min="0" step="0.01"
            required
            placeholder="0"
            value={form.costPerUnit}
            onChange={(e) => patch("costPerUnit", e.target.value)}
            error={errors.costPerUnit}
          />
          <InputField
            label="Expiry Date"
            type="date"
            value={form.expiry}
            onChange={(e) => patch("expiry", e.target.value)}
          />
        </div>
      </div>

      <div className="modal-footer -mx-5 -mb-5 mt-4">
        <Button variant="secondary" onClick={onClose} disabled={loading} fullWidth>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} loading={loading} fullWidth>
          {isEdit ? "Save Changes" : "Add Ingredient"}
        </Button>
      </div>
    </Modal>
  );
}

/* ─── Mobile Ingredient Card ────────────────────────────── */
function IngredientCard({ item, onEdit, onDelete, onAddStock }) {
  const isLow   = item.currentStock <= item.reorderLevel;
  const expDate = item.expiry ? new Date(item.expiry) : null;
  const daysLeft = expDate ? Math.ceil((expDate - Date.now()) / 86400000) : 99;
  const expWarn = daysLeft <= 4;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`card p-4 space-y-3 ${isLow ? "border-red-500/20" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {isLow && <AlertTriangle size={13} className="text-red-400 flex-shrink-0" aria-label="Low stock" />}
            <p className="font-semibold text-white truncate">{item.name}</p>
          </div>
          <span className="badge badge-info mt-1">{item.category}</span>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={() => onEdit(item)} className="btn-icon" aria-label={`Edit ${item.name}`}>
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDelete(item)} className="btn-icon text-red-400 hover:text-red-300" aria-label={`Delete ${item.name}`}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <p className="text-gray-500 text-xs mb-0.5">Stock</p>
          <p className="text-white font-semibold">{item.currentStock} {item.unit}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-0.5">Reorder At</p>
          <p className="text-gray-300">{item.reorderLevel} {item.unit}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-0.5">Cost/Unit</p>
          <p className="text-gray-300">₹{item.costPerUnit}/{item.unit}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-0.5">Expiry</p>
          <p className={expWarn ? "text-red-400" : "text-gray-300"}>
            {item.expiry ? `${item.expiry}${expWarn ? ` (${daysLeft}d)` : ""}` : "N/A"}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-gray-500 text-xs">Stock Level</p>
        <StockBar stock={item.currentStock} reorder={item.reorderLevel} />
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onAddStock(item)}
        fullWidth
        aria-label={`Add stock to ${item.name}`}
      >
        <Plus size={13} /> Add Stock
      </Button>
    </motion.div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function Inventory() {
  const { data: rawItems = [], isLoading: loading, error, refetch } = useInventoryQuery();
  const deleteMutation = useDeleteIngredientMutation();

  const [search,    setSearch]    = useState("");
  const [category,  setCategory]  = useState("All");
  const [filter,    setFilter]    = useState("all");

  // Modal states
  const [addOpen,    setAddOpen]    = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [stockItem,  setStockItem]  = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  /* ─── Filtered list ─── */
  const filtered = useMemo(() => {
    return rawItems.filter((item) => {
      const matchSearch   = item.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || item.category === category;
      const daysLeft      = item.expiry ? Math.ceil((new Date(item.expiry) - Date.now()) / 86400000) : 99;
      const matchFilter   =
        filter === "all"      ? true :
        filter === "low"      ? item.currentStock <= item.reorderLevel :
        filter === "expiring" ? daysLeft <= 4 : true;
      return matchSearch && matchCategory && matchFilter;
    });
  }, [rawItems, search, category, filter]);

  /* ─── Stats ─── */
  const stats = useMemo(() => ({
    total:    rawItems.length,
    lowStock: rawItems.filter((i) => i.currentStock <= i.reorderLevel).length,
    urgent:   rawItems.filter((i) => i.currentStock === 0).length,
    value:    rawItems.reduce((s, i) => s + (i.currentStock * i.costPerUnit), 0),
  }), [rawItems]);

  /* ─── Delete & Undo ─── */
  const restoreMutation = useRestoreIngredientMutation();

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      const deletedId = deleteItem.id;
      const deletedName = deleteItem.name;
      
      await deleteMutation.mutateAsync(deletedId);
      setDeleteItem(null);

      // Show Undo Toast
      toast((t) => (
        <div className="flex flex-col gap-2">
          <p className="m-0 font-medium">{deletedName} moved to trash</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await restoreMutation.mutateAsync(deletedId);
                  toast.success(`${deletedName} restored`);
                } catch (err) {
                  // Error handled by mutation
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
            >
              Undo
            </button>
          </div>
        </div>
      ), { duration: 6000 }); // Keep toast open slightly longer to allow undo
      
    } catch (err) {
      // Error handled by mutation
    }
  };

  /* ─── Render ─── */
  return (
    <div className="page-content" role="main">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Package size={22} className="text-brand-400" aria-hidden="true" />
            Inventory Management
          </h1>
          <p className="page-subtitle">Real-time stock tracking with AI reorder suggestions</p>
        </div>
        <div className="page-actions">
          <Button
            variant="secondary"
            onClick={() => refetch()}
            aria-label="Refresh inventory"
            size="sm"
            leftIcon={<RefreshCw size={14} />}
          >
            <span className="hidden xs:inline">Refresh</span>
          </Button>
          <Button
            variant="primary"
            onClick={() => setAddOpen(true)}
            aria-label="Add new ingredient"
            leftIcon={<Plus size={15} />}
          >
            Add Ingredient
          </Button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" role="region" aria-label="Inventory statistics">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
        ) : (
          <>
            <StatCard label="Total Items"      value={stats.total}    color="text-blue-400"    icon={Package} />
            <StatCard label="Low Stock"        value={stats.lowStock} color="text-red-400"     icon={AlertTriangle} />
            <StatCard label="Out of Stock"     value={stats.urgent}   color="text-orange-400"  icon={TrendingDown} />
            <StatCard label="Inventory Value"  value={`₹${stats.value >= 1000 ? (stats.value/1000).toFixed(1)+"k" : stats.value}`} color="text-green-400" icon={Package} />
          </>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col xs:flex-row gap-3 flex-wrap">
        <SearchInput
          placeholder="Search ingredient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full xs:w-56"
          aria-label="Search ingredients"
        />

        {/* Filter pills */}
        <div className="flex gap-1.5 scrollbar-none overflow-x-auto" role="group" aria-label="Stock filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={filter === f.key ? "chip-active" : "chip-inactive"}
              aria-pressed={filter === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Category select */}
        <div className="w-full xs:w-36">
          <SelectField
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORIES}
            aria-label="Filter by category"
          />
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="card overflow-hidden" aria-busy="true" aria-label="Loading inventory">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]" aria-label="Loading">
              <thead>
                <tr className="table-head">
                  {["Ingredient","Category","Stock","Reorder Level","Stock Level","Cost/Unit","Expiry","Actions"].map((h) => (
                    <th key={h} className="table-cell">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} cols={8} />)}
              </tbody>
            </table>
          </div>
        </div>
      ) : error ? (
        <ErrorState
          code={error.code}
          message={error.message}
          onRetry={() => refetch()}
          className="card"
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title={rawItems.length === 0 ? "No ingredients yet" : "No results found"}
          message={
            rawItems.length === 0
              ? "Add your first ingredient to start tracking inventory."
              : "Try adjusting your search or filter criteria."
          }
          actionLabel={rawItems.length === 0 ? "Add Ingredient" : undefined}
          onAction={() => setAddOpen(true)}
          secondaryLabel={rawItems.length > 0 ? "Clear filters" : undefined}
          onSecondaryAction={() => { setSearch(""); setCategory("All"); setFilter("all"); }}
          className="card"
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="table-wrapper hidden md:block" role="region" aria-label="Ingredients table">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]" aria-label="Inventory ingredients">
                <thead>
                  <tr className="table-head">
                    <th className="table-cell" scope="col">Ingredient</th>
                    <th className="table-cell" scope="col">Category</th>
                    <th className="table-cell" scope="col">Stock</th>
                    <th className="table-cell" scope="col">Reorder Level</th>
                    <th className="table-cell" scope="col">Stock Level</th>
                    <th className="table-cell" scope="col">Cost/Unit</th>
                    <th className="table-cell" scope="col">Expiry</th>
                    <th className="table-cell" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((item, i) => {
                      const isLow   = item.currentStock <= item.reorderLevel;
                      const expDate = item.expiry ? new Date(item.expiry) : null;
                      const daysLeft = expDate ? Math.ceil((expDate - Date.now()) / 86400000) : 99;
                      const expWarn = daysLeft <= 4;
                      const isOptimistic = item.id.toString().startsWith('temp-');

                      return (
                        <motion.tr
                          key={item.id}
                          className={`table-row ${isOptimistic ? 'opacity-50' : ''}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: isOptimistic ? 0.5 : 1 }}
                        >
                          <td className="table-cell">
                            <div className="flex items-center gap-2">
                              {isLow && (
                                <AlertTriangle
                                  size={13}
                                  className="text-red-400 flex-shrink-0"
                                  aria-label="Low stock"
                                />
                              )}
                              <span className="font-medium text-white">{item.name}</span>
                            </div>
                          </td>
                          <td className="table-cell">
                            <span className="badge badge-info">{item.category}</span>
                          </td>
                          <td className="table-cell font-semibold text-white">
                            {item.currentStock} {item.unit}
                          </td>
                          <td className="table-cell text-gray-400">
                            {item.reorderLevel} {item.unit}
                          </td>
                          <td className="table-cell">
                            <StockBar stock={item.currentStock} reorder={item.reorderLevel} />
                          </td>
                          <td className="table-cell text-gray-300">
                            ₹{item.costPerUnit}/{item.unit}
                          </td>
                          <td className="table-cell">
                            <span className={`text-xs font-medium ${expWarn ? "text-red-400" : "text-gray-400"}`}>
                              {item.expiry
                                ? `${item.expiry}${expWarn ? ` (${daysLeft}d)` : ""}`
                                : "N/A"}
                            </span>
                          </td>
                          <td className="table-cell">
                            <div className="flex items-center gap-1.5">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setStockItem(item)}
                                aria-label={`Add stock to ${item.name}`}
                                disabled={isOptimistic}
                              >
                                + Stock
                              </Button>
                              <button
                                onClick={() => setEditItem(item)}
                                className="btn-icon"
                                aria-label={`Edit ${item.name}`}
                                disabled={isOptimistic}
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteItem(item)}
                                className="btn-icon text-red-400 hover:text-red-300 disabled:opacity-50"
                                aria-label={`Delete ${item.name}`}
                                disabled={isOptimistic}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile / Tablet Cards */}
          <div className="md:hidden">
            <AnimatePresence>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                {filtered.map((item) => (
                  <IngredientCard
                    key={item.id}
                    item={item}
                    onEdit={setEditItem}
                    onDelete={setDeleteItem}
                    onAddStock={setStockItem}
                  />
                ))}
              </div>
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Results count */}
      {!loading && !error && filtered.length > 0 && (
        <p className="text-xs text-gray-600 text-center" aria-live="polite">
          Showing {filtered.length} of {rawItems.length} ingredients
        </p>
      )}

      {/* ── Modals ── */}
      {addOpen   && <IngredientFormModal onClose={() => setAddOpen(false)}   onSuccess={() => {}} />}
      {editItem  && <IngredientFormModal item={editItem} onClose={() => setEditItem(null)}  onSuccess={() => {}} />}
      {stockItem && <AddStockModal       item={stockItem} onClose={() => setStockItem(null)} onSuccess={() => {}} />}

      <ConfirmDialog
        open={Boolean(deleteItem)}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
        title={`Delete "${deleteItem?.name}"?`}
        message="This will permanently remove this ingredient from your inventory. This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
