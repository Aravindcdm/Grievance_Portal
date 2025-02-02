// src/components/Charts.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import "../styles/Charts.css"; // Import the CSS file

const Charts = ({ grievances }) => {
    const departmentChartRef = useRef(null);
    const subjectChartRef = useRef(null);
    let departmentChartInstance = useRef(null);
    let subjectChartInstance = useRef(null);

    useEffect(() => {
        if (departmentChartInstance.current) {
            departmentChartInstance.current.destroy();
        }
        if (subjectChartInstance.current) {
            subjectChartInstance.current.destroy();
        }

        const departmentCounts = grievances.reduce((acc, g) => {
            acc[g.department] = (acc[g.department] || 0) + 1;
            return acc;
        }, {});

        const subjectCounts = grievances.reduce((acc, g) => {
            acc[g.subject] = (acc[g.subject] || 0) + 1;
            return acc;
        }, {});

        if (departmentChartRef.current) {
            departmentChartInstance.current = new Chart(departmentChartRef.current, {
                type: 'pie',
                data: {
                    labels: Object.keys(departmentCounts),
                    datasets: [{
                        data: Object.values(departmentCounts),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800' , '#ff4d4d'],
                    }],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                },
            });
        }

        if (subjectChartRef.current) {
            subjectChartInstance.current = new Chart(subjectChartRef.current, {
                type: 'pie',
                data: {
                    labels: Object.keys(subjectCounts),
                    datasets: [{
                        data: Object.values(subjectCounts),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800' , '#ff4d4d'],
                    }],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                },
            });
        }

        return () => {
            if (departmentChartInstance.current) departmentChartInstance.current.destroy();
            if (subjectChartInstance.current) subjectChartInstance.current.destroy();
        };
    }, [grievances]);

    return (
        <div className="chart-container">
            <div className="chart-box">
                <h3>Grievances by Department</h3>
                <canvas ref={departmentChartRef}></canvas>
            </div>
            <div className="chart-box">
                <h3>Grievances by Subject</h3>
                <canvas ref={subjectChartRef}></canvas>
            </div>
        </div>
    );
};

export default Charts;
