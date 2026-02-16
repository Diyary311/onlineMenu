// src/Components/Drinks/Drinks.jsx
import React, { useState, useEffect } from "react";
import Shuffle from "../Shuffle";
import Navbar from "../Navbar";
import DrinkSlider from "./DrinkSlider";
import { API_BASE_URL } from "../../config";

function Drinks({ drinks = [] }) {
    /* =========================================================
       1. NORMALIZE DRINK DATA (camelCase → PascalCase)
       ========================================================= */
    const normalizedDrinks = (drinks || []).map((d) => ({
        Id: d.Id ?? d.id,
        Name: d.Name ?? d.name,
        Category: d.Category ?? d.category,
        ImageUrl: d.ImageUrl ?? d.imageUrl,
        Price: d.Price ?? d.price,
        Size: d.Size ?? d.size,
        TypeOfMoney: d.TypeOfMoney ?? d.typeOfMoney,
    }));

    /* =========================================================
       2. STATE
       ========================================================= */
    const [categories, setCategories] = useState([]);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");

    /* =========================================================
       3. LOAD CATEGORIES FROM DATABASE
       ========================================================= */
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/drinkcategory`);

                if (!res.ok) throw new Error("Failed to load drink categories");

                const data = await res.json(); // [{ id, name }]
                const names = data
                    .map((c) => (c.name ?? c.Name ?? "").trim())
                    .filter(Boolean);

                // Fallback: if DB empty, build from drinks
                if (names.length === 0) {
                    const fromDrinks = [
                        ...new Set(
                            normalizedDrinks
                                .map((d) => (d.Category ?? "").trim())
                                .filter(Boolean)
                        ),
                    ];
                    setCategories(fromDrinks);
                } else {
                    setCategories(names);
                }
            } catch (err) {
                console.error("Drink category load error:", err);

                // fallback to drink categories
                const fromDrinks = [
                    ...new Set(
                        normalizedDrinks
                            .map((d) => (d.Category ?? "").trim())
                            .filter(Boolean)
                    ),
                ];
                setCategories(fromDrinks);
            }
        };

        fetchCategories();
    }, [drinks]);

    /* =========================================================
       4. GROUP DRINKS BY CATEGORY
       ========================================================= */
    const categorized = {};
    categories.forEach((cat) => {
        categorized[cat] = normalizedDrinks.filter(
            (d) =>
                (d.Category ?? "").toLowerCase() === cat.toLowerCase()
        );
    });

    const total = normalizedDrinks.length;
    const isEmpty = total === 0;

    /* =========================================================
       5. ADD CATEGORY (SAVE TO DB)
       ========================================================= */
    const handleAddCategory = async () => {
        const trimmed = newCategory.trim();
        if (!trimmed) return;

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${API_BASE_URL}/api/drinkcategory`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ name: trimmed }),
            });

            if (!res.ok) {
                const msg = await res.text();
                alert("Failed to add drink category: " + msg);
                return;
            }

            const saved = await res.json();
            const savedName = (saved.name ?? saved.Name ?? "").trim();

            setCategories((prev) =>
                prev.includes(savedName) ? prev : [...prev, savedName]
            );

            setNewCategory("");
            setShowAddCategory(false);
        } catch (err) {
            console.error("Add drink category error:", err);
            alert("Error adding drink category");
        }
    };

    /* =========================================================
       6. UI
       ========================================================= */
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-6">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="text-center mt-12 mb-10">
                        <div className="text-teal-900 font-bold mb-4">
                            <Shuffle
                                text="Chose Refreshing drinks from here"
                                shuffleDirection="right"
                                duration={0.35}
                                animationMode="evenodd"
                                shuffleTimes={1}
                                stagger={0.03}
                                triggerOnce
                                triggerOnHover
                                textSize="text-2xl md:text-4xl lg:text-5xl"
                            />
                        </div>

                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Browse our refreshing selection of beverages and drinks
                        </p>

                        {/* Status */}
                        <div className="bg-teal-50 p-3 rounded-md text-sm my-4">
                            Total drinks: {total} |{" "}
                            {categories.map((c, i) => (
                                <span key={c}>
                                    {c}: {(categorized[c] || []).length}
                                    {i < categories.length - 1 ? " | " : ""}
                                </span>
                            ))}
                        </div>

                        {/* Add Category */}
                        <div className="my-4">
                            <button
                                onClick={() => setShowAddCategory(true)}
                                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full"
                            >
                                + Add New Drink Category
                            </button>
                        </div>
                    </div>

                    {/* Add Category Modal */}
                    {showAddCategory && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                                <h3 className="text-xl font-bold mb-4">
                                    Add New Drink Category
                                </h3>

                                <input
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Category name"
                                    className="w-full p-2 border rounded mb-4"
                                />

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowAddCategory(false)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddCategory}
                                        className="px-4 py-2 bg-teal-500 text-white rounded"
                                        disabled={!newCategory.trim()}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Drinks */}
                    {isEmpty ? (
                        <Loader />
                    ) : (
                        <div className="space-y-10">
                            {categories.map((cat) => (
                                <DrinkSlider
                                    key={cat}
                                    title={cat}
                                    items={categorized[cat] || []}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Loader() {
    return (
        <div className="text-center text-xl text-gray-700">
            Loading ...
        </div>
    );
}

export default Drinks;
