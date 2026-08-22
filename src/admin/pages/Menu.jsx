import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Coffee } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../api";

const categories = ["All", "Coffee", "Pastries", "Cold Drinks", "Specials"];
const statusMap = {
  true: { label: "Available", className: "bg-sage-light text-sage" },
  false: { label: "Hidden", className: "bg-cream-200 text-ink-light" },
};

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "Coffee",
    price: "",
    description: "",
    isAvailable: true,
  });

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    try {
      const data = await getMenuItems();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = items.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function startEdit(item) {
    setEditing(item.id);
    setForm({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description || "",
      isAvailable: item.isAvailable,
    });
  }

  function startCreate() {
    setEditing("new");
    setForm({
      name: "",
      category: "Coffee",
      price: "",
      description: "",
      isAvailable: true,
    });
  }

  async function handleSave() {
    const payload = {
      ...form,
      price: parseFloat(form.price),
    };

    try {
      if (editing === "new") {
        await createMenuItem(payload);
      } else {
        await updateMenuItem(editing, payload);
      }
      await loadItems();
      setEditing(null);
    } catch (err) {
      alert(err.message);
    }
  }

  async function toggleAvailable(item) {
    try {
      await updateMenuItem(item.id, { isAvailable: !item.isAvailable });
      await loadItems();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteMenuItem(id);
      await loadItems();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <AdminLayout
      title="Menu Management"
      subtitle="Update items, prices, and availability."
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === cat
                  ? "bg-forest text-cream"
                  : "bg-white text-ink-light border border-cream-200 hover:border-clay"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
            <input
              type="text"
              placeholder="Search menu items, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-cream-200 bg-white text-sm text-ink focus:border-clay outline-none w-full sm:w-64"
            />
          </div>
          <button
            onClick={startCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-forest text-cream text-sm font-medium hover:bg-forest-light transition"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-soft mb-6">
          <h3 className="text-lg font-display font-semibold text-ink mb-4">
            {editing === "new" ? "Add Menu Item" : "Edit Menu Item"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-4 py-2 rounded-xl border border-cream-200 bg-cream-50 text-ink outline-none focus:border-clay"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-4 py-2 rounded-xl border border-cream-200 bg-cream-50 text-ink outline-none focus:border-clay"
            >
              {categories.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              placeholder="Price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="px-4 py-2 rounded-xl border border-cream-200 bg-cream-50 text-ink outline-none focus:border-clay"
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-4 py-2 rounded-xl border border-cream-200 bg-cream-50 text-ink outline-none focus:border-clay"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
              />
              Available
            </label>
            <button
              onClick={handleSave}
              className="ml-auto px-4 py-2 rounded-xl bg-forest text-cream text-sm font-medium hover:bg-forest-light"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-4 py-2 rounded-xl border border-cream-200 text-ink-light text-sm hover:bg-cream-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center text-ink-light py-12">Loading menu...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center text-ink-light py-12">No items found</div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft flex gap-4"
            >
              <div className="w-20 h-20 rounded-xl bg-cream-100 flex items-center justify-center shrink-0">
                <Coffee size={28} className="text-ink-light" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink truncate">{item.name}</p>
                    <p className="text-xs text-ink-light">{item.category}</p>
                  </div>
                  <p className="font-display font-semibold text-ink">${item.price}</p>
                </div>
                <hr className="my-3 border-cream-200" />
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleAvailable(item)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${statusMap[item.isAvailable].className}`}
                  >
                    {statusMap[item.isAvailable].label}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="p-1.5 rounded-lg hover:bg-cream-100 text-ink-light"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs text-rose hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
