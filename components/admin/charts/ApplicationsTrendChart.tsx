"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import {
  chartColors,
  getChartFont,
  tooltipStyle,
} from "@/components/admin/charts/chart-theme";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
);

interface ApplicationsTrendChartProps {
  items: { label: string; value: number }[];
}

export default function ApplicationsTrendChart({
  items,
}: ApplicationsTrendChartProps) {
  const font = getChartFont();
  const maxValue = Math.max(...items.map((item) => item.value), 4);

  return (
    <div className="h-56 md:h-64">
      <Line
        aria-label="กราฟเส้นแสดงจำนวนคำร้องในแต่ละเดือน"
        role="img"
        data={{
          labels: items.map((item) => item.label),
          datasets: [
            {
              data: items.map((item) => item.value),
              borderColor: chartColors.line,
              backgroundColor: chartColors.lineFill,
              borderWidth: 2,
              fill: true,
              tension: 0.35,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: "#ffffff",
              pointBorderColor: chartColors.line,
              pointBorderWidth: 2,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          layout: { padding: { top: 8 } },
          plugins: {
            legend: { display: false },
            tooltip: {
              ...tooltipStyle,
              callbacks: { label: (context) => `${context.parsed.y} คำร้อง` },
            },
          },
          scales: {
            x: {
              ticks: { color: chartColors.muted, font: { family: font } },
              grid: { display: false },
              border: { display: false },
            },
            y: {
              beginAtZero: true,
              suggestedMax: maxValue,
              ticks: {
                precision: 0,
                maxTicksLimit: 5,
                color: chartColors.muted,
                font: { family: font },
              },
              grid: { color: chartColors.grid },
              border: { display: false },
            },
          },
        }}
      />
    </div>
  );
}
