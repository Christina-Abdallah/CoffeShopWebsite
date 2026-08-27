import { useEffect, useState } from "react";
import {
  
  Plus,
  Pencil,
  X,
  Coffee,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
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

/*
 * Toggle used to change the availability status of a menu item.
 */
function AvailabilityToggle({ isAvailable, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-[8px]"
    >
      <span
        className={`relative inline-flex h-[20px] w-[36px] items-center rounded-full transition-colors ${
          isAvailable ? "bg-[#1a6f54]" : "bg-[#d8d2c7]"
        }`}
      >
        <span
          className={`inline-block h-[16px] w-[16px] transform rounded-full bg-white transition-transform ${
            isAvailable ? "translate-x-[18px]" : "translate-x-[2px]"
          }`}
        />
      </span>

      <span
        className={`text-[13px] font-medium ${
          isAvailable ? "text-[#1a6f54]" : "text-[#7c6c67]"
        }`}
      >
        {isAvailable ? "Available" : "Hidden"}
      </span>
    </button>
  );
}

/*
 * Reusable styled field for the menu modal.
 */
function ModalField({ children }) {
  return (
    <div
      className="relative border border-[#e9e2d8] rounded-[7px] h-[38px] w-full bg-white shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.25)]"
      style={{ fontFamily: "'Commissioner', sans-serif" }}
    >
      {children}
    </div>
  );
}

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "coffee",
    price: "",
    description: "",
    isAvailable: true,
  });

  /*
   * Load menu items from the database when the page is first rendered.
   */
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

  /*
   * Refresh menu items from the database.
   */
  async function refreshItems() {
    try {
      const data = await getMenuItems();

      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to refresh menu items:", err);
    }
  }

  /*
   * Filter menu items by category and search text.
   */
  const filtered = items.filter((item) => {
    const itemName = item.name || "";
    const itemCategory = (item.category || "").toLowerCase();

    const matchesCategory =
      activeCategory === "all" ||
      itemCategory === activeCategory;

    const matchesSearch = itemName
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  /*
   * Open the modal in edit mode and populate the form.
   */
  function startEdit(item) {
    setEditing(item.id);

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

  /*
   * Open the modal in create mode.
   */
  function startCreate() {
    setEditing("new");

    setForm({
      name: "",
      category: "coffee",
      price: "",
      description: "",
      isAvailable: true,
    });
  }

  /*
   * Create a new menu item or update an existing one.
   */
  async function handleSave() {
    const parsedPrice = parseFloat(form.price);

    if (!form.name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    if (Number.isNaN(parsedPrice)) {
      alert("Please enter a valid price.");
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      category: form.category.toLowerCase(),
      price: parsedPrice,
    };

    try {
      if (editing === "new") {
        await createMenuItem(payload);
      } else {
        await updateMenuItem(editing, payload);
      }

      await refreshItems();

      setEditing(null);
    } catch (err) {
      console.error("Failed to save menu item:", err);

      alert(err.message || "Failed to save menu item.");
    }
  }

  /*
   * Toggle the availability of a menu item.
   */
  async function toggleAvailable(item) {
    try {
      await updateMenuItem(item.id, {
        isAvailable: !item.isAvailable,
      });

      await refreshItems();
    } catch (err) {
      console.error("Failed to update availability:", err);

      alert(err.message || "Failed to update availability.");
    }
  }

  /*
   * Delete a menu item after confirmation.
   */
  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this item?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteMenuItem(id);

      await refreshItems();

      setEditing(null);
    } catch (err) {
      console.error("Failed to delete menu item:", err);

      alert(err.message || "Failed to delete menu item.");
    }
  }

  return (
    <AdminLayout 
        title="Menu Management" 
        subtitle="Create, organize, and update your daily cafe offerings."
        search={search}
        onSearchChange={setSearch}
     >
      <div
        style={{ fontFamily: "'Geist', sans-serif" }}
        className="flex flex-col gap-[32px]"
      >
        {/* Category filter and search */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
          <div className="flex flex-wrap gap-[8px]">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => setActiveCategory(category.value)}
                className={`px-[16px] py-[8px] rounded-[20px] text-[13px] transition ${
                  activeCategory === category.value
                    ? "bg-[#b55b3e] text-white font-semibold"
                    : "bg-white text-[#2e221d] font-medium border border-[#e9e2d8] hover:border-[#b55b3e]/50"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

         <div className="flex items-center gap-[12px]">
  {/* Add menu item button */}

  <button 
    type="button" 
    onClick={startCreate} 
    className="flex items-center gap-[8px] px-[16px] py-[10px] rounded-[8px] bg-[#b55b3e] text-white text-[13px] font-semibold hover:opacity-90 transition whitespace-nowrap" 
  >
    <Plus size={14} />
    Add Items
  </button>
</div>
        </div>

        {/* Menu items grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[20px]">
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
                {/* Menu item image */}

                <div className="h-[160px] w-full bg-[#f7f4f0] flex items-center justify-center shrink-0 overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <Coffee
                      size={32}
                      className="text-[#7c6c67]"
                    />
                  )}
                </div>

                {/* Menu item information */}

                <div className="p-[20px] flex flex-col gap-[12px]">
                  <div className="flex items-start justify-between gap-[8px]">
                    <div className="min-w-0">
                      <p className="font-display font-bold text-[18px] text-[#2e221d] truncate">
                        {item.name}
                      </p>

                      <p className="text-[12px] text-[#7c6c67]">
                        {item.category}
                      </p>
                    </div>

                    <p className="text-[18px] font-bold text-[#b55b3e] shrink-0">
                      ${item.price}
                    </p>
                  </div>

                  <div className="h-px bg-[#e9e2d8]" />

                  <div className="flex items-center justify-between">
                    {/* Availability toggle */}

                    <AvailabilityToggle
                      isAvailable={Boolean(item.isAvailable)}
                      onToggle={() => toggleAvailable(item)}
                    />

                    {/* Edit button */}

                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="bg-[#f7f4f0] rounded-[6px] p-[8px] hover:bg-[#e9e2d8] transition"
                    >
                      <Pencil
                        size={14}
                        className="text-[#2e221d]"
                      />
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
            className="relative bg-[#f7f4f0] border-2 border-[#e9e2d8] rounded-[19px] p-[23px] w-full max-w-[617px] flex flex-col sm:flex-row gap-[29px]"
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

            {/* Image area */}

            <div className="border border-[#e9e2d8] bg-white rounded-[11px] size-[231px] shrink-0 flex items-center justify-center shadow-[inset_0px_0px_7px_0px_rgba(0,0,0,0.35)] mx-auto sm:mx-0">
              <p
                className="text-[#666] text-[24px] font-light text-center leading-tight"
                style={{
                  fontFamily: "'Commissioner', sans-serif",
                }}
              >
                ADD
                <br />
                IMAGE
              </p>
            </div>

            {/* Form fields */}

            <div className="flex flex-col gap-[16px] w-full sm:w-[307px]">
              {/* Price */}

              <ModalField>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                  className="size-full px-[16px] text-[15px] text-black/60 bg-transparent outline-none rounded-[7px]"
                />
              </ModalField>

              {/* Category */}

              <ModalField>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  className="size-full px-[16px] text-[15px] text-black/60 bg-transparent outline-none rounded-[7px]"
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

              {/* Product name */}

              <ModalField>
                <input
                  placeholder="Product Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="size-full px-[16px] text-[15px] text-black/60 bg-transparent outline-none rounded-[7px] tracking-[1.5px]"
                />
              </ModalField>

              {/* Description */}

              <ModalField>
                <input
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  className="size-full px-[16px] text-[15px] text-black/60 bg-transparent outline-none rounded-[7px]"
                />
              </ModalField>

              {/* Availability checkbox */}

              <label
                className="flex items-center gap-[8px] text-[15px] text-black/60"
                style={{
                  fontFamily: "'Commissioner', sans-serif",
                }}
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

              <div className="flex items-center gap-[25px]">
                <button
                  type="button"
                  onClick={handleSave}
                  style={{
                    fontFamily: "'Commissioner', sans-serif",
                  }}
                  className="flex-1 border border-[#b55b3e] text-[#b55b3e] rounded-[7px] px-[20px] py-[9px] text-[15px] tracking-[1.5px] hover:bg-[#b55b3e]/5 transition"
                >
                  {editing === "new" ? "Add" : "Edit"}
                </button>

                {editing !== "new" && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editing)}
                    style={{
                      fontFamily: "'Commissioner', sans-serif",
                    }}
                    className="flex-1 border border-[#244d36] text-[#244d36] rounded-[7px] px-[20px] py-[9px] text-[15px] tracking-[1.5px] hover:bg-[#244d36]/5 transition"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}