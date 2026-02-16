import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Statistics({ foods, drinks, sweets }) {
  // Count food items by category
  const foodCategoryCounts = {};
  const foodsArray = foods || [];
  const drinksArray = drinks || [];
  const sweetsArray = sweets || [];

  foodsArray.forEach((f) => {
    const cat = f.Category || "Unknown";
    foodCategoryCounts[cat] = (foodCategoryCounts[cat] || 0) + 1;
  });

  // Count drink items by category
  const drinkCategoryCounts = {};
  drinksArray.forEach((d) => {
    const cat = d.Category || d.category || "Unknown";
    drinkCategoryCounts[cat] = (drinkCategoryCounts[cat] || 0) + 1;
  });

  // Count sweet items by category
  const sweetCategoryCounts = {};
  sweetsArray.forEach((s) => {
    const cat = s.Category || s.category || "Unknown";
    sweetCategoryCounts[cat] = (sweetCategoryCounts[cat] || 0) + 1;
  });

  // All categories (food + drink + sweet combined for detailed chart)
  const allCategoryCounts = { ...foodCategoryCounts };
  Object.entries(drinkCategoryCounts).forEach(([cat, count]) => {
    allCategoryCounts[cat] = (allCategoryCounts[cat] || 0) + count;
  });
  Object.entries(sweetCategoryCounts).forEach(([cat, count]) => {
    allCategoryCounts[cat] = (allCategoryCounts[cat] || 0) + count;
  });
  const allCategories = Object.keys(allCategoryCounts);

  // Total counts
  const foodOnlyCount = foodsArray.length;
  const drinkCount = drinksArray.length;
  const sweetCount = sweetsArray.length;

  // Chart data
  const barChartData = {
    labels: ["Food", "Drinks", "Sweets"],
    datasets: [
      {
        label: "Number of Items",
        data: [foodOnlyCount, drinkCount, sweetCount],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Item Statistics",
      },
    },
  };

  // Detailed category chart - use all categories
  const detailedChartData = {
    labels: allCategories.length > 0 ? allCategories : ["No Data"],
    datasets: [
      {
        label: "Number of Items",
        data: allCategories.length > 0 ? allCategories.map((cat) => allCategoryCounts[cat]) : [0],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Statistics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-blue-100 rounded-lg p-4 sm:p-6 shadow">
          <h3 className="text-sm sm:text-lg font-semibold text-blue-800">
            Total Food Items
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">{foodOnlyCount}</p>
        </div>
        <div className="bg-red-100 rounded-lg p-4 sm:p-6 shadow">
          <h3 className="text-sm sm:text-lg font-semibold text-red-800">
            Total Drink Items
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-red-600">{drinkCount}</p>
        </div>
        <div className="bg-yellow-100 rounded-lg p-4 sm:p-6 shadow">
          <h3 className="text-sm sm:text-lg font-semibold text-yellow-800">
            Total Sweet Items
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{sweetCount}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <Bar
            data={detailedChartData}
            options={{
              ...barChartOptions,
              plugins: {
                ...barChartOptions.plugins,
                title: {
                  ...barChartOptions.plugins.title,
                  text: "Detailed Category Statistics",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Statistics;
