import React, { useRef } from "react";
import SweetCard from "./SweetCard";

function SweetSlider({ title, items }) {
    const scrollRef = useRef(null);

    return (
        <div className="my-6">
            <h2
                className="text-xl md:text-2xl font-bold mb-4 px-2"
                style={{ color: "#7C3AED" }}
            >
                {title}
            </h2>

            <div className="relative">
                {/* Left gradient */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />

                <div
                    ref={scrollRef}
                    className="flex gap-3 overflow-x-auto pb-4 px-4 scrollbar-hide"
                    style={{ scrollBehavior: "smooth" }}
                >
                    {items.map((item) => (
                        <SweetCard
                            key={item.Id}
                            id={item.Id}
                            name={item.Name}
                            price={item.Price}
                            size={item.Size}
                            image={item.ImageUrl}
                            type="sweet"
                        />
                    ))}
                </div>

                {/* Right gradient */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
            </div>
        </div>
    );
}

export default SweetSlider;
