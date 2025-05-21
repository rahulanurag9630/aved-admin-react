import React from "react";
import Chart from "react-apexcharts";

/**
 * 📊 Monthly Property View Chart
 * This chart displays monthly user activity for properties, such as views and inquiries.
 */
const MonthlyPropertyViews = () => {
    const options = {
        chart: {
            height: 350,
            type: "area",
            toolbar: {
                show: false, // Hide the toolbar entirely
            },
        },
        dataLabels: {
            enabled: false,
        },
        colors: ["#4CAF50", "#2196F3"], // Green for views, blue for inquiries
        stroke: {
            curve: "smooth",
        },
        xaxis: {
            type: "datetime",
            categories: [
                "2025-01-01T00:00:00.000Z",
                "2025-02-01T00:00:00.000Z",
                "2025-03-01T00:00:00.000Z",
                "2025-04-01T00:00:00.000Z",
                "2025-05-01T00:00:00.000Z",
                "2025-06-01T00:00:00.000Z",
                "2025-07-01T00:00:00.000Z",
            ],
        },
        tooltip: {
            x: {
                format: "MMM yyyy",
            },
        },
    };

    const series = [
        {
            name: "Property Views",
            data: [1200, 1800, 1600, 1900, 2100, 2300, 2500],
        },
        {
            name: "Inquiries",
            data: [120, 140, 135, 160, 170, 190, 200],
        },
    ];

    return (
        <div id="chart">
            <Chart options={options} series={series} type="area" height={350} />
        </div>
    );
};

export default MonthlyPropertyViews;
