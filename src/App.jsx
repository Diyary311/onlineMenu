// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { API_BASE_URL } from "./config";
import Home from "./Components/Home";
import Foods from "./Components/Foods/Foods";
import Drinks from "./Components/Drinks/Drinks";
import Sweets from "./Components/Sweets/Sweets";
import Login from "./Components/Login/Login";
import AdminPanel from "./Components/Login/AdminPanel";
import CreateAccount from "./Components/Login/createAccount";
import AdminPanelParent from "./Components/Login/AdminPanelParent";
import UserProfile from "./Components/UserProfile";
import ItemViewer3D from "./Components/ItemViewer3D";
import ServerDown from "./Components/ServerDown/ServerDown";
import { useEffect, useState, useCallback } from "react";

/**
 * Normalize a food item coming from backend to a single canonical shape:
 * { Id, Name, Category, ImageUrl, Price, Size, TypeOfMoney }
 * ئەوفەنکشنانە بۆئەوەیە ئەگەر داتاجیاواز بوو لەبەینی فرۆنت و باک دا کێشەمان بۆدروستنەبێت
 */
const normalizeFood = (f = {}) => ({
  Id: f.Id ?? f.id ?? f.ID ?? 0,
  Name: f.Name ?? f.name ?? "",
  Category: (f.Category ?? f.category ?? f.categoryName ?? f.CategoryName ?? "").toString().trim(),
  CategoryId: f.CategoryId ?? f.categoryId ?? 0,
  ImageUrl: f.ImageUrl ?? f.imageUrl ?? f.image ?? "",
  Price: Number(f.Price ?? f.price ?? 0),
  Size: Number(f.Size ?? f.size ?? 0),
  TypeOfMoney: f.TypeOfMoney ?? f.typeOfMoney ?? f.type_of_money ?? "دینار",
});

/**
 * Normalize a drink item coming from backend to a single canonical shape
 */
const normalizeDrink = (d = {}) => ({
  Id: d.Id ?? d.id ?? d.ID ?? 0,
  Name: d.Name ?? d.name ?? "",
  Category: (d.Category ?? d.category ?? d.categoryName ?? d.CategoryName ?? "").toString().trim(),
  CategoryId: d.CategoryId ?? d.categoryId ?? 0,
  ImageUrl: d.ImageUrl ?? d.imageUrl ?? d.image ?? "",
  Price: Number(d.Price ?? d.price ?? 0),
  Size: Number(d.Size ?? d.size ?? 0),
  TypeOfMoney: d.TypeOfMoney ?? d.typeOfMoney ?? d.type_of_money ?? "دینار",
});

/**
 * Normalize a sweet item coming from backend to a single canonical shape
 */
const normalizeSweet = (s = {}) => ({
  Id: s.Id ?? s.id ?? s.ID ?? 0,
  Name: s.Name ?? s.name ?? "",
  Category: (s.Category ?? s.category ?? s.categoryName ?? s.CategoryName ?? "").toString().trim(),
  CategoryId: s.CategoryId ?? s.categoryId ?? 0,
  ImageUrl: s.ImageUrl ?? s.imageUrl ?? s.image ?? "",
  Price: Number(s.Price ?? s.price ?? 0),
  Size: Number(s.Size ?? s.size ?? 0),
  TypeOfMoney: s.TypeOfMoney ?? s.typeOfMoney ?? s.type_of_money ?? "دینار",
});

function App() {
  const [foods, setFoods] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [sweets, setSweets] = useState([]);
  const [isServerDown, setIsServerDown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch foods function - reusable for retry
  const fetchFoods = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/food`, {
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) throw new Error("Failed to fetch foods: " + res.status);
      const data = await res.json();

      const normalized = (data || []).map(normalizeFood);
      console.log("Fetched foods sample:", normalized[0]);
      setFoods(normalized);
      setIsServerDown(false);
    } catch (err) {
      console.error("Fetch foods error:", err);
      if (err.name === 'TypeError' || err.name === 'AbortError' || err.message.includes('fetch')) {
        setIsServerDown(true);
      }
      setFoods([]);
    }
  }, []);

  // Fetch drinks function - reusable for retry
  const fetchDrinks = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/drink`, {
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) throw new Error("Failed to fetch drinks: " + res.status);
      const data = await res.json();

      const normalized = (data || []).map(normalizeDrink);
      console.log("Fetched drinks sample:", normalized[0]);
      setDrinks(normalized);
    } catch (err) {
      console.error("Fetch drinks error:", err);
      setDrinks([]);
    }
  }, []);

  // Fetch sweets function - reusable for retry
  const fetchSweets = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/sweet`, {
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) throw new Error("Failed to fetch sweets: " + res.status);
      const data = await res.json();

      const normalized = (data || []).map(normalizeSweet);
      console.log("Fetched sweets sample:", normalized[0]);
      setSweets(normalized);
    } catch (err) {
      console.error("Fetch sweets error:", err);
      setSweets([]);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchFoods(), fetchDrinks(), fetchSweets()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchFoods, fetchDrinks, fetchSweets]);

  // Handle retry
  const handleRetry = async () => {
    setIsLoading(true);
    await Promise.all([fetchFoods(), fetchDrinks(), fetchSweets()]);
    setIsLoading(false);
  };

  // Show server down component when server is offline
  if (isServerDown && !isLoading) {
    return <ServerDown onRetry={handleRetry} />;
  }

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/food"
          element={<Foods foods={foods} setFoods={setFoods} />}
        />
        <Route path="/drinks" element={<Drinks drinks={drinks} setDrinks={setDrinks} />} />
        <Route path="/sweets" element={<Sweets sweets={sweets} setSweets={setSweets} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route
          path="/adminpanel"
          element={<AdminPanel foods={foods} setFoods={setFoods} />}
        />
        <Route
          path="/adminpanel-parent"
          element={<AdminPanelParent foods={foods} setFoods={setFoods} drinks={drinks} setDrinks={setDrinks} sweets={sweets} setSweets={setSweets} />}
        />
        <Route path="/view3d/:type/:id" element={<ItemViewer3D />} />
      </Routes>
    </Router>
  );
}

export default App;

