"use client";
import { useState, useEffect } from "react";
import { Collaborateur, CollaborateurFormData, StatutCollaborateur } from "@/types/collaborateur";
import styles from "./CollaborateurModal.module.css";

interface CollaborateurModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaborateur?: Collaborateur | null;
  onSave: (data: CollaborateurFormData) => Promise<void>;
  loading?: boolean;
}

const STATUT_OPTIONS: { value: StatutCollaborateur; label: string }[] = [
  { value: "agent", label: "Agent" },
  { value: "cadre", label: "Cadre" },
  { value: "non-cadre", label: "Non-cadre" },
  { value: "alternant", label: "Alternant" }
];

export default function CollaborateurModal({
  isOpen,
  onClose,
  collaborateur,
  onSave,
  loading = false
}: CollaborateurModalProps) {
  const [formData, setFormData] = useState<CollaborateurFormData>({
    prenom: "",
    statut: "agent",
    etp: 1
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!collaborateur;

  useEffect(() => {
    if (collaborateur) {
      setFormData({
        prenom: collaborateur.prenom,
        statut: collaborateur.statut,
        etp: collaborateur.etp
      });
    } else {
      setFormData({
        prenom: "",
        statut: "agent",
        etp: 1
      });
    }
    setErrors({});
  }, [collaborateur, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    }

    if (formData.etp < 0 || formData.etp > 1) {
      newErrors.etp = "L&apos;ETP doit être entre 0 et 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction utilitaire pour formater le prénom
  function formatPrenom(value: string): string {
    return value
      .split("-")
      .map(
        part =>
          part.charAt(0).toUpperCase() +
          part.slice(1).toLowerCase()
      )
      .join("-");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleInputChange = (field: keyof CollaborateurFormData, value: string | number) => {
    if (field === "prenom" && typeof value === "string") {
      value = formatPrenom(value);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isEditing ? "Modifier le collaborateur" : "Ajouter un collaborateur"}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fermer"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="prenom" className={styles.label}>
              Prénom *
            </label>
            <input
              id="prenom"
              type="text"
              value={formData.prenom}
              onChange={(e) => handleInputChange("prenom", e.target.value)}
              className={`${styles.input} ${errors.prenom ? styles.error : ""}`}
              placeholder="Prénom du collaborateur"
              disabled={loading}
              required
            />
            {errors.prenom && (
              <span className={styles.errorText}>{errors.prenom}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="statut" className={styles.label}>
              Statut *
            </label>
            <select
              id="statut"
              value={formData.statut}
              onChange={(e) => handleInputChange("statut", e.target.value as StatutCollaborateur)}
              className={styles.select}
              disabled={loading}
              required
            >
              {STATUT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="etp" className={styles.label}>
              ETP (0 à 1) *
            </label>
            <input
              id="etp"
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={formData.etp}
              onChange={(e) => handleInputChange("etp", parseFloat(e.target.value) || 0)}
              className={`${styles.input} ${errors.etp ? styles.error : ""}`}
              placeholder="0.5"
              disabled={loading}
              required
            />
            {errors.etp && (
              <span className={styles.errorText}>{errors.etp}</span>
            )}
            <small className={styles.helpText}>
              Équivalent temps plein (0 = temps partiel, 1 = temps plein)
            </small>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  {isEditing ? "Modifier" : "Ajouter"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 