"use client";
import { useEffect, useState } from "react";
import { collaborateursService } from "@/lib/collaborateursService";
import { commissionsService } from "@/lib/commissionsService";
import { KPIData } from "@/types/collaborateur";
import styles from "./KPICards.module.css";

export default function KPICards() {
  const [kpiData, setKpiData] = useState<KPIData>({
    etpTotal: 0,
    caParEtp: 0,
    caAnnuelExtrapole: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadKPIs() {
      setLoading(true);
      try {
        const [etpTotal, caExtrapole, nombreCollaborateurs] = await Promise.all([
          collaborateursService.getEtpTotal(),
          commissionsService.getCAExtrapole(),
          collaborateursService.getCount()
        ]);

        const caParEtp = etpTotal > 0 ? caExtrapole / etpTotal : 0;

        setKpiData({
          etpTotal,
          caParEtp,
          caAnnuelExtrapole: caExtrapole,
          nombreCollaborateurs
        });
      } catch (error) {
        console.error("Erreur lors du chargement des KPIs:", error);
      }
      setLoading(false);
    }

    loadKPIs();
  }, []);

  const formatNumber = (value: number) => {
    return value.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("fr-FR", { 
      style: "currency", 
      currency: "EUR",
      maximumFractionDigits: 0 
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <i className="fas fa-spinner fa-spin"></i>
          Chargement des indicateurs...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.kpiCard}>
        <div className={styles.icon}>
          <i className="fas fa-users"></i>
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>ETP Total</h3>
          <div className={styles.value}>{kpiData.etpTotal.toFixed(2)}</div>
          <p className={styles.description}>
            Équivalent temps plein de l'agence
          </p>
        </div>
      </div>

      <div className={styles.kpiCard}>
        <div className={styles.icon}>
          <i className="fas fa-user-friends"></i>
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>Collaborateurs</h3>
          <div className={styles.value}>{kpiData.nombreCollaborateurs}</div>
          <p className={styles.description}>
            Nombre de personnes dans l'agence
          </p>
        </div>
      </div>

      <div className={styles.kpiCard}>
        <div className={styles.icon}>
          <i className="fas fa-chart-line"></i>
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>CA / ETP</h3>
          <div className={styles.value}>
            {formatCurrency(kpiData.caParEtp)}
          </div>
          <p className={styles.description}>
            CA extrapolé par équivalent temps plein
          </p>
        </div>
      </div>
    </div>
  );
} 