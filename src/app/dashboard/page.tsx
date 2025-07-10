import Header from "../components/Header";
import ProtectedRoute from "../components/ProtectedRoute";
import TableCommissions from "./TableCommissions";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <TableCommissions />
        </main>
      </div>
    </ProtectedRoute>
  );
} 