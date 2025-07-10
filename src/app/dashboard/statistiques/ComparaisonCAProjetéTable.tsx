"use client";
import styles from "./MoyenneMensuelleTable.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

function formatMoney(val: number, showSign = false) {
  if (typeof val !== "number" || isNaN(val)) return "-";
  const sign = showSign && val > 0 ? "+" : (showSign && val < 0 ? "–" : "");
  return sign + Math.abs(val).toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " €";
}

export default function ComparaisonCAProjetéTable({ moyenneRows }: {
  moyenneRows: Array<{ year: string, moisValides: number, total: number, moyenne: number }>;
}) {
  // Trier les années du plus récent au plus ancien
  const sortedRows = [...moyenneRows].sort((a, b) => parseInt(b.year) - parseInt(a.year));
  const currentYear = new Date().getFullYear().toString();

  // Calculer le CA annuel pour chaque année (projeté pour l'année en cours)
  const caByYear = sortedRows.map((row, idx) => {
    const isCurrent = row.year === currentYear;
    const caAnnuel = isCurrent ? row.moyenne * 12 : row.total;
    // Chercher l'année précédente
    const prev = sortedRows[idx + 1];
    let ecart = null;
    let ecartPct = null;
    if (prev) {
      const caPrev = prev.year === currentYear ? prev.moyenne * 12 : prev.total;
      ecart = caAnnuel - caPrev;
      ecartPct = caPrev !== 0 ? ((caAnnuel - caPrev) / caPrev) * 100 : null;
    }
    return {
      year: row.year,
      caAnnuel,
      prevYear: prev ? prev.year : null,
      ecart,
      ecartPct
    };
  });

  return (
    <div className={styles.tableCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>Comparaison CA annuel année à année</h3>
        <span className={styles.info} title="Pour chaque année, on affiche la différence avec l'année précédente (en valeur et en %).">
          <FontAwesomeIcon icon={faInfoCircle} />
        </span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Année</th>
            <th>CA annuel</th>
            <th>Écart année précédente</th>
          </tr>
        </thead>
        <tbody>
          {caByYear.map(row => (
            <tr key={row.year} className={row.year === currentYear ? styles.currentYear : ""}>
              <td>{row.year}</td>
              <td>{formatMoney(row.caAnnuel)}</td>
              <td>
                {row.prevYear ? (
                  <>
                    {formatMoney(row.ecart || 0, true)}
                    {row.ecartPct !== null && (
                      <span style={{marginLeft:4, color:'#888', fontWeight:500}}>
                        ({row.ecartPct > 0 ? "+" : "–"}{Math.abs(row.ecartPct).toFixed(1)} %)
                      </span>
                    )}
                    <span style={{marginLeft:4, color:'#aaa', fontSize:'0.97em'}}>/ {row.prevYear}</span>
                  </>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 