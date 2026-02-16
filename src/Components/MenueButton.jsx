import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function MenuButton() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="flex flex-col text-2xl gap-6 mt-20 items-center">
      {/* Food */}
      <div
        className="relative"
        onMouseEnter={() => setHovered("food")}
        onMouseLeave={() => setHovered(null)}
      >
        <Link to="/food">
          <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-yellow-500 text-white shadow-md hover:scale-105 transition">
            Foods
          </button>
        </Link>
        <AnimatePresence>
          {hovered === "food" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-full ml-4 p-3 bg-white shadow-lg rounded-lg text-black text-base"
            >
              🍕 Pizza
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Drinks */}
      <div
        className="relative"
        onMouseEnter={() => setHovered("drinks")}
        onMouseLeave={() => setHovered(null)}
      >
        <Link to="/drinks">
          <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md hover:scale-105 transition">
            Drinks
          </button>
        </Link>
        <AnimatePresence>
          {hovered === "drinks" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-full ml-4 p-3 bg-white shadow-lg rounded-lg text-black text-base"
            >
              🥤 CocaCola
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sweets */}
      <div
        className="relative"
        onMouseEnter={() => setHovered("sweets")}
        onMouseLeave={() => setHovered(null)}
      >
        <Link to="/sweets">
          <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-400 text-white shadow-md hover:scale-105 transition">
            Sweets
          </button>
        </Link>
        <AnimatePresence>
          {hovered === "sweets" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-full ml-4 p-3 bg-white shadow-lg rounded-lg text-black text-base"
            >
              🍩 Donut
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MenuButton;
