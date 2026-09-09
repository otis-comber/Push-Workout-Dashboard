import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  Legend,
);

export interface MultiLineSeries {
  label: string;
  color: string;
  points: { x: number; y: number }[];
}

interface MultiLineChartProps {
  series: MultiLineSeries[];
  xMin?: number;
}

export function MultiLineChart({ series, xMin }: MultiLineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        datasets: series.map((s) => ({
          label: s.label,
          data: s.points,
          borderColor: s.color,
          backgroundColor: s.color,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: s.color,
          pointBorderColor: "#050505",
          pointBorderWidth: 2,
          tension: 0.3,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "nearest", axis: "x", intersect: false },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              pointStyle: "line",
              boxWidth: 20,
              padding: 16,
              generateLabels: () =>
                series.map((s, i) => ({
                  text: s.label,
                  fontColor: s.color,
                  strokeStyle: s.color,
                  fillStyle: s.color,
                  pointStyle: "line" as const,
                  datasetIndex: i,
                })),
            },
          },
          tooltip: {
            backgroundColor: "#111111",
            titleColor: "#ffffff",
            bodyColor: "#e5e7eb",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            padding: 10,
            callbacks: {
              title: (items) =>
                new Date(items[0].parsed.x!).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
            },
          },
        },
        scales: {
          x: {
            type: "linear",
            min: xMin,
            grid: { color: "rgba(255,255,255,0.06)" },
            ticks: {
              color: "#9ca3af",
              callback: (value) =>
                new Date(value as number).toLocaleDateString(undefined, {
                  month: "short",
                  year: "2-digit",
                }),
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(255,255,255,0.06)" },
            ticks: {
              color: "#9ca3af",
              font: { size: 14 },
              callback: (value) => `${value} kg`,
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [series, xMin]);

  return (
    <div className="h-80">
      <canvas ref={canvasRef} />
    </div>
  );
}
