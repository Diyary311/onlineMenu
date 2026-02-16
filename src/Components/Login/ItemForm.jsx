// ItemForm.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";

function ItemForm({ itemType, foods, setFoods, categories, onAddCategory, onUpdateCategory, onDeleteCategory, apiEndpoint = "api/food" }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState(1);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");

  const notify = (msg) => toast(msg);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("CategoryId", category); // category now holds the ID
    formData.append("Price", price);
    formData.append("Size", size);
    formData.append("TypeOfMoney", "دینار");
    if (image) formData.append("Image", image); // Changed from ImageUrl to Image to match backend DTO

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/${apiEndpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        alert("❌ Failed to add item: " + res.status + " - " + text);
        return;
      }

      // Re-fetch the updated list from the correct endpoint
      const itemsRes = await fetch(`${API_BASE_URL}/${apiEndpoint}`);
      if (itemsRes.ok) {
        const updatedItems = await itemsRes.json();
        setFoods(updatedItems);
      }

      alert("✅ Item added successfully!");

      // reset form
      setName("");
      setPrice("");
      setSize(1);
      setCategory("");
      setImage(null);
    } catch (err) {
      console.error("Add item error:", err);
      alert("Error adding item: " + err.message);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    await onAddCategory(newCategory.trim()); // this will POST to backend
    setNewCategory("");
  };

  // Handle category delete
  const handleDeleteCategory = async (categoryName) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      text: `Are you sure you want to delete "${categoryName}"? This may affect items in this category.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const success = await onDeleteCategory(categoryName);
      if (success) {
        notify(`Category "${categoryName}" deleted successfully`);
      }
    }
  };

  // Handle category update
  const handleUpdateCategory = async () => {
    if (!editedCategoryName.trim() || !editingCategory) return;

    const success = await onUpdateCategory(editingCategory, editedCategoryName.trim());
    if (success) {
      notify(`Category updated successfully`);
      setEditingCategory(null);
      setEditedCategoryName("");
    }
  };

  // Open edit modal
  const openEditModal = (categoryName) => {
    setEditingCategory(categoryName);
    setEditedCategoryName(categoryName);
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Add {itemType}</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-full sm:max-w-md">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 w-full rounded-md"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="border p-2 w-full rounded-md"
          required
        />

        <input
          type="number"
          placeholder="Size"
          value={size}
          onChange={e => setSize(e.target.value)}
          className="border p-2 w-full rounded-md"
        />

        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          className="border p-2 w-full rounded-md"
        />

        {/* category select from DB */}
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border p-2 w-full rounded-md"
          required
        >
          <option value="">Select Category</option>
          {categories.map(c => {
            // Handle both string categories and object categories
            const catId = typeof c === 'object' ? (c.id || c.Id) : c;
            const catName = typeof c === 'object' ? (c.name || c.Name) : c;
            return (
              <option key={catId} value={catId}>
                {catName}
              </option>
            );
          })}
        </select>

        {/* add new category (saved to DB) */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New category"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className="border p-2 flex-1 rounded-md"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Add
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-green-500 hover:text-gray-900"
        >
          Add {itemType}
        </button>
      </form>

      {/* Category Management Section */}
      <div className="mt-8 border-t pt-6 max-w-full sm:max-w-md">
        <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
          <span>📁</span> Manage Categories
        </h3>

        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm">No categories yet. Add one above!</p>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => {
              // Handle both string categories and object categories
              const catId = typeof cat === 'object' ? (cat.id || cat.Id) : cat;
              const catName = typeof cat === 'object' ? (cat.name || cat.Name) : cat;
              return (
                <div
                  key={catId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors gap-2"
                >
                  <span className="font-medium text-gray-700 truncate">{catName}</span>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditModal(catName)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors flex items-center gap-1"
                    >
                      <span>✏️</span> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(catName)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors flex items-center gap-1"
                    >
                      <span>🗑️</span> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
              <span>✏️</span> Edit Category
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editedCategoryName}
                  onChange={(e) => setEditedCategoryName(e.target.value)}
                  className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter category name"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setEditedCategoryName("");
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateCategory}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemForm;
