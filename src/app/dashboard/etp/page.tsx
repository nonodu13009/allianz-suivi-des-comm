"use client";
import Header from "../../components/Header";
import KPICards from "./KPICards";
import CollaborateursTable from "./CollaborateursTable";
import styles from "../dashboard.module.css";

export default function EtpPage() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>Gestion des ETP</h1>
          <p className={styles.pageDescription}>
            Inventaire des collaborateurs et indicateurs de performance
          </p>
          
          <KPICards />
          <CollaborateursTable />
        </div>
      </main>
    </div>
  );
} 