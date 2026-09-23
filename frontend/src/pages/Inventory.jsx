import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/ConfirmDialog";

function Inventory() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "other",
    quantity: 1,
    condition: "good",
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const fetchItems = async () => {
    try {
      const res = await API.get("/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/inventory", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems([res.data, ...items]);
      setFormData({
        name: "",
        category: "other",
        quantity: 1,
        condition: "good",
      });
      setShowForm(false);
      toast.success("Item added");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create item");
    }
  };

  const confirmDelete = (id) => setConfirmDeleteId(id);

  const handleDelete = async () => {
    try {
      await API.delete(`/inventory/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((item) => item._id !== confirmDeleteId));
      toast.success("Item deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete item");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  if (loading) return <p className="text-text text-center mt-10">Loading...</p>;

  const conditionColor = {
    new: "text-accent-lime",
    good: "text-accent-violet",
    "needs repair": "text-yellow-400",
    "out of service": "text-red-400",
  };

  return (
    <div className="min-h-screen bg-base p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl font-bold text-text">Inventory</h1>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-accent-violet to-accent-pink text-white px-4 py-2 rounded-xl font-medium hover:brightness-110 transition active:scale-[0.98]"
          >
            {showForm ? "Cancel" : "+ New Item"}
          </button>
        )}
      </div>

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4 max-w-md">
          {error}
        </p>
      )}

      {isAdmin && showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl mb-6 max-w-md space-y-3"
        >
          <input
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-surface-light text-text outline-none focus:ring-2 focus:ring-accent-violet"
          >
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="free weights">Free Weights</option>
            <option value="accessories">Accessories</option>
            <option value="other">Other</option>
          </select>
          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-surface-light text-text outline-none focus:ring-2 focus:ring-accent-violet"
          >
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="needs repair">Needs Repair</option>
            <option value="out of service">Out of Service</option>
          </select>
          <button
            type="submit"
            className="bg-accent-lime text-base font-semibold px-4 py-2 rounded-xl hover:brightness-110 transition"
          >
            Add Item
          </button>
        </form>
      )}

      <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-x-auto">
        <table className="w-full text-left text-text min-w-[600px]">
          <thead className="bg-surface-light">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Condition</th>
              {isAdmin && <th className="p-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t border-white/5">
                <td className="p-3">{item.name}</td>
                <td className="p-3 capitalize text-text-muted">
                  {item.category}
                </td>
                <td className="p-3">{item.quantity}</td>
                <td
                  className={`p-3 capitalize font-medium ${conditionColor[item.condition]}`}
                >
                  {item.condition}
                </td>
                {isAdmin && (
                  <td className="p-3">
                    <button
                      onClick={() => confirmDelete(item._id)}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-xl text-sm transition"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && !error && (
          <p className="text-text-muted p-4">No inventory items yet.</p>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        message="Are you sure you want to delete this item?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}

export default Inventory;
