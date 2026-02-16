import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../config";

function ItemManager({ itemType, foods, setFoods, categories, apiEndpoint = "api/food" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingFood, setEditingFood] = useState(null);
  const [editedData, setEditedData] = useState({
    Name: "",
    Price: "",
    Size: "",
    Category: "",
    TypeOfMoney: "دینار",
    ImageUrl: null,
  });

  // Get category names from category objects (handle both string and object formats)
  const categoryNames = categories.map(c => typeof c === 'object' ? (c.name || c.Name) : c);

  const filteredFoods = (foods || []).filter((food) =>
    categoryNames.some(catName =>
      catName?.toLowerCase() === food.Category?.toLowerCase()
    )
  );

  const searchedFoods = filteredFoods.filter(
    (food) =>
      food.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.Category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const notify = (msg) => toast(msg);

  // ============================
  // 🗑 DELETE
  // ============================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/${apiEndpoint}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const updatedFoods = foods.filter((food) => food.Id !== id);
        setFoods(updatedFoods);
        notify(`${itemType} deleted successfully`);
      } else {
        notify(`Failed to delete item (${res.status})`);
      }
    } catch (err) {
      notify(`Error: ${err.message}`);
    }
  };

  // ============================
  // ✏️ EDIT (open modal)
  // ============================
  const handleEdit = (food) => {
    setEditingFood(food);
    setEditedData({
      Name: food.Name,
      Price: food.Price,
      Size: food.Size,
      Category: food.Category,
      TypeOfMoney: food.TypeOfMoney || "دینار",
      ImageUrl: null,
    });
  };

  // ============================
  // 💾 UPDATE (submit)
  // ============================
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingFood) return;

    const formData = new FormData();
    formData.append("Name", editedData.Name);
    formData.append("Category", editedData.Category);
    formData.append("Price", editedData.Price);
    formData.append("Size", editedData.Size);
    formData.append("TypeOfMoney", editedData.TypeOfMoney);
    if (editedData.ImageUrl) {
      formData.append("ImageUrl", editedData.ImageUrl);
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/${apiEndpoint}/${editingFood.Id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (res.ok) {
        const updatedItem = await res.json();
        const updatedFoods = foods.map((f) =>
          f.Id === editingFood.Id ? updatedItem : f
        );
        setFoods(updatedFoods);
        notify("Item updated successfully ✅");
        setEditingFood(null);
      } else {
        const text = await res.text();
        notify("Failed to update: " + text);
      }
    } catch (err) {
      console.error(err);
      notify("Error updating item: " + err.message);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
        {itemType} Management
      </h2>

      {/* 🔍 Search Bar */}
      <div className="mb-4 sm:mb-6">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
      </div>

      {searchedFoods.length === 0 ? (
        <div className="text-center py-6 sm:py-8 text-gray-500">
          <p className="text-sm sm:text-base">No {itemType.toLowerCase()} items found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {searchedFoods.map((food) => (
            <div
              key={food.Id}
              className="border rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow bg-white"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold truncate">{food.Name}</h3>
                  <p className="text-gray-600 text-sm truncate">{food.Category}</p>
                  <p className="text-blue-600 font-bold text-sm sm:text-base">
                    {food.Price} {food.TypeOfMoney}
                  </p>
                  {food.Size > 0 && (
                    <p className="text-gray-500 text-sm">Size: {food.Size}</p>
                  )}
                </div>
                {food.ImageUrl && (
                  <img
                    src={food.ImageUrl}
                    alt={food.Name}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0"
                  />
                )}
              </div>

              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2">
                <button
                  className="flex-1 bg-blue-500 hover:bg-blue-700 text-white py-2 px-3 sm:px-4 rounded text-sm sm:text-base"
                  onClick={() => handleEdit(food)}
                >
                  Edit
                </button>
                <button
                  className="flex-1 bg-red-500 hover:bg-red-700 text-white py-2 px-3 sm:px-4 rounded text-sm sm:text-base"
                  onClick={() => handleDelete(food.Id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🪟 EDIT MODAL */}
      {editingFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Edit Food Item</h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-3 sm:gap-4">
              <input
                type="text"
                value={editedData.Name}
                onChange={(e) =>
                  setEditedData({ ...editedData, Name: e.target.value })
                }
                className="border p-2 rounded-md"
                placeholder="Name"
                required
              />

              <input
                type="number"
                value={editedData.Price}
                onChange={(e) =>
                  setEditedData({ ...editedData, Price: e.target.value })
                }
                className="border p-2 rounded-md"
                placeholder="Price"
                required
              />

              <input
                type="number"
                value={editedData.Size}
                onChange={(e) =>
                  setEditedData({ ...editedData, Size: e.target.value })
                }
                className="border p-2 rounded-md"
                placeholder="Size"
              />

              <select
                value={editedData.Category}
                onChange={(e) =>
                  setEditedData({ ...editedData, Category: e.target.value })
                }
                className="border p-2 rounded-md"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => {
                  const catId = typeof cat === 'object' ? (cat.id || cat.Id) : cat;
                  const catName = typeof cat === 'object' ? (cat.name || cat.Name) : cat;
                  return (
                    <option key={catId} value={catName}>
                      {catName}
                    </option>
                  );
                })}
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditedData({ ...editedData, ImageUrl: e.target.files[0] })
                }
                className="border p-2 rounded-md"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingFood(null)}
                  className="bg-gray-300 text-black py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default ItemManager;
