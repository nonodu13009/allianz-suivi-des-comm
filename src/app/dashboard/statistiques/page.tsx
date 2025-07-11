"use client";
import Header from "../../components/Header";
import styles from "../dashboard.module.css";
import StatsLineChart from "./StatsLineChart";
import MoyenneMensuelleTable from "./MoyenneMensuelleTable";
import ComparaisonCAProjetéTable from "./ComparaisonCAProjetéTable";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const MONTHS = [
  "janvier", "fevrier", "mars", "avril", "mai", "juin",
  "juillet", "aout", "septembre", "octobre", "novembre", "decembre"
];

// Définition du type pour un mois de commissions
interface CommissionMonth {
  iard: number;
  vie: number;
  courtage: number;
  profits: number;
  charges: number;
}

export default function StatistiquesPage() {
  const getVisibleYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 4 }, (_, i) => (currentYear - i).toString());
  };

  const [dataByYear, setDataByYear] = useState<Record<string, Record<string, CommissionMonth>>>({});
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState<string[]>(getVisibleYears());

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "commissions"));
        const allYears = querySnapshot.docs.map(doc => doc.id).sort((a, b) => parseInt(b) - parseInt(a));
        const currentYear = new Date().getFullYear();
        const visible = allYears.filter(y => parseInt(y) >= currentYear - 3);
        setYears(visible.length > 0 ? visible : getVisibleYears());
        const data: Record<string, Record<string, CommissionMonth>> = {};
        querySnapshot.docs.forEach(doc => {
          if (visible.includes(doc.id)) {
            data[doc.id] = doc.data() as Record<string, CommissionMonth>;
          }
        });
        setDataByYear(data);
      } catch {
        setDataByYear({});
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Calcul des stats pour chaque année (factorisé pour les deux tableaux)
  const moyenneRows = years.map(year => {
    const yearData = dataByYear[year] || {};
    let total = 0;
    let moisValides = 0;
    MONTHS.forEach(mois => {
      const d = yearData[mois] || {iard:0,vie:0,courtage:0,profits:0,charges:0};
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

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        {loading ? (
          <div style={{color:'#764ba2',textAlign:'center',marginTop:'2rem',fontWeight:600}}>Chargement des statistiques…</div>
        ) : (
          <>
            <StatsLineChart dataByYear={dataByYear} years={years} />
            <MoyenneMensuelleTable dataByYear={dataByYear} years={years} />
            <ComparaisonCAProjetéTable moyenneRows={moyenneRows} />
          </>
        )}
      </main>
    </div>
  );
} 