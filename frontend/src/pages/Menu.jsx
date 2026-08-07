import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UtensilsCrossed, Plus, Search, Edit2, Trash2, ToggleLeft, 
  ToggleRight, Tag, Clock, Star, X, Loader2 
} from "lucide-react";
import toast from "react-hot-toast";

// Hooks
import { 
  useMenuQuery, 
  useAddMenuItemMutation, 
  useUpdateMenuItemMutation, 
  useDeleteMenuItemMutation, 
  useRestoreMenuItemMutation 
} from "../hooks/useMenu";

// Components
import { EmptyState, ErrorState } from "../components/ui/EmptyState";

const CATEGORIES = ["All", "Starters", "Main Course", "Breads", "Rice & Biryani", "Desserts", "Beverages"];

function MenuCard({ item, onToggle, onDelete }) {
  const isOptimistic = item.id.toString().startsWith("temp-");

  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isOptimistic ? 0.6 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`card border overflow-hidden transition-all duration-200
      ${item.isAvailable ? "border-white/10 hover:border-white/20" : "border-white/5 opacity-60"}`}
    >
      {/* Image placeholder */}
      <div className={`h-32 flex items-center justify-center text-4xl relative
        ${item.isVeg ? "bg-green-500/5" : "bg-red-500/5"}`}>
        🍽️
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-black/80 px-2 py-1 rounded text-xs font-medium text-gray-300">Unavailable</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-white text-sm leading-tight truncate pr-2">{item.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.category?.name || 'Uncategorized'}</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5
            ${item.isVeg ? "border-green-500" : "border-red-500"}`}>
            <div className={`w-2.5 h-2.5 rounded-full m-0.5
              ${item.isVeg ? "bg-green-500" : "bg-red-500"}`}/>
          </div>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white font-bold">₹{item.price}</span>
            {item.aiSuggestedPrice && item.aiSuggestedPrice !== item.price && (
              <span className="ml-2 text-xs text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded-md border border-brand-500/20">
                AI: ₹{item.aiSuggestedPrice}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-yellow-400 text-xs">
            <Star size={11} fill="currentColor"/>
            <span>4.5</span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Clock size={11}/> {item.prepTimeMinutes}m prep</span>
          {item.tags?.length > 0 && (
            <span className="flex items-center gap-1 truncate"><Tag size={11}/> {item.tags.join(', ')}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
          <button 
            onClick={() => onToggle(item)}
            disabled={isOptimistic}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all
              ${item.isAvailable
                ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                : "bg-white/5 text-gray-500 hover:bg-white/10"}`}
          >
            {item.isAvailable ? <ToggleRight size={13}/> : <ToggleLeft size={13}/>}
            {item.isAvailable ? "Available" : "Sold Out"}
          </button>
          <button className="btn-ghost p-1.5 rounded-lg" disabled={isOptimistic}><Edit2 size={14}/></button>
          <button 
            onClick={() => onDelete(item.id, item.name)} 
            disabled={isOptimistic}
            className="btn-ghost p-1.5 rounded-lg text-red-400 hover:text-red-300"
          >
            <Trash2 size={14}/>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Menu() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newItem, setNewItem] = useState({ 
    name: "", price: "", prepTimeMinutes: "15", 
    categoryName: "Main Course", isVeg: true 
  });

  // Data Layer
  const { data: menuData, isLoading, error, refetch } = useMenuQuery();
  const rawItems = menuData?.items || [];
  
  // Mutations
  const addMutation = useAddMenuItemMutation();
  const updateMutation = useUpdateMenuItemMutation();
  const deleteMutation = useDeleteMenuItemMutation();
  const restoreMutation = useRestoreMenuItemMutation();

  // Derived State
  const filtered = useMemo(() => {
    return rawItems.filter(item =>
      (category === "All" || item.category?.name === category) &&
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [rawItems, search, category]);

  const stats = useMemo(() => {
    return {
      total: rawItems.length,
      available: rawItems.filter(i => i.isAvailable).length,
      unavailable: rawItems.filter(i => !i.isAvailable).length,
      aiUpdates: rawItems.filter(i => i.aiSuggestedPrice && i.aiSuggestedPrice !== i.price).length
    };
  }, [rawItems]);

  // Handlers
  const handleToggleAvailability = async (item) => {
    try {
      await updateMutation.mutateAsync({ 
        id: item.id, 
        data: { isAvailable: !item.isAvailable } 
      });
      toast.success(item.isAvailable ? "Marked Sold Out" : "Marked Available");
    } catch (err) {
      // Error handled by mutation
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await deleteMutation.mutateAsync(id);

      // Enterprise Standard: Undo Toast
      toast((t) => (
        <div className="flex flex-col gap-2">
          <p className="m-0 font-medium">{name} removed from menu</p>
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
                  await restoreMutation.mutateAsync(id);
                  toast.success(`${name} restored`);
                } catch (err) { }
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
            >
              Undo
            </button>
          </div>
        </div>
      ), { duration: 6000 });
      
    } catch (err) { }
  };

  const handleAddDish = async () => {
    if (!newItem.name || !newItem.price) return;
    
    setIsSubmitting(true);
    try {
      await addMutation.mutateAsync(newItem);
      setShowAdd(false);
      setNewItem({ name: "", price: "", prepTimeMinutes: "15", categoryName: "Main Course", isVeg: true });
      toast.success("Dish added successfully!");
    } catch (err) {
      // handled by mutation (including 409 duplicates)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <UtensilsCrossed size={22} className="text-brand-400"/> Menu Management
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage dishes with AI pricing suggestions</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15}/> Add Dish
        </button>
      </div>

      {/* AI Pricing Banner */}
      {stats.aiUpdates > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
          className="card border border-brand-500/20 bg-brand-500/5 p-4 flex items-start gap-4"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0">
            <Tag size={17} className="text-brand-400"/>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white text-sm">AI Pricing Suggestions Available</p>
            <p className="text-gray-400 text-xs mt-0.5">
              Dynamic pricing engine recommends price updates for <span className="text-brand-400 font-medium">{stats.aiUpdates} dishes</span> based on demand patterns.
            </p>
          </div>
          <button className="btn-primary text-xs py-2 px-4 flex-shrink-0">Apply All</button>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Dishes",   value: stats.total,       color: "text-blue-400" },
          { label: "Available",      value: stats.available,   color: "text-green-400" },
          { label: "Sold Out",       value: stats.unavailable, color: "text-red-400" },
          { label: "AI Updates",     value: stats.aiUpdates,   color: "text-brand-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-gray-500 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Search dishes..." 
            className="input pl-8 text-sm h-9 w-56"
          />
        </div>
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/5 overflow-x-auto">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all
                ${category === c ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" : "text-gray-400 hover:text-white"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid / States */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-500 gap-3">
          <Loader2 size={24} className="animate-spin text-brand-500" />
          <p className="text-sm">Loading Menu from API...</p>
        </div>
      ) : error ? (
        <ErrorState 
          code={error.code} 
          message={error.message || "Failed to load menu data"} 
          onRetry={() => refetch()} 
          className="card" 
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title={rawItems.length === 0 ? "Menu is empty" : "No dishes found"}
          message={
            rawItems.length === 0 
              ? "Start building your digital menu by adding your first dish."
              : "Try adjusting your search or category filter."
          }
          actionLabel={rawItems.length === 0 ? "Add Dish" : undefined}
          onAction={() => setShowAdd(true)}
          secondaryLabel={rawItems.length > 0 ? "Clear Filters" : undefined}
          onSecondaryAction={() => { setSearch(""); setCategory("All"); }}
          className="card"
        />
      ) : (
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence>
            {filtered.map(item => (
              <MenuCard 
                key={item.id} 
                item={item} 
                onToggle={handleToggleAvailability} 
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add Dish Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }} 
              className="card p-6 w-full max-w-md space-y-4 shadow-2xl shadow-black"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-bold text-white text-lg">Add New Dish</h3>
                <button onClick={() => !isSubmitting && setShowAdd(false)} className="btn-ghost p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                  <X size={16}/>
                </button>
              </div>

              <div className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Dish Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Chicken Tikka Masala" 
                    className="input w-full" 
                    value={newItem.name} 
                    onChange={e => setNewItem({...newItem, name: e.target.value})}
                    disabled={isSubmitting}
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Price (₹)</label>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      className="input w-full" 
                      value={newItem.price} 
                      onChange={e => setNewItem({...newItem, price: e.target.value})}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Prep (mins)</label>
                    <input 
                      type="number" 
                      placeholder="15" 
                      className="input w-full" 
                      value={newItem.prepTimeMinutes} 
                      onChange={e => setNewItem({...newItem, prepTimeMinutes: e.target.value})}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Category</label>
                  <select 
                    className="input w-full cursor-pointer appearance-none" 
                    value={newItem.categoryName} 
                    onChange={e => setNewItem({...newItem, categoryName: e.target.value})}
                    disabled={isSubmitting}
                  >
                    {CATEGORIES.slice(1).map(c => <option key={c} value={c} className="bg-surface-800">{c}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-sm font-medium text-gray-300 flex-1">Dietary Preference</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setNewItem({...newItem, isVeg: true})}
                      disabled={isSubmitting}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${newItem.isVeg ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-transparent text-gray-500'}`}
                    >
                      Veg
                    </button>
                    <button 
                      onClick={() => setNewItem({...newItem, isVeg: false})}
                      disabled={isSubmitting}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${!newItem.isVeg ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-transparent text-gray-500'}`}
                    >
                      Non-Veg
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5 mt-2">
                <button className="btn-secondary flex-1" onClick={() => setShowAdd(false)} disabled={isSubmitting}>
                  Cancel
                </button>
                <button 
                  className="btn-primary flex-1 flex items-center justify-center gap-2" 
                  onClick={handleAddDish} 
                  disabled={!newItem.name || !newItem.price || isSubmitting}
                >
                  {isSubmitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Saving...</>
                  ) : "Add Dish"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
