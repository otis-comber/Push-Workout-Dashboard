import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
);

interface LineChartProps {
  labels: string[];
  data: number[];
  seriesLabel: string;
  color?: string;
}

export function LineChart({
  labels,
  data,
  seriesLabel,
  color = "#34d399",
}: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: seriesLabel,
            data,
            borderColor: color,
            backgroundColor: `${color}1a`,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: color,
            pointBorderColor: "#050505",
            pointBorderWidth: 2,
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#111111",
            titleColor: "#ffffff",
            bodyColor: "#e5e7eb",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            padding: 10,
            displayColors: false,
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(255,255,255,0.06)" },
            ticks: { color: "#9ca3af" },
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(255,255,255,0.06)" },
            ticks: { color: "#9ca3af", precision: 0 },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [data, labels, seriesLabel, color]);

  return (
    <div className="h-64">
      <canvas ref={canvasRef} />
    </div>
  );
}
