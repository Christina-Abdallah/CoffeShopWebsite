import { useEffect, useState } from "react";
import { Plus, Pencil, X, Coffee } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useToast } from "../context/ToastContext";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../api";

const categories = [
  { label: "All", value: "all" },
  { label: "Coffee", value: "coffee" },
  { label: "Pastries", value: "pastries" },
  { label: "Cold Drinks", value: "cold-drinks" },
  { label: "Specials", value: "other" },
];

function AvailabilityDot({ isAvailable, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-[6px]"
    >
      <span
        className="size-[7px] shrink-0 rounded-full"
        style={{
          backgroundColor: isAvailable ? "#1a6f54" : "#b53e3e",
        }}
      />
      <span
        className="text-[12px] font-medium"
        style={{
          color: isAvailable ? "#1a6f54" : "#b53e3e",
        }}
      >
        {isAvailable ? "Active" : "Inactive"}
      </span>
    </button>
  );
}

function ModalField({ children, className = "" }) {
  return (
    <div
      className={`relative border border-[#e9e2d8] rounded-[7px] h-[38px] w-full bg-white shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.25)] ${className}`}
      style={{ fontFamily: "'Commissioner', sans-serif" }}
    >
      {children}
    </div>
  );
}

export default function AdminMenu() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "coffee",
    price: "",
    description: "",
    isAvailable: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getMenuItems();

        if (!cancelled) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load menu items:", err);

        if (!cancelled) {
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshItems() {
    try {
      const data = await getMenuItems();

      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to refresh menu items:", err);
    }
  }

  const filtered = items.filter((item) => {
    const itemName = item.name || "";
    const itemCategory = (item.category || "").toLowerCase();

    const matchesCategory =
      activeCategory === "all" || itemCategory === activeCategory;

    const matchesSearch = itemName
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    return matchesCategory && matchesSearch;
  });

  function startEdit(item) {
    setEditing(item.id);

    setImageFile(null);
    setImagePreview(item.imageUrl || "");

    setForm({
      name: item.name || "",
      category: (item.category || "coffee").toLowerCase(),
      price:
        item.price !== undefined && item.price !== null
          ? item.price.toString()
          : "",
      description: item.description || "",
      isAvailable: Boolean(item.isAvailable),
    });
  }

  function startCreate() {
    setEditing("new");

    setImageFile(null);
    setImagePreview("");

    setForm({
      name: "",
      category: "coffee",
      price: "",
      description: "",
      isAvailable: true,
    });
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleDeleteImage() {
    setImageFile(null);
    setImagePreview("");
  }

  async function handleSave() {
    const parsedPrice = parseFloat(form.price);

    if (!form.name.trim()) {
      showToast("Please enter a product name.", "error");
      return;
    }

    if (Number.isNaN(parsedPrice)) {
      showToast("Please enter a valid price.", "error");
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      category: form.category.toLowerCase(),
      price: parsedPrice,
    };

    if (imageFile) {
      payload.imageFile = imageFile;
    }

    try {
      if (editing === "new") {
        await createMenuItem(payload);
      } else {
        await updateMenuItem(editing, payload);
      }

      await refreshItems();

      setEditing(null);
      setImageFile(null);
      setImagePreview("");
    } catch (err) {
      console.error("Failed to save menu item:", err);

      showToast(err.message || "Failed to save menu item.", "error");
    }
  }

  async function toggleAvailable(item) {
    try {
      await updateMenuItem(item.id, {
        isAvailable: !item.isAvailable,
      });

      await refreshItems();
    } catch (err) {
      console.error("Failed to update availability:", err);

      showToast(err.message || "Failed to update availability.", "error");
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this item?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteMenuItem(id);

      await refreshItems();

      setEditing(null);
      setImageFile(null);
      setImagePreview("");
    } catch (err) {
      console.error("Failed to delete menu item:", err);

      showToast(err.message || "Failed to delete menu item.", "error");
    }
  }

  return (
    <AdminLayout
      title="Menu"
      search={search}
      onSearchChange={setSearch}
      extraAction={{
        icon: Plus,
        onClick: startCreate,
        label: "Add item",
      }}
    >
      <div
        style={{ fontFamily: "'Geist', sans-serif" }}
        className="flex flex-col gap-[20px]"
      >
        {/* Category filter — single row, scrolls horizontally if needed */}
        <div className="flex flex-nowrap gap-[8px] overflow-x-auto no-scrollbar -mx-[2px] px-[2px] pb-[2px]">
          <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setActiveCategory(category.value)}
              className={`shrink-0 px-[16px] py-[8px] rounded-[20px] text-[13px] transition whitespace-nowrap ${
                activeCategory === category.value
                  ? "bg-[#b55b3e] text-white font-semibold"
                  : "bg-white text-[#2e221d] font-medium border border-[#e9e2d8] hover:border-[#b55b3e]/50"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Menu items grid: always 2 columns on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-[12px] lg:gap-[20px]">
          {loading ? (
            <div className="col-span-full text-center text-[#7c6c67] py-12">
              Loading menu...
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center text-[#7c6c67] py-12">
              No items found
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#e9e2d8] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(46,34,29,0.02)] overflow-hidden flex flex-col"
              >
                {/* Menu item image — inset with padding */}
                <div className="p-[10px] pb-0">
                  <div className="h-[100px] lg:h-[140px] w-full rounded-[12px] bg-[#f7f4f0] flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <Coffee size={26} className="text-[#7c6c67]" />
                    )}
                  </div>
                </div>

                {/* Menu item information */}
                <div className="p-[12px] lg:p-[16px] flex flex-col gap-[6px]">
                  <p className="font-display font-bold text-[14px] lg:text-[16px] text-[#2e221d] truncate">
                    {item.name}
                  </p>

                  <p className="text-[14px] lg:text-[16px] font-bold text-[#b55b3e]">
                    ${item.price}
                  </p>

                  <div className="flex items-center justify-between pt-[4px]">
                    <AvailabilityDot
                      isAvailable={Boolean(item.isAvailable)}
                      onToggle={() => toggleAvailable(item)}
                    />

                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="bg-[#f7f4f0] rounded-[6px] p-[6px] hover:bg-[#e9e2d8] transition shrink-0"
                    >
                      <Pencil size={12} className="text-[#2e221d]" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="relative bg-[#f7f4f0] border-2 border-[#e9e2d8] rounded-[19px] p-[23px] w-full max-w-[380px] flex flex-col gap-[16px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close modal button */}
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="absolute -top-3 -right-3 bg-white border border-[#e9e2d8] rounded-full p-1.5 text-[#7c6c67] hover:text-[#2e221d] shadow-sm"
            >
              <X size={16} />
            </button>

            {/* Image area — full width */}
            <label className="relative border border-[#e9e2d8] bg-white rounded-[11px] h-[150px] w-full flex items-center justify-center overflow-hidden cursor-pointer shadow-[inset_0px_0px_7px_0px_rgba(0,0,0,0.35)] hover:bg-[#faf9f7] transition">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p
                  className="text-[#666] text-[22px] font-light text-center leading-tight"
                  style={{ fontFamily: "'Commissioner', sans-serif" }}
                >
                  ADD
                  <br />
                  IMAGE
                </p>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Price + Section, side by side */}
            <div className="grid grid-cols-2 gap-[12px]">
              <ModalField>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  className="size-full px-[16px] text-[15px] text-black/60 bg-transparent outline-none rounded-[7px]"
                />
              </ModalField>

              <ModalField>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="size-full px-[10px] text-[15px] text-black/60 bg-transparent outline-none rounded-[7px]"
                >
                  {categories
                    .filter((category) => category.value !== "all")
                    .map((category) => (
                      <option
                        key={category.value}
                        value={category.value}
                      >
                        {category.label}
                      </option>
                    ))}
                </select>
              </ModalField>
            </div>

            {/* Product name */}
            <ModalField>
              <input
                placeholder="Product Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="size-full px-[16px] text-[15px] text-black/60 bg-transparent outline-none rounded-[7px] tracking-[1.5px]"
              />
            </ModalField>

            {/* Description — taller, multi-line */}
            <div
              className="relative border border-[#e9e2d8] rounded-[7px] h-[80px] w-full bg-white shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.25)]"
              style={{ fontFamily: "'Commissioner', sans-serif" }}
            >
              <textarea
                placeholder="Add description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="size-full resize-none px-[16px] py-[10px] text-[15px] text-black/60 bg-transparent outline-none rounded-[7px]"
              />
            </div>

            {/* Availability checkbox */}
            <label
              className="flex items-center gap-[8px] text-[15px] text-black/60"
              style={{ fontFamily: "'Commissioner', sans-serif" }}
            >
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isAvailable: e.target.checked,
                  })
                }
              />
              Available
            </label>

            {/* Save and delete buttons */}
            <div className="flex items-center gap-[16px]">
              <button
                type="button"
                onClick={handleSave}
                style={{ fontFamily: "'Commissioner', sans-serif" }}
                className="flex-1 border border-[#b55b3e] text-[#b55b3e] rounded-[7px] px-[20px] py-[9px] text-[15px] tracking-[1.5px] hover:bg-[#b55b3e]/5 transition"
              >
                {editing === "new" ? "Add" : "Edit"}
              </button>

              {editing === "new" ? (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  style={{ fontFamily: "'Commissioner', sans-serif" }}
                  className="flex-1 border border-[#244d36] text-[#244d36] rounded-[7px] px-[20px] py-[9px] text-[15px] tracking-[1.5px] hover:bg-[#244d36]/5 transition"
                >
                  Delete
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleDelete(editing)}
                  style={{ fontFamily: "'Commissioner', sans-serif" }}
                  className="flex-1 border border-[#244d36] text-[#244d36] rounded-[7px] px-[20px] py-[9px] text-[15px] tracking-[1.5px] hover:bg-[#244d36]/5 transition"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

