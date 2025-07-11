"use client";
import { useEffect, useState } from "react";
import { doc, updateDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./EditMonthModal.module.css";

export interface MonthData {
  iard: number;
  vie: number;
  courtage: number;
  profits: number;
  charges: number;
  prel_julien: number;
  prel_jeanmichel: number;
}

interface EditMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: string;
  year: string;
  initialData: MonthData;
  onSave: () => void;
}

export default function EditMonthModal({ 
  isOpen, 
  onClose, 
  month, 
  year, 
  initialData, 
  onSave 
}: EditMonthModalProps) {
  const [formData, setFormData] = useState<MonthData>(initialData || {
    iard: 0,
    vie: 0,
    courtage: 0,
    profits: 0,
    charges: 0,
    prel_julien: 0,
    prel_jeanmichel: 0
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Réinitialiser les données quand la modale s'ouvre
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
      setErrors({});
    }
  }, [isOpen, initialData]);

  // Calculs automatiques
  const totalCommissions = (formData?.iard || 0) + (formData?.vie || 0) + (formData?.courtage || 0) + (formData?.profits || 0);
  const resultat = totalCommissions - (formData?.charges || 0);

  const handleInputChange = (field: keyof MonthData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
    
    // Effacer l'erreur si elle existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validation des valeurs négatives
    if (formData) {
      Object.entries(formData).forEach(([key, value]) => {
        if (value < 0) {
          newErrors[key] = "La valeur ne peut pas être négative";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const yearDoc = doc(collection(db, "commissions"), year);
      await updateDoc(yearDoc, {
        [month]: formData
      });
      
      onSave();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde des données.");
    }
    setLoading(false);
  };

  const formatMonthName = (month: string) => {
    return month.charAt(0).toUpperCase() + month.slice(1);
  };

  const formatMoney = (value: number) => {
    return value.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
  };

  if (!isOpen || !formData) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            Éditer {formatMonthName(month)} {year}
          </h3>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fermer la modale"
          >
            ×
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.form}>
            {/* Commissions */}
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Commissions</h4>
              <div className={styles.inputGroup}>
                <label htmlFor="iard">Commissions IARD</label>
                <input
                  id="iard"
                  type="number"
                  value={formData.iard}
                  onChange={(e) => handleInputChange("iard", e.target.value)}
                  className={errors.iard ? styles.inputError : styles.input}
                  placeholder="0"
                />
                {errors.iard && <span className={styles.errorText}>{errors.iard}</span>}
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="vie">Commissions Vie</label>
                <input
                  id="vie"
                  type="number"
                  value={formData.vie}
                  onChange={(e) => handleInputChange("vie", e.target.value)}
                  className={errors.vie ? styles.inputError : styles.input}
                  placeholder="0"
                />
                {errors.vie && <span className={styles.errorText}>{errors.vie}</span>}
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="courtage">Commissions Courtage</label>
                <input
                  id="courtage"
                  type="number"
                  value={formData.courtage}
                  onChange={(e) => handleInputChange("courtage", e.target.value)}
                  className={errors.courtage ? styles.inputError : styles.input}
                  placeholder="0"
                />
                {errors.courtage && <span className={styles.errorText}>{errors.courtage}</span>}
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="profits">Profits exceptionnels</label>
                <input
                  id="profits"
                  type="number"
                  value={formData.profits}
                  onChange={(e) => handleInputChange("profits", e.target.value)}
                  className={errors.profits ? styles.inputError : styles.input}
                  placeholder="0"
                />
                {errors.profits && <span className={styles.errorText}>{errors.profits}</span>}
              </div>
            </div>

            {/* Charges et Prélèvements */}
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Charges et Prélèvements</h4>
              <div className={styles.inputGroup}>
                <label htmlFor="charges">Charges agence</label>
                <input
                  id="charges"
                  type="number"
                  value={formData.charges}
                  onChange={(e) => handleInputChange("charges", e.target.value)}
                  className={errors.charges ? styles.inputError : styles.input}
                  placeholder="0"
                />
                {errors.charges && <span className={styles.errorText}>{errors.charges}</span>}
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="prel_julien">Prélèvements Julien</label>
                <input
                  id="prel_julien"
                  type="number"
                  value={formData.prel_julien}
                  onChange={(e) => handleInputChange("prel_julien", e.target.value)}
                  className={errors.prel_julien ? styles.inputError : styles.input}
                  placeholder="0"
                />
                {errors.prel_julien && <span className={styles.errorText}>{errors.prel_julien}</span>}
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="prel_jeanmichel">Prélèvements Jean-Michel</label>
                <input
                  id="prel_jeanmichel"
                  type="number"
                  value={formData.prel_jeanmichel}
                  onChange={(e) => handleInputChange("prel_jeanmichel", e.target.value)}
                  className={errors.prel_jeanmichel ? styles.inputError : styles.input}
                  placeholder="0"
                />
                {errors.prel_jeanmichel && <span className={styles.errorText}>{errors.prel_jeanmichel}</span>}
              </div>
            </div>

            {/* Calculs automatiques */}
            <div className={styles.calculations}>
              <h4 className={styles.sectionTitle}>Calculs automatiques</h4>
              <div className={styles.calcRow}>
                <span>Total commissions :</span>
                <span className={styles.calcValue}>{formatMoney(totalCommissions)} €</span>
              </div>
              <div className={styles.calcRow}>
                <span>Résultat :</span>
                <span className={`${styles.calcValue} ${resultat >= 0 ? styles.positive : styles.negative}`}>
                  {formatMoney(resultat)} €
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </button>
          <button 
            className={styles.saveButton}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Sauvegarde...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
} 