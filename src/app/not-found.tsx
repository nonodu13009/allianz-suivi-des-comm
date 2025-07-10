import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "var(--font-poppins), sans-serif"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: 24,
        boxShadow: "0 12px 32px rgba(102,126,234,0.12)",
        padding: "2.5rem 2rem 2rem 2rem",
        minWidth: 320,
        maxWidth: 350,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: 48, color: "#ff6b6b", marginBottom: 16 }}></i>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#764ba2", margin: 0 }}>Page introuvable</h1>
        <p style={{ color: "#555", margin: "1.2rem 0 2rem 0", textAlign: "center" }}>
          Oups, la page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link href="/" style={{
          display: "inline-block",
          background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
          color: "#fff",
          fontWeight: 600,
          fontSize: 18,
          borderRadius: 50,
          padding: "0.9rem 2rem",
          textDecoration: "none",
          boxShadow: "0 6px 18px rgba(255,107,107,0.18)",
          transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
          outline: "none",
          position: "relative",
          overflow: "hidden",
          animation: "heartbeat 2s ease-in-out infinite"
        }}>
          <i className="fas fa-arrow-left" style={{ marginRight: 10 }}></i>
          Retour à l'accueil
        </Link>
      </div>
      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.05); }
          28% { transform: scale(1); }
          42% { transform: scale(1.05); }
          70% { transform: scale(1); }
        }
        a[style][href='/']:hover {
          background: linear-gradient(135deg, #ee5a24, #ff6b6b);
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 10px 28px rgba(255,107,107,0.22);
        }
      `}</style>
    </div>
  );
} 