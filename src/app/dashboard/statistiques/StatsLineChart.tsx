"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import styles from "./StatsLineChart.module.css";

const MONTHS = [
  "janvier", "fevrier", "mars", "avril", "mai", "juin",
  "juillet", "aout", "septembre", "octobre", "novembre", "decembre"
];

const MONTHS_LABELS = {
  janvier: "Janvier",
  fevrier: "Février",
  mars: "Mars",
  avril: "Avril",
  mai: "Mai",
  juin: "Juin",
  juillet: "Juillet",
  aout: "Août",
  septembre: "Septembre",
  octobre: "Octobre",
  novembre: "Novembre",
  decembre: "Décembre"
};

const LINES = [
  { key: "total", label: "Total commissions" },
  { key: "iard", label: "Commissions IARD" },
  { key: "vie", label: "Commissions Vie" },
  { key: "courtage", label: "Commissions Courtage" },
  { key: "profits", label: "Profits exceptionnels" },
  { key: "charges", label: "Charges agence" },
  { key: "prel_julien", label: "Prélèvements Julien" },
  { key: "prel_jeanmichel", label: "Prélèvements Jean-Michel" },
];

const YEAR_COLORS = [
  "#667eea", // bleu
  "#764ba2", // violet
  "#27ae60", // vert
  "#f39c12", // orange
  "#e74c3c", // rouge
  "#00b894", // turquoise
];

function formatMoney(val: number) {
  if (typeof val !== "number" || isNaN(val)) return "-";
  return val.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " €";
}

export default function StatsLineChart({
  dataByYear,
  years,
  defaultLine = "total"
}: {
  dataByYear: Record<string, Record<string, unknown>>;
  years: string[];
  defaultLine?: string;
}) {
  const [selectedLine, setSelectedLine] = useState(defaultLine);

  // Formatage des données pour Recharts :
  // [{ mois: "janvier", "2025": 1234, "2024": 2345, ... }, ...]
  const chartData = MONTHS.map((mois) => {
    const entry: Record<string, unknown> = { mois: MONTHS_LABELS[mois as keyof typeof MONTHS_LABELS] };
    years.forEach((year) => {
      const d = dataByYear[year]?.[mois] as Record<string, number> || {};
      if (selectedLine === "total") {
        entry[year] = (d.iard || 0) + (d.vie || 0) + (d.courtage || 0) + (d.profits || 0);
      } else {
        entry[year] = d[selectedLine] || 0;
      }
    });
    return entry;
  });

  return (
    <div className={styles.chartCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>Évolution annuelle</h3>
        <select
          className={styles.select}
          value={selectedLine}
          onChange={e => setSelectedLine(e.target.value)}
          aria-label="Choisir la ligne à afficher"
        >
          {LINES.map(line => (
            <option key={line.key} value={line.key}>{line.label}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={chartData} margin={{ top: 24, right: 32, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e6ecf7" />
          <XAxis dataKey="mois" tick={{ fontSize: 13, fill: "#888" }} />
          <YAxis tick={{ fontSize: 13, fill: "#888" }} tickFormatter={v => v.toLocaleString("fr-FR")}/>
          <Tooltip
            contentStyle={{ background: "#fff", borderRadius: 12, boxShadow: "0 4px 16px rgba(102,126,234,0.10)", border: 'none', color: '#222' }}
            labelStyle={{ fontWeight: 700, color: '#764ba2' }}
            formatter={(value: number) => formatMoney(value)}
            separator=": "
          />
          <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 14, color: '#444' }} />
          {years.map((year, idx) => (
            <Line
              key={year}
              type="monotone"
              dataKey={year}
              stroke={YEAR_COLORS[idx % YEAR_COLORS.length]}
              strokeWidth={3}
              dot={{ r: 4, stroke: YEAR_COLORS[idx % YEAR_COLORS.length], strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 7 }}
              isAnimationActive={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 