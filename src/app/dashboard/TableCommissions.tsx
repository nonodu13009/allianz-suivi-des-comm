"use client";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Modal from "../components/Modal";
import Notification from "../components/Notification";
import EditMonthModal from "../components/EditMonthModal";
import styles from "./TableCommissions.module.css";

const MONTHS = [
  "janvier", "fevrier", "mars", "avril", "mai", "juin",
  "juillet", "aout", "septembre", "octobre", "novembre", "decembre"
];

const MONTHS_LABELS = {
  janvier: "Janvier",
  fevrier: "Février",
  mars: "Mars",
  avril: "Avril",
  mai: "Mai",
  juin: "Juin",
  juillet: "Juillet",
  aout: "Août",
  septembre: "Septembre",
  octobre: "Octobre",
  novembre: "Novembre",
  decembre: "Décembre"
};

// Années visibles par défaut (année en cours + 3 précédentes)
const getVisibleYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 4 }, (_, i) => (currentYear - i).toString());
};

const ROWS = [
  { key: "iard", label: "Commissions IARD", rowClass: styles.commissionRow },
  { key: "vie", label: "Commissions Vie", rowClass: styles.commissionRow },
  { key: "courtage", label: "Commissions Courtage", rowClass: styles.commissionRow },
  { key: "profits", label: "Profits exceptionnels", rowClass: styles.commissionRow },
  { key: "total", label: "Total commissions", isTotal: true, rowClass: styles.totalRow },
  { key: "charges", label: "Charges agence", rowClass: styles.chargesRow },
  { key: "resultat", label: "Résultat", isResult: true, rowClass: styles.resultRow },
  { key: "prel_julien", label: "Prélèvements Julien", rowClass: styles.prelRow },
  { key: "prel_jeanmichel", label: "Prélèvements Jean-Michel", rowClass: styles.prelRow },
];

function formatMoney(val) {
  if (typeof val !== "number" || isNaN(val)) return "-";
  return val.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
}

function sumYear(data, key, getTotal, getResultat) {
  if (key === "total") {
    return MONTHS.reduce((acc, mois) => acc + getTotal(mois), 0);
  }
  if (key === "resultat") {
    return MONTHS.reduce((acc, mois) => acc + getResultat(mois), 0);
  }
  return MONTHS.reduce((acc, mois) => acc + ((data[mois]?.[key]) || 0), 0);
}

// Fonction pour créer une nouvelle année avec structure complète
function createNewYearData(year: string) {
  const newYearData: any = {};
  
  MONTHS.forEach(mois => {
    newYearData[mois] = {
      iard: 0,
      vie: 0,
      courtage: 0,
      profits: 0,
      charges: 0,
      prel_julien: 0,
      prel_jeanmichel: 0
    };
  });
  
  return newYearData;
}

export default function TableCommissions() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visibleYears, setVisibleYears] = useState<string[]>(getVisibleYears());
  const [archivedYears, setArchivedYears] = useState<string[]>([]);
  const [showArchives, setShowArchives] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    month: string;
    data: any;
  }>({
    isOpen: false,
    month: "",
    data: null
  });
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false
  });

  // Charger toutes les années disponibles
  useEffect(() => {
    async function loadAllYears() {
      try {
        const querySnapshot = await getDocs(collection(db, "commissions"));
        const allYears = querySnapshot.docs.map(doc => doc.id).sort((a, b) => parseInt(b) - parseInt(a));
        
        const currentYear = new Date().getFullYear();
        const visible = allYears.filter(y => parseInt(y) >= currentYear - 3);
        const archived = allYears.filter(y => parseInt(y) < currentYear - 3);
        
        setVisibleYears(visible.length > 0 ? visible : getVisibleYears());
        setArchivedYears(archived);
      } catch (error) {
        console.error("Erreur lors du chargement des années:", error);
        setVisibleYears(getVisibleYears());
      }
    }
    
    loadAllYears();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const docRef = doc(collection(db, "commissions"), year);
      const snap = await getDoc(docRef);
      setData(snap.exists() ? snap.data() : null);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [year]);

  const handleCreateNewYear = async () => {
    setActionLoading(true);
    try {
      const newYear = (new Date().getFullYear() + 1).toString();
      const newYearData = createNewYearData(newYear);
      
      await setDoc(doc(collection(db, "commissions"), newYear), newYearData);
      
      // Mettre à jour la liste des années visibles
      setVisibleYears(prev => [newYear, ...prev.slice(0, 3)]);
      setYear(newYear);
      
      // Feedback de succès
      setNotification({
        message: `Nouvelle année ${newYear} créée avec succès !`,
        type: "success",
        isVisible: true
      });
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      setNotification({
        message: "Erreur lors de la création de la nouvelle année.",
        type: "error",
        isVisible: true
      });
    }
    setActionLoading(false);
  };

  const handleShowArchives = () => {
    setShowArchives(!showArchives);
  };

  const handleCellClick = (month: string) => {
    // S'assurer que les données existent ou créer une structure par défaut
    const monthData = data?.[month] || {
      iard: 0,
      vie: 0,
      courtage: 0,
      profits: 0,
      charges: 0,
      prel_julien: 0,
      prel_jeanmichel: 0
    };
    
    setEditModal({
      isOpen: true,
      month,
      data: monthData
    });
  };

  const handleEditSave = () => {
    // Recharger les données après modification
    fetchData();
    setNotification({
      message: "Données mises à jour avec succès !",
      type: "success",
      isVisible: true
    });
  };

  if (loading) return <div style={{color:'#fff',textAlign:'center',marginTop:'2rem'}}>Chargement du tableau…</div>;
  if (!data) return <div style={{color:'#fff',textAlign:'center',marginTop:'2rem'}}>Aucune donnée trouvée.</div>;

  // Calculs dynamiques
  const getTotal = (mois) => {
    const d = data[mois] || {};
    return (d.iard||0) + (d.vie||0) + (d.courtage||0) + (d.profits||0);
  };
  const getResultat = (mois) => {
    return getTotal(mois) - ((data[mois]?.charges)||0);
  };

  const currentYears = showArchives ? archivedYears : visibleYears;

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.controlsContainer}>
        <div className={styles.tableTitle}>Commissions {year}</div>
        
        {/* Boutons d'action */}
        <div className={styles.buttonsContainer}>
          <button
            onClick={() => setShowModal(true)}
            disabled={actionLoading}
            className={`${styles.actionButton} ${styles.createButton}`}
            aria-label="Créer une nouvelle année"
          >
            {actionLoading ? 'Création...' : 'Nouvelle année'}
          </button>
          
          <button
            onClick={handleShowArchives}
            className={`${styles.actionButton} ${styles.archiveButton}`}
            aria-label={showArchives ? "Retour aux années visibles" : "Consulter les archives"}
          >
            {showArchives ? 'Années visibles' : 'Archives'}
          </button>
        </div>
        
        {/* Sélecteur d'année */}
        <div>
          <select
            value={year}
            onChange={e => setYear(e.target.value)}
            className={styles.yearSelect}
            aria-label={`Sélection de l'année ${showArchives ? '(archives)' : '(années visibles)'}`}
          >
            {currentYears.length > 0 ? (
              currentYears.map(y => (
                <option key={y} value={y}>
                  {showArchives ? `Archive ${y}` : y}
                </option>
              ))
            ) : (
              <option value="">Aucune année disponible</option>
            )}
          </select>
        </div>
      </div>
      
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            {MONTHS.map((mois) => (
              <th key={mois}>{MONTHS_LABELS[mois]} <span style={{fontWeight:400, fontSize:'0.95em', opacity:0.7}}>&euro;</span></th>
            ))}
            <th className={styles.totalCol}>Total</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.key} className={row.rowClass}>
              <td className={styles.rowLabel}>{row.label}</td>
              {MONTHS.map((mois) => {
                let value;
                if (row.key === "total") value = getTotal(mois);
                else if (row.key === "resultat") value = getResultat(mois);
                else value = data[mois]?.[row.key];
                
                // Rendre les cellules cliquables sauf pour les totaux et résultats
                const isClickable = row.key !== "total" && row.key !== "resultat";
                
                return (
                  <td 
                    key={mois} 
                    className={isClickable ? styles.clickableCell : ""}
                    onClick={isClickable ? () => handleCellClick(mois) : undefined}
                    style={isClickable ? { cursor: 'pointer' } : {}}
                    title={isClickable ? `Cliquer pour éditer ${mois}` : ""}
                  >
                    {formatMoney(value)}
                  </td>
                );
              })}
              <td className={styles.totalCol}>{formatMoney(sumYear(data, row.key, getTotal, getResultat))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modale de confirmation */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleCreateNewYear}
        title="Créer une nouvelle année"
        message={`Êtes-vous sûr de vouloir créer l'année ${new Date().getFullYear() + 1} ? Cette action créera une structure complète avec tous les mois et toutes les valeurs initialisées à 0.`}
        confirmText="Créer l'année"
        cancelText="Annuler"
      />

      {/* Modale d'édition */}
      <EditMonthModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal(prev => ({ ...prev, isOpen: false }))}
        month={editModal.month}
        year={year}
        initialData={editModal.data}
        onSave={handleEditSave}
      />

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
} 