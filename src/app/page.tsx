import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>Allianz Marseille</h1>
          <h2 className={styles.subtitle}>Gestion des commissions</h2>
          
          <div className={styles.ctaContainer}>
            <a href="/login" className={styles.cta}>
              <i className="fas fa-sign-in-alt"></i>
              Se connecter
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
