import React from "react";
import { PieChart } from "@mui/x-charts";

const PieChartManagers = ({ data }) => {
  // Function to count occurrences of each development manager
  const countManagers = () => {
    let counts = {};
    data.forEach((item) => {
      if (item["מנהל פיתוח עסקי"] !== "") {
        let manager = item["מנהל פיתוח עסקי"];
        counts[manager] = counts[manager] ? counts[manager] + 1 : 1;
      }
    });
    return counts;
  };

  // Prepare data for chart
  const managerCounts = countManagers();
  const labels = Object.keys(managerCounts);
  const values = Object.values(managerCounts);

  // Custom colors for the pie chart
  const customColors = [
    "#FF204E",
    "#A0153E",
    "#5D0E41",
    "#00224D",
    "#401F71",
    "#824D74",
  ];

  return (
    <div>
      <h2>דיאגרמה לפי כמויות</h2>
      <div className="d-flex justify-content-center" dir="rtl">
        <PieChart className=""
          series={[
            {
              data: labels.map((label, index) => ({
                id: index,
                value: values[index],
                label: label,
                color: customColors[index % customColors.length], // Use modulo to repeat colors if needed
              })),
            },
          ]}
          width={600}  // Adjusted width for wider chart
          height={300} // Adjusted height for taller chart
        />
      </div>
    </div>
  );
};

export default PieChartManagers;
