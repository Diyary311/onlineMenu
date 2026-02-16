import React, { useState, useEffect } from "react";
import Statistics from "./Statistics";
import ItemForm from "./ItemForm";
import ItemManager from "./ItemManager";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../../config";

function AdminPanelParent({ foods, setFoods, drinks, setDrinks, sweets, setSweets }) {
  const [activeSection, setActiveSection] = useState("statistics");
  const [activeTab, setActiveTab] = useState("add");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Redirect if user is not Admin
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "Admin") {
      alert("🚫 Access denied! Only admins can access this page.");
      navigate("/login");
    }
  }, [navigate]);

  // Sidebar section data
  const sections = [
    { id: "statistics", name: "Statistics", icon: "📊" },
    { id: "food", name: "Food Items", icon: "🍔" },
    { id: "drink", name: "Drink Items", icon: "🥤" },
    { id: "sweet", name: "Sweet Items", icon: "🍰" },
  ];

  // this is for load data for category of the food and drink from db
  const [sectionCategories, setSectionCategories] = useState({
    food: [],
    drink: [],
    sweet: [],
  });

  // Helper: get the correct category API endpoint for each section
  const getCategoryApiUrl = (section) => {
    switch (section) {
      case "drink": return `${API_BASE_URL}/api/drinkcategory`;
      case "sweet": return `${API_BASE_URL}/api/sweetcategory`;
      case "food":
      default: return `${API_BASE_URL}/api/category`;
    }
  };

  // Fetch categories for food and drink sections
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch food categories
        const foodRes = await fetch(`${API_BASE_URL}/api/category`);
        if (foodRes.ok) {
          const foodData = await foodRes.json();
          setSectionCategories(prev => ({ ...prev, food: foodData }));
        }

        // Fetch drink categories
        const drinkRes = await fetch(`${API_BASE_URL}/api/drinkcategory`);
        if (drinkRes.ok) {
          const drinkData = await drinkRes.json();
          setSectionCategories(prev => ({ ...prev, drink: drinkData }));
        }

        // Fetch sweet categories
        const sweetRes = await fetch(`${API_BASE_URL}/api/sweetcategory`);
        if (sweetRes.ok) {
          const sweetData = await sweetRes.json();
          setSectionCategories(prev => ({ ...prev, sweet: sweetData }));
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };

    fetchCategories();
  }, []);


  // Function to add a new category (uses correct API per section)
  const addCategory = async (section, newCategory) => {
    if (!newCategory) return;

    try {
      const token = localStorage.getItem("token");
      const apiUrl = getCategoryApiUrl(section);

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!res.ok) {
        const text = await res.text();
        alert("Failed to save category in DB: " + text);
        return;
      }

      const saved = await res.json(); // { id, name }

      setSectionCategories(prev => {
        const currentCats = prev[section] || [];
        if (currentCats.some(cat => (cat.id || cat.Id) === (saved.id || saved.Id))) return prev;
        return {
          ...prev,
          [section]: [...currentCats, saved],
        };
      });
    } catch (err) {
      console.error("Error saving category:", err);
      alert("Error: " + err.message);
    }
  };

  // Function to update a category
  const updateCategory = async (section, oldCategoryName, newCategoryName) => {
    if (!newCategoryName || oldCategoryName === newCategoryName) return false;

    try {
      const token = localStorage.getItem("token");
      const apiUrl = getCategoryApiUrl(section);

      // First, find the category ID by name
      const categoriesRes = await fetch(apiUrl);
      const allCategories = await categoriesRes.json();

      const categoryToUpdate = allCategories.find(c =>
        (c.name || c.Name) === oldCategoryName
      );

      if (!categoryToUpdate) {
        alert("Category not found");
        return false;
      }

      const categoryId = categoryToUpdate.id ?? categoryToUpdate.Id;

      const formData = new FormData();
      formData.append("Name", newCategoryName);

      const res = await fetch(`${apiUrl}/${categoryId}`, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        alert("Failed to update category: " + text);
        return false;
      }

      setSectionCategories(prev => {
        const currentCats = prev[section] || [];
        return {
          ...prev,
          [section]: currentCats.map(cat => {
            const catName = cat.name || cat.Name;
            if (catName === oldCategoryName) {
              return { ...cat, name: newCategoryName, Name: newCategoryName };
            }
            return cat;
          }),
        };
      });

      return true;
    } catch (err) {
      console.error("Error updating category:", err);
      alert("Error: " + err.message);
      return false;
    }
  };


  // Function to delete a category
  const deleteCategory = async (section, categoryName) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = getCategoryApiUrl(section);

      const categoriesRes = await fetch(apiUrl);
      const allCategories = await categoriesRes.json();

      const categoryToDelete = allCategories.find(c =>
        (c.name || c.Name) === categoryName
      );

      if (!categoryToDelete) {
        alert("Category not found");
        return false;
      }

      const categoryId = categoryToDelete.id ?? categoryToDelete.Id;

      console.log("Deleting category with ID:", categoryId);

      const res = await fetch(`${apiUrl}/${categoryId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const text = await res.text();
        alert("Failed to delete category: " + text);
        return false;
      }

      setSectionCategories(prev => {
        const currentCats = prev[section] || [];
        return {
          ...prev,
          [section]: currentCats.filter(cat => (cat.name || cat.Name) !== categoryName),
        };
      });

      return true;
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Error: " + err.message);
      return false;
    }
  };



  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getItemType = (sectionId) => {
    switch (sectionId) {
      case "food":
        return "Food";
      case "drink":
        return "Drink";
      case "sweet":
        return "Sweet";
      default:
        return "";
    }
  };

  return (
    <>

      <Navbar />
      <div className="flex min-h-screen bg-gray-100 relative">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-20 left-4 z-50 bg-gray-800 text-white p-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-gray-800 text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-center">Admin Panel</h2>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <nav>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => {
                        setActiveSection(section.id);
                        setActiveTab("add");
                        setSidebarOpen(false); // Close sidebar on mobile after selection
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${activeSection === section.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 hover:bg-gray-600"
                        }`}
                    >
                      <span className="mr-3 text-lg">{section.icon}</span>
                      <span className="truncate">{section.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
            >
              <span className="mr-2">🚪</span> Logout
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
          <div className="bg-white shadow">
            <div className="px-4 sm:px-6 py-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 ml-10 lg:ml-0">
                {sections.find((s) => s.id === activeSection)?.name || "Admin Panel"}
              </h1>
            </div>
          </div>

          {/* Tabs */}
          {(activeSection === "food" ||
            activeSection === "drink" ||
            activeSection === "sweet") && (
              <div className="bg-white border-b overflow-x-auto">
                <div className="flex min-w-max">
                  <button
                    onClick={() => setActiveTab("add")}
                    className={`px-4 sm:px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === "add"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Add {getItemType(activeSection)}
                  </button>
                  <button
                    onClick={() => setActiveTab("manage")}
                    className={`px-4 sm:px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === "manage"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Manage {getItemType(activeSection)}s
                  </button>
                </div>
              </div>
            )}

          {/* Content area */}
          <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
            <div className="bg-white rounded-lg shadow-lg">
              {activeSection === "statistics" && <Statistics foods={foods} drinks={drinks} sweets={sweets} />}

              {activeSection === "food" && activeTab === "add" && (
                <ItemForm
                  itemType="Food Item"
                  foods={foods}
                  setFoods={setFoods}
                  categories={sectionCategories.food}
                  onAddCategory={(cat) => addCategory("food", cat)}
                  onUpdateCategory={(oldName, newName) => updateCategory("food", oldName, newName)}
                  onDeleteCategory={(name) => deleteCategory("food", name)}
                />
              )}
              {activeSection === "food" && activeTab === "manage" && (
                <ItemManager
                  itemType="Food Item"
                  foods={foods}
                  setFoods={setFoods}
                  categories={sectionCategories.food}
                  sectionType="food"
                />
              )}

              {activeSection === "drink" && activeTab === "add" && (
                <ItemForm
                  itemType="Drink Item"
                  foods={drinks}
                  setFoods={setDrinks}
                  categories={sectionCategories.drink}
                  onAddCategory={(cat) => addCategory("drink", cat)}
                  onUpdateCategory={(oldName, newName) => updateCategory("drink", oldName, newName)}
                  onDeleteCategory={(name) => deleteCategory("drink", name)}
                  apiEndpoint="api/drink"
                />
              )}
              {activeSection === "drink" && activeTab === "manage" && (
                <ItemManager
                  itemType="Drink Item"
                  foods={drinks}
                  setFoods={setDrinks}
                  categories={sectionCategories.drink}
                  sectionType="drink"
                  apiEndpoint="api/drink"
                />
              )}

              {activeSection === "sweet" && activeTab === "add" && (
                <ItemForm
                  itemType="Sweet Item"
                  foods={sweets}
                  setFoods={setSweets}
                  categories={sectionCategories.sweet}
                  onAddCategory={(cat) => addCategory("sweet", cat)}
                  onUpdateCategory={(oldName, newName) => updateCategory("sweet", oldName, newName)}
                  onDeleteCategory={(name) => deleteCategory("sweet", name)}
                  apiEndpoint="api/sweet"
                />
              )}
              {activeSection === "sweet" && activeTab === "manage" && (
                <ItemManager
                  itemType="Sweet Item"
                  foods={sweets}
                  setFoods={setSweets}
                  categories={sectionCategories.sweet}
                  sectionType="sweet"
                  apiEndpoint="api/sweet"
                />
              )}
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </>
  );
}

export default AdminPanelParent;
