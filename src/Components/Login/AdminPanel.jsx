import React, { useState } from "react";
import Navbar from "../Navbar";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

function AdminPanel({ foods, setFoods }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [size, setSize] = useState(1);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const notify = (msg) => toast(msg);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Category", category);
    formData.append("Price", price);
    formData.append("Size", size);
    formData.append("TypeOfMoney", "دینار");
    if (image) formData.append("ImageUrl", image);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ Unauthorized! Please log in again.");
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/food`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ secure admin-only access
        },
        body: formData,
      });

      if (res.ok) {
        let added = null;
        try {
          added = await res.json();
        } catch {
          added = { name, category, price, size, typeOfMoney: "دینار" };
        }

        setFoods([...(foods || []), added]);
        notify("✅ Item added successfully!");

        // reset form
        setName("");
        setImage(null);
        setPrice("");
        setSize(1);
        setCategory("");
      } else {
        const text = await res.text();
        alert("❌ Failed to add item: " + res.status + " - " + text);
      }
    } catch (err) {
      console.error("Add item error:", err);
      alert("New item was not added: " + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col mt-10 gap-5 justify-center items-center">
        <div className="w-full max-w-md flex justify-end p-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col space-y-6 bg-white shadow-md rounded-md">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-[300px] rounded-md border-slate-950 hover:border-green-500"
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 rounded-md w-[300px] border-slate-950 hover:border-green-500"
            required
          />

          <input
            type="number"
            value={size}
            placeholder="Size"
            onChange={(e) => setSize(e.target.value)}
            className="border p-2 rounded-md w-[300px] border-slate-950 hover:border-green-500"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setImage(file);
            }}
            className="border p-2 rounded-md w-[300px] border-slate-950 hover:border-green-500"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded-md w-[300px] border-slate-950 hover:border-green-500"
            required
          >
            <option value="">Select Category</option>
            <option value="Pizza">Pizza</option>
            <option value="Burger">Burger</option>
            <option value="Pasta">Pasta</option>
            <option value="Finger">Finger</option>
          </select>

          <div>
            <button
              type="submit"
              className="border border-[2px] p-2 rounded-lg bg-gray-900 text-lg text-white w-full hover:-translate-y-1 transition-all hover:bg-green-500 hover:text-slate-900"
            >
              Add Item
            </button>
            <ToastContainer />
          </div>
        </form>
      </div>
    </>
  );
}

export default AdminPanel;
