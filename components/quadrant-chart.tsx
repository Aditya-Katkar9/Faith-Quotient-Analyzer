"use client"

import { useState } from "react"

interface QuadrantChartProps {
  x: number // -1 to 1 (Material to Spiritual)
  y: number // -1 to 1 (Negative to Positive)
  label: string
  quote: string
}

export function QuadrantChart({ x, y, label, quote }: QuadrantChartProps) {
  const [hoveredQuadrant, setHoveredQuadrant] = useState<string | null>(null)

  // Convert coordinates from -1,1 range to SVG coordinates
  const svgX = ((x + 1) / 2) * 400 + 50 // 50-450 range with padding
  const svgY = ((1 - y) / 2) * 400 + 50 // Invert Y axis, 50-450 range with padding

  const quadrants = [
    {
      id: "spiritual-positive",
      x: 275,
      y: 125,
      title: "Spiritually Uplifting",
      description: "High spiritual content with positive sentiment",
      color: "text-emerald-400",
      bgColor: "fill-emerald-500/10",
    },
    {
      id: "material-positive",
      x: 125,
      y: 125,
      title: "Worldly Positive",
      description: "Material focus with positive outlook",
      color: "text-blue-400",
      bgColor: "fill-blue-500/10",
    },
    {
      id: "spiritual-negative",
      x: 275,
      y: 375,
      title: "Spiritual Challenge",
      description: "Spiritual themes with challenging content",
      color: "text-purple-400",
      bgColor: "fill-purple-500/10",
    },
    {
      id: "material-negative",
      x: 125,
      y: 375,
      title: "Contemplative",
      description: "Material concerns with reflective tone",
      color: "text-orange-400",
      bgColor: "fill-orange-500/10",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-white text-lg font-semibold mb-2">Quote Positioning</h3>
        <p className="text-slate-400 text-sm">
          Your quote is positioned in the <span className="text-emerald-400 font-medium">{label}</span> quadrant
        </p>
      </div>

      <div className="bg-slate-700/30 rounded-lg p-6 overflow-x-auto">
        <svg width="500" height="500" viewBox="0 0 500 500" className="w-full max-w-lg mx-auto">
          {/* Background quadrants */}
          {quadrants.map((quadrant) => (
            <rect
              key={quadrant.id}
              x={quadrant.id.includes("material") ? 50 : 250}
              y={quadrant.id.includes("positive") ? 50 : 250}
              width="200"
              height="200"
              className={`${quadrant.bgColor} transition-all duration-300 cursor-pointer ${
                hoveredQuadrant === quadrant.id ? "opacity-30" : "opacity-10"
              }`}
              onMouseEnter={() => setHoveredQuadrant(quadrant.id)}
              onMouseLeave={() => setHoveredQuadrant(null)}
            />
          ))}

          {/* Grid lines */}
          <line x1="50" y1="250" x2="450" y2="250" stroke="#475569" strokeWidth="2" />
          <line x1="250" y1="50" x2="250" y2="450" stroke="#475569" strokeWidth="2" />

          {/* Axis labels */}
          <text x="25" y="130" fill="#94a3b8" fontSize="12" textAnchor="middle" transform="rotate(-90, 25, 130)">
            Positive
          </text>
          <text x="25" y="370" fill="#94a3b8" fontSize="12" textAnchor="middle" transform="rotate(-90, 25, 370)">
            Negative
          </text>
          <text x="150" y="480" fill="#94a3b8" fontSize="12" textAnchor="middle">
            Material
          </text>
          <text x="350" y="480" fill="#94a3b8" fontSize="12" textAnchor="middle">
            Spiritual
          </text>

          {/* Quote position dot */}
          <circle cx={svgX} cy={svgY} r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />

          {/* Quote position label */}
          <circle
            cx={svgX}
            cy={svgY}
            r="20"
            fill="none"
            stroke="#10b981"
            strokeWidth="1"
            strokeDasharray="3,3"
            className="animate-ping"
          />

          {/* Quadrant labels */}
          {quadrants.map((quadrant) => (
            <g key={`label-${quadrant.id}`}>
              <text
                x={quadrant.x}
                y={quadrant.y}
                fill="#ffffff"
                fontSize="14"
                fontWeight="600"
                textAnchor="middle"
                className={hoveredQuadrant === quadrant.id ? "opacity-100" : "opacity-70"}
              >
                {quadrant.title}
              </text>
              {hoveredQuadrant === quadrant.id && (
                <text
                  x={quadrant.x}
                  y={quadrant.y + 20}
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="middle"
                  className="opacity-90"
                >
                  {quadrant.description}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Quote display */}
      <div className="bg-slate-700/50 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">Analyzed Quote:</h4>
        <blockquote className="text-slate-300 italic border-l-4 border-emerald-500 pl-4">"{quote}"</blockquote>
      </div>

      {/* Coordinate details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-slate-400 text-sm">Spiritual-Material Axis</div>
          <div className="text-white font-mono text-lg">{x.toFixed(3)}</div>
          <div className="text-xs text-slate-500">{x > 0 ? "More Spiritual" : "More Material"}</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-slate-400 text-sm">Positive-Negative Axis</div>
          <div className="text-white font-mono text-lg">{y.toFixed(3)}</div>
          <div className="text-xs text-slate-500">{y > 0 ? "More Positive" : "More Negative"}</div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {quadrants.map((quadrant) => (
          <div
            key={`legend-${quadrant.id}`}
            className="flex items-center gap-2 p-2 bg-slate-700/30 rounded cursor-pointer hover:bg-slate-700/50 transition-colors"
            onMouseEnter={() => setHoveredQuadrant(quadrant.id)}
            onMouseLeave={() => setHoveredQuadrant(null)}
          >
            <div className={`w-3 h-3 rounded-full bg-current ${quadrant.color}`} />
            <span className="text-slate-300">{quadrant.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
