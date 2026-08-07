import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck, Plus, Search, Star, Phone, Mail, Activity,
  Edit2, Trash2, X, Loader2, Package, AlertTriangle, CheckCircle2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { supplierService } from "../services/api";
import { EmptyState, ErrorState } from "../components/ui/EmptyState";

const SUPPLIERS_QUERY_KEY = ["suppliers"];

const STATUS_CONFIG = {
  Active:  { badge: "badge-success", dot: "bg-green-400" },
  Warning: { badge: "badge-warning", dot: "bg-yellow-400" },
  Inactive:{ badge: "badge-danger",  dot: "bg-red-400" },
};

const CATEGORIES = ["Vegetables", "Meat", "Dairy", "Spices", "Grains", "Seafood", "Beverages", "Other"];

const EMPTY_FORM = { name: "", contactName: "", phone: "", email: "", address: "", category: "Vegetables", paymentTerms: 30 };

// ─── Supplier Modal ───────────────────────────────────────────────────────────
function SupplierModal({ open, initial = EMPTY_FORM, onClose, onSave, isSaving }) {
  const [form, setForm] = useState(initial);
  const f = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }));
  const valid = form.name.trim().length >= 2;

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="card p-6 w-full max-w-lg space-y-4 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="font-bold text-white text-lg">{initial.id ? "Edit Supplier" : "Add Supplier"}</h3>
          <button onClick={onClose} disabled={isSaving} className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-white"><X size={16} /></button>
        </div>

        <div className="space-y-3 pt-1 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium text-gray-300">Company Name *</label>
              <input value={form.name} onChange={f("name")} placeholder="Supplier company name" className="input w-full" autoFocus disabled={isSaving} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Contact Person</label>
              <input value={form.contactName} onChange={f("contactName")} placeholder="Contact name" className="input w-full" disabled={isSaving} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Category</label>
              <select value={form.category} onChange={f("category")} className="input w-full cursor-pointer" disabled={isSaving}>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-surface-800">{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Phone</label>
              <input value={form.phone} onChange={f("phone")} placeholder="+91 98765..." className="input w-full" disabled={isSaving} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input value={form.email} onChange={f("email")} type="email" placeholder="supplier@..." className="input w-full" disabled={isSaving} />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium text-gray-300">Address</label>
              <input value={form.address} onChange={f("address")} placeholder="Full address" className="input w-full" disabled={isSaving} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Payment Terms (days)</label>
              <input value={form.paymentTerms} onChange={f("paymentTerms")} type="number" min="0" max="90" className="input w-full" disabled={isSaving} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/5">
          <button onClick={onClose} disabled={isSaving} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => onSave(form)} disabled={!valid || isSaving} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {isSaving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : (initial.id ? "Save Changes" : "Add Supplier")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Confirm Delete ───────────────────────────────────────────────────────────
function ConfirmDelete({ supplier, onClose, onConfirm, isDeleting }) {
  if (!supplier) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-6 w-full max-w-sm space-y-4 shadow-2xl border border-red-500/20"
      >
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
          <Truck size={22} className="text-red-400" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="font-bold text-white text-lg">Deactivate Supplier?</h3>
          <p className="text-gray-400 text-sm">
            <span className="text-white font-medium">{supplier.name}</span> will be deactivated. 
            Their purchase order history will be preserved. This action can be reversed.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={isDeleting} className="btn-secondary flex-1">Cancel</button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 transition-all">
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : null}
            Deactivate
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Supplier Card ────────────────────────────────────────────────────────────
function SupplierCard({ supplier, onEdit, onDelete }) {
  const statusKey = supplier.rating >= 4.5 ? "Active" : supplier.rating >= 3.5 ? "Warning" : "Inactive";
  const cfg = STATUS_CONFIG[statusKey];
  const pendingPOs = supplier.purchaseOrders?.length || 0;
  const pendingAmount = supplier.purchaseOrders?.reduce((s, po) => s + (po.totalAmount || 0), 0) || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card p-5 border border-white/5 hover:border-white/10 transition-all duration-200 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
            <h3 className="font-bold text-white text-base truncate">{supplier.name}</h3>
          </div>
          <span className="badge badge-info text-xs">{supplier.category || "General"}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onEdit(supplier)} className="btn-ghost p-1.5 rounded-lg" aria-label="Edit supplier">
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDelete(supplier)} className="btn-ghost p-1.5 rounded-lg text-red-400 hover:text-red-300" aria-label="Deactivate supplier">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <Star size={13} className="text-yellow-400 flex-shrink-0" fill="currentColor" />
          <span>{supplier.rating?.toFixed(1) || "N/A"} rating</span>
        </div>
        {supplier.phone && (
          <div className="flex items-center gap-2 text-gray-400">
            <Phone size={13} className="flex-shrink-0" />
            <span>{supplier.phone}</span>
          </div>
        )}
        {supplier.email && (
          <div className="flex items-center gap-2 text-gray-400">
            <Mail size={13} className="flex-shrink-0" />
            <span className="truncate">{supplier.email}</span>
          </div>
        )}
      </div>

      {/* PO Summary */}
      <div className="space-y-1.5 pt-3 border-t border-white/5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Pending Orders</span>
          <span className={`font-semibold ${pendingPOs > 0 ? "text-yellow-400" : "text-gray-400"}`}>
            {pendingPOs > 0 ? `${pendingPOs} PO${pendingPOs > 1 ? "s" : ""}` : "None"}
          </span>
        </div>
        {pendingAmount > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Pending Amount</span>
            <span className="text-red-400 font-semibold">₹{pendingAmount.toLocaleString("en-IN")}</span>
          </div>
        )}
        {supplier.paymentTerms && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Payment Terms</span>
            <span className="text-gray-300">{supplier.paymentTerms} days</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="btn-secondary flex-1 text-xs py-1.5 flex items-center justify-center gap-1.5">
          <Package size={13} /> Create PO
        </button>
        <button className="flex-1 text-xs py-1.5 flex items-center justify-center gap-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 transition-all font-medium">
          <CheckCircle2 size={13} /> Pay Due
        </button>
      </div>
    </motion.div>
  );
}

// ─── Suppliers Page ───────────────────────────────────────────────────────────
export default function Suppliers() {
  const queryClient = useQueryClient();
  const [search, setSearch]       = useState("");
  const [addOpen, setAddOpen]     = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isSaving, setIsSaving]   = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Data ──────────────────────────────────────────────────────────────
  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: SUPPLIERS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await supplierService.getAll();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const filtered = useMemo(() =>
    data.filter(s => !search || s.name?.toLowerCase().includes(search.toLowerCase())),
    [data, search]
  );

  const stats = useMemo(() => ({
    total:   data.length,
    active:  data.filter(s => (s.rating || 0) >= 4.0).length,
    pending: data.reduce((s, sup) => s + (sup.purchaseOrders?.length || 0), 0),
    payable: data.reduce((s, sup) => s + (sup.purchaseOrders?.reduce((t, po) => t + (po.totalAmount || 0), 0) || 0), 0),
  }), [data]);

  // ─── Mutations ─────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (data) => supplierService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY });
      toast.success("Supplier added");
      setAddOpen(false);
    },
    onError: (err) => {
      if (err.response?.status === 409) toast.error(err.response.data.error);
      else toast.error("Failed to add supplier");
    },
    onSettled: () => setIsSaving(false),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => supplierService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY });
      toast.success("Supplier updated");
      setEditItem(null); setAddOpen(false);
    },
    onError: () => toast.error("Failed to update supplier"),
    onSettled: () => setIsSaving(false),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => supplierService.delete ? supplierService.delete(id) : Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY });
      toast.success("Supplier deactivated");
      setDeleteItem(null);
    },
    onError: () => toast.error("Failed to deactivate supplier"),
    onSettled: () => setIsDeleting(false),
  });

  const handleSave = (form) => {
    setIsSaving(true);
    if (editItem?.id) updateMutation.mutate({ id: editItem.id, data: form });
    else createMutation.mutate(form);
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    deleteMutation.mutate(deleteItem.id);
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Truck size={22} className="text-brand-400" /> Supplier Management
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Track vendors, deliveries, and payables</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm">
            <Activity size={15} /> Generate PO
          </button>
          <button onClick={() => { setEditItem(null); setAddOpen(true); }} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} /> Add Supplier
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Suppliers",  value: stats.total,   color: "text-blue-400 bg-blue-500/10" },
          { label: "Active",           value: stats.active,  color: "text-green-400 bg-green-500/10" },
          { label: "Pending POs",      value: stats.pending, color: "text-yellow-400 bg-yellow-500/10" },
          { label: "Total Payable",    value: `₹${stats.payable.toLocaleString("en-IN")}`, color: "text-red-400 bg-red-500/10" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`card border p-4 text-center ${color.split(" ")[1]} border-${color.split("-")[1]}-500/10`}>
            <p className={`text-xl font-bold ${color.split(" ")[0]}`}>{isLoading ? "—" : value}</p>
            <p className="text-gray-500 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search suppliers..."
          className="input pl-8 text-sm h-9 w-full"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-500 gap-3">
          <Loader2 size={24} className="animate-spin text-brand-500" />
          <p className="text-sm">Loading suppliers...</p>
        </div>
      ) : error ? (
        <ErrorState message={error.message} onRetry={() => refetch()} className="card" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Truck}
          title={data.length === 0 ? "No suppliers yet" : "No suppliers match your search"}
          message={data.length === 0 ? "Add your first supplier to start tracking orders and deliveries." : "Try a different search term."}
          actionLabel={data.length === 0 ? "Add Supplier" : undefined}
          onAction={() => setAddOpen(true)}
          secondaryLabel={data.length > 0 ? "Clear Search" : undefined}
          onSecondaryAction={() => setSearch("")}
          className="card"
        />
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map(s => (
              <SupplierCard
                key={s.id}
                supplier={s}
                onEdit={sup => { setEditItem(sup); setAddOpen(true); }}
                onDelete={setDeleteItem}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {addOpen && (
          <SupplierModal
            open={addOpen}
            initial={editItem || EMPTY_FORM}
            onClose={() => { setAddOpen(false); setEditItem(null); }}
            onSave={handleSave}
            isSaving={isSaving}
          />
        )}
      </AnimatePresence>

      <ConfirmDelete
        supplier={deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
