import React from "react";
import Chart from "react-apexcharts";

/**
 * 📊 Daily Property View Chart
 * This chart displays daily user activity for properties, such as views and inquiries.
 */
const DailyPropertyViewChart = () => {
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
                "2025-05-14T00:00:00.000Z",
                "2025-05-15T00:00:00.000Z",
                "2025-05-16T00:00:00.000Z",
                "2025-05-17T00:00:00.000Z",
                "2025-05-18T00:00:00.000Z",
                "2025-05-19T00:00:00.000Z",
                "2025-05-20T00:00:00.000Z",
            ],
        },
        tooltip: {
            x: {
                format: "dd/MM/yy",
            },
        },
    };

    const series = [
        {
            name: "Property Views",
            data: [120, 200, 150, 300, 250, 320, 280],
        },
        {
            name: "Inquiries",
            data: [10, 30, 20, 40, 25, 35, 30],
        },
    ];

    return (
        <div id="chart">
            <Chart options={options} series={series} type="area" height={350} />
        </div>
    );
};

export default DailyPropertyViewChart;
