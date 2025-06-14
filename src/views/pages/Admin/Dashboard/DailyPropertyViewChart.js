import React from "react";
import Chart from "react-apexcharts";

/**
 * 📊 Daily Property View Chart
 * This chart displays daily user activity for properties, such as views and inquiries.
 * @param {Object} props
 * @param {Object} props.data - Contains dailyChartData (categories, views, inquiries)
 */
const DailyPropertyViewChart = ({ data }) => {
    if (!data) return null; // Optional: show a loader or fallback

    const options = {
        chart: {
            height: 350,
            type: "area",
            toolbar: {
                show: false,
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
            categories: data.categories || [],
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
            data: data.views || [],
        },
        {
            name: "Inquiries",
            data: data.inquiries || [],
        },
    ];

    return (
        <div id="chart">
            <Chart options={options} series={series} type="area" height={350} />
        </div>
    );
};

export default DailyPropertyViewChart;
