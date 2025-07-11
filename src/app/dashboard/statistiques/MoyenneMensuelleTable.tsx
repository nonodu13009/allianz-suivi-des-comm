"use client";
import styles from "./MoyenneMensuelleTable.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const MONTHS = [
  "janvier", "fevrier", "mars", "avril", "mai", "juin",
  "juillet", "aout", "septembre", "octobre", "novembre", "decembre"
];

type CommissionMonth = {
  iard?: number;
  vie?: number;
  courtage?: number;
  profits?: number;
  charges?: number;
  prel_julien?: number;
  prel_jeanmichel?: number;
};

function formatMoney(val: number) {
  if (typeof val !== "number" || isNaN(val)) return "-";
  return val.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " €";
}

export default function MoyenneMensuelleTable({ dataByYear, years }: {
  dataByYear: Record<string, Record<string, unknown>>;
  years: string[];
}) {
  // Calcul des stats pour chaque année
  const rows = years.map(year => {
    const yearData = dataByYear[year] || {};
    let total = 0;
    let moisValides = 0;
    MONTHS.forEach(mois => {
      const d = (yearData[mois] || {}) as CommissionMonth;
      // Un mois est validé s'il y a au moins une commission ou des charges
      const hasData = (d.iard || 0) !== 0 || (d.vie || 0) !== 0 || (d.courtage || 0) !== 0 || (d.profits || 0) !== 0 || (d.charges || 0) !== 0;
      if (hasData) {
        const totalMois = (d.iard || 0) + (d.vie || 0) + (d.courtage || 0) + (d.profits || 0);
        total += totalMois;
        moisValides++;
      }
    });
    const moyenne = moisValides > 0 ? total / moisValides : 0;
    return {
      year,
      moisValides,
      total,
      moyenne
    };
  });

  const currentYear = new Date().getFullYear().toString();

  return (
    <div className={styles.tableCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>Moyenne mensuelle extrapolée</h3>
        <span className={styles.info} title="Seuls les mois avec au moins une commission ou des charges sont pris en compte. Pour l'année en cours, la moyenne est extrapolée sur les mois validés.">
          <FontAwesomeIcon icon={faInfoCircle} />
        </span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Année</th>
            <th>Mois validés</th>
            <th>Total commissions</th>
            <th>Moyenne mensuelle</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.year} className={row.year === currentYear ? styles.currentYear : ""}>
              <td>{row.year}</td>
              <td>{row.moisValides}</td>
              <td>{formatMoney(row.total)}</td>
              <td className={styles.moyenneCell}>{formatMoney(row.moyenne)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 