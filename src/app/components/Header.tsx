"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import styles from "./Header.module.css";

const menuItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Statistiques", href: "/dashboard/statistiques" },
  { label: "ETP", href: "/dashboard/etp" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.brand}>Allianz Marseille</span>
      </div>
      <nav className={styles.menu} aria-label="Menu principal">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              pathname === item.href
                ? `${styles.menuItem} ${styles.active}`
                : styles.menuItem
            }
            aria-current={pathname === item.href ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className={styles.right}>
        <span className={styles.status} title="Connecté">
          <i className="fas fa-circle"></i>
        </span>
        <button className={styles.logout} onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Se déconnecter
        </button>
      </div>
    </header>
  );
} 