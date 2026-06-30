import React, { useState } from 'react';
import { motion } from 'motion/react';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

// 1. AN AREA/LINE CHART
export const AreaChart: React.FC<{
  data: ChartDataPoint[];
  gradientColor?: string;
  height?: number;
}> = ({ data, gradientColor = 'rgb(99, 102, 241)', height = 200 }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const minVal = 0;
  const range = maxVal - minVal;

  const padding = 40;
  const chartHeight = height - padding * 2;
  const chartWidth = 500;
  const width = chartWidth + padding * 2;

  // Compute points
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((d.value - minVal) / range) * chartHeight;
    return { x, y, val: d.value, label: d.label };
  });

  // Build path string
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Build area path string (extends down to the bottom of the chart)
  const areaPath = `
    ${linePath}
    L ${points[points.length - 1].x} ${padding + chartHeight}
    L ${points[0].x} ${padding + chartHeight}
    Z
  `;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradientColor} stopOpacity={0.4} />
            <stop offset="100%" stopColor={gradientColor} stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={gradientColor} />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padding + chartHeight * ratio;
          const val = Math.round(maxVal - ratio * range);
          return (
            <g key={idx} className="opacity-20 dark:opacity-10">
              <line
                x1={padding}
                y1={y}
                x2={padding + chartWidth}
                y2={y}
                stroke="currentColor"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text
                x={padding - 8}
                y={y + 4}
                className="text-[10px] font-mono fill-current font-bold text-slate-500 text-right"
                textAnchor="end"
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* Fill Area with transition */}
        <motion.path
          d={areaPath}
          fill="url(#areaGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Stroke Line with dash animation */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Interaction points */}
        {points.map((p, i) => (
          <g
            key={i}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="cursor-pointer"
          >
            {/* Transparent large circle for easy hovering */}
            <circle cx={p.x} cy={p.y} r={12} fill="transparent" />

            {/* Pulsing point */}
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === i ? 6 : 4}
              fill={hoveredIndex === i ? '#f43f5e' : gradientColor}
              stroke="white"
              strokeWidth={1.5}
              className="transition-all duration-150"
            />
          </g>
        ))}

        {/* X Axis labels */}
        {points.map((p, i) => {
          // Show every label or thin them out for mobile
          if (data.length > 8 && i % 2 !== 0) return null;
          return (
            <text
              key={i}
              x={p.x}
              y={height - 12}
              className="text-[10px] font-medium font-sans fill-current text-slate-400 dark:text-slate-500"
              textAnchor="middle"
            >
              {p.label}
            </text>
          );
        })}
      </svg>

      {/* Floating interactive tooltip */}
      {hoveredIndex !== null && (
        <div
          className="absolute p-3 rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 text-white text-xs shadow-xl border border-white/10 backdrop-blur-md pointer-events-none transition-all duration-150"
          style={{
            left: `${(points[hoveredIndex].x / width) * 100}%`,
            top: `${(points[hoveredIndex].y / height) * 100 - 35}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <p className="font-bold tracking-tight text-white">{points[hoveredIndex].label}</p>
          <p className="font-mono text-pink-400 font-extrabold mt-0.5">Marks: {points[hoveredIndex].val}%</p>
        </div>
      )}
    </div>
  );
};


// 2. A GLOWING BAR CHART
export const BarChart: React.FC<{
  data: ChartDataPoint[];
  colorTheme?: 'indigo' | 'pink' | 'emerald' | 'orange';
  height?: number;
}> = ({ data, colorTheme = 'indigo', height = 200 }) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const padding = 40;
  const chartHeight = height - padding * 2;
  const chartWidth = 500;
  const width = chartWidth + padding * 2;

  const barWidth = Math.min((chartWidth / data.length) * 0.6, 32);
  const barGap = (chartWidth - barWidth * data.length) / (data.length - 1 || 1);

  const getThemeGradient = () => {
    switch (colorTheme) {
      case 'pink':
        return ['#ec4899', '#8b5cf6'];
      case 'emerald':
        return ['#10b981', '#06b6d4'];
      case 'orange':
        return ['#f97316', '#ec4899'];
      default:
        return ['#6366f1', '#a855f7'];
    }
  };

  const gradColors = getThemeGradient();

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id={`barGrad-${colorTheme}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradColors[0]} />
            <stop offset="100%" stopColor={gradColors[1]} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padding + chartHeight * ratio;
          return (
            <line
              key={idx}
              x1={padding}
              y1={y}
              x2={padding + chartWidth}
              y2={y}
              className="stroke-slate-200 dark:stroke-slate-800 opacity-50 dark:opacity-20"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Bars rendering */}
        {data.map((d, i) => {
          const x = padding + i * (barWidth + barGap) + barGap / 2;
          const ratio = d.value / maxVal;
          const barH = chartHeight * ratio;
          const y = padding + chartHeight - barH;

          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
              className="cursor-pointer"
            >
              {/* Backing full-height bar for hover triggers */}
              <rect
                x={x - barGap / 4}
                y={padding}
                width={barWidth + barGap / 2}
                height={chartHeight}
                fill="transparent"
              />

              {/* Glowing active bar */}
              <motion.rect
                x={x}
                y={padding + chartHeight} // Start from bottom
                width={barWidth}
                rx={6}
                ry={6}
                fill={`url(#barGrad-${colorTheme})`}
                initial={{ height: 0, y: padding + chartHeight }}
                animate={{ height: barH, y: y }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.04 }}
                className="transition-all duration-200"
                style={{
                  filter: hoveredBar === i ? 'drop-shadow(0 4px 12px rgba(99, 102, 241, 0.4))' : 'none',
                  opacity: hoveredBar !== null && hoveredBar !== i ? 0.7 : 1,
                }}
              />

              {/* Small dynamic value text on top of bar on hover */}
              {hoveredBar === i && (
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-800 dark:fill-white font-mono"
                >
                  {d.value}
                </text>
              )}

              {/* X Axis Label */}
              <text
                x={x + barWidth / 2}
                y={height - 12}
                className="text-[9px] sm:text-[10px] font-semibold fill-slate-400 dark:fill-slate-500"
                textAnchor="middle"
              >
                {d.label.length > 8 ? `${d.label.substring(0, 6)}..` : d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};


// 3. DONUT/PIE CHART WITH LEGEND
export const DonutChart: React.FC<{
  data: ChartDataPoint[];
  title?: string;
}> = ({ data, title }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  // Compute angles and strokes
  let accumulatedPercent = 0;
  const radius = 55;
  const strokeWidth = 14;
  const circ = 2 * Math.PI * radius; // Approx 345.57

  const slices = data.map((d, i) => {
    const percent = d.value / (total || 1);
    const strokeDasharray = `${percent * circ} ${circ}`;
    const strokeDashoffset = -accumulatedPercent * circ;
    accumulatedPercent += percent;

    // Standard high contrast default colors if none provided
    const color = d.color || [
      '#6366f1', // indigo
      '#ec4899', // pink
      '#10b981', // emerald
      '#f97316', // orange
      '#06b6d4', // cyan
    ][i % 5];

    return {
      ...d,
      percent,
      strokeDasharray,
      strokeDashoffset,
      color,
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-6 p-4">
      <div className="relative w-40 h-40 flex-shrink-0">
        <svg viewBox="0 0 140 140" className="w-full h-full transform -rotate-90 overflow-visible">
          {slices.map((slice, i) => (
            <motion.circle
              key={i}
              cx={70}
              cy={70}
              r={radius}
              fill="transparent"
              stroke={slice.color}
              strokeWidth={hoveredIdx === i ? strokeWidth + 3 : strokeWidth}
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset}
              strokeLinecap="round"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer transition-all duration-150"
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: slice.strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          ))}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none text-center">
          {hoveredIdx !== null ? (
            <>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {slices[hoveredIdx].label}
              </span>
              <span className="text-lg font-black font-mono text-slate-800 dark:text-white">
                {Math.round(slices[hoveredIdx].percent * 100)}%
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                ({slices[hoveredIdx].value} Count)
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {title || 'Total'}
              </span>
              <span className="text-xl font-black font-mono text-slate-800 dark:text-white">
                {total}
              </span>
              <span className="text-[10px] font-semibold text-slate-500">Entries</span>
            </>
          )}
        </div>
      </div>

      {/* Legend Grid */}
      <div className="flex flex-col gap-2.5 w-full sm:w-auto">
        {slices.map((slice, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border border-solid transition-colors cursor-pointer ${
              hoveredIdx === i
                ? 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                : 'bg-transparent border-transparent'
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{slice.label}</span>
              <span className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">
                {slice.value} Count ({Math.round(slice.percent * 100)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
