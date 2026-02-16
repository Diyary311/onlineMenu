import React from "react";
import RotatingText from "./RotatingText";
import MenueButton from "./MenueButton";
function Home() {
  return (
    <div>
      <RotatingText
        texts={["Welcome", "To", "YourName", "Resturant!"]}
        mainClassName="px-2 sm:px-2 md:px-3 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
        staggerFrom={"last"}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-120%" }}
        staggerDuration={0.025}
        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        rotationInterval={2000}
        textSize="text-xl md:text-2xl"
      />
      {/*buttons */}
      <MenueButton />
    </div>
  );
}

export default Home;
