"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import styles from "./login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Identifiants invalides ou problème de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit} autoComplete="on">
        <h1 className={styles.title}>Connexion</h1>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Adresse e-mail</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Votre e-mail"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Mot de passe</label>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Votre mot de passe"
            />
            <button
              type="button"
              className={styles.showPasswordBtn}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              onClick={() => setShowPassword(v => !v)}
              tabIndex={0}
            >
              <i className={`fa${showPassword ? "s" : "r"} fa-eye${showPassword ? "-slash" : ""}`}></i>
            </button>
          </div>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.submit} type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
} 