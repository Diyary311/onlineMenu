// src/Components/Foods/MenuSlider.jsx
import React from "react";
import Item_Card from "./Item_Card";

function MenuSlider({ title, items = [] }) {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg py-4 md:py-6 lg:py-8 px-3 sm:px-4 md:px-6">
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6 text-gray-800 capitalize">
        {title}
      </h2>

      <div className="relative">
        <div
          className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
        >
          {items.map((item) => {
            const id = item.Id ?? 0;
            const name = item.Name ?? "";
            const image = item.ImageUrl ?? "";
            const price = item.Price ?? "N/A";
            const size = item.Size ?? "Regular";

            return (
              <Item_Card
                key={id}
                id={id}
                name={name}
                price={price}
                size={size}
                image={image}
                type="food"
              />
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent"></div>
      </div>

      <p className="text-center text-gray-500 text-xs md:text-sm mt-2 md:mt-3 lg:hidden">
        ← Swipe to explore more →
      </p>
    </div>
  );
}

export default MenuSlider;
