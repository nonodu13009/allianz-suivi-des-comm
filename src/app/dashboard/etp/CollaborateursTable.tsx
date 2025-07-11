"use client";
import { useState, useEffect } from "react";
import { Collaborateur, CollaborateurFormData } from "@/types/collaborateur";
import { collaborateursService } from "@/lib/collaborateursService";
import CollaborateurModal from "./CollaborateurModal";
import styles from "./CollaborateursTable.module.css";

const STATUT_LABELS: Record<string, string> = {
  agent: "Agent",
  cadre: "Cadre",
  "non-cadre": "Non-cadre",
  alternant: "Alternant"
};

export default function CollaborateursTable() {
  const [collaborateurs, setCollaborateurs] = useState<Collaborateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollaborateur, setEditingCollaborateur] = useState<Collaborateur | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const loadCollaborateurs = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await collaborateursService.getAll();
      setCollaborateurs(data);
    } catch {
      console.error("Erreur lors du chargement des collaborateurs");
      setError("Erreur lors du chargement des collaborateurs");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCollaborateurs();
  }, []);

  const handleAddCollaborateur = () => {
    setEditingCollaborateur(null);
    setModalOpen(true);
  };

  const handleEditCollaborateur = (collaborateur: Collaborateur) => {
    setEditingCollaborateur(collaborateur);
    setModalOpen(true);
  };

  const handleDeleteCollaborateur = async (id: string, prenom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${prenom} ?`)) {
      return;
    }

    setActionLoading(true);
    try {
      await collaborateursService.delete(id);
      await loadCollaborateurs();
    } catch {
      console.error("Erreur lors de la suppression du collaborateur");
      setError("Erreur lors de la suppression du collaborateur");
    }
    setActionLoading(false);
  };

  const handleSaveCollaborateur = async (data: CollaborateurFormData) => {
    setActionLoading(true);
    try {
      if (editingCollaborateur) {
        await collaborateursService.update(editingCollaborateur.id, data);
      } else {
        await collaborateursService.add(data);
      }
      await loadCollaborateurs();
      setModalOpen(false);
    } catch {
      console.error("Erreur lors de la sauvegarde du collaborateur");
      setError("Erreur lors de la sauvegarde du collaborateur");
      throw new Error("Erreur lors de la sauvegarde du collaborateur");
    }
    setActionLoading(false);
  };

  const formatETP = (etp: number) => {
    return `${(etp * 100).toFixed(0)}%`;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>
          <i className="fas fa-spinner fa-spin"></i>
          Chargement des collaborateurs...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Inventaire des collaborateurs</h2>
        <button
          className={styles.addButton}
          onClick={handleAddCollaborateur}
          disabled={actionLoading}
        >
          <i className="fas fa-plus"></i>
          Ajouter un collaborateur
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      {collaborateurs.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="fas fa-users"></i>
          <h3>Aucun collaborateur</h3>
          <p>Commencez par ajouter votre premier collaborateur</p>
          <button
            className={styles.emptyStateButton}
            onClick={handleAddCollaborateur}
            disabled={actionLoading}
          >
            <i className="fas fa-plus"></i>
            Ajouter un collaborateur
          </button>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Prénom</th>
                <th>Statut</th>
                <th>ETP</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collaborateurs.map((collaborateur) => (
                <tr key={collaborateur.id}>
                  <td className={styles.prenom}>{collaborateur.prenom}</td>
                  <td>
                    <span className={`${styles.statut} ${styles[collaborateur.statut]}`}>
                      {STATUT_LABELS[collaborateur.statut]}
                    </span>
                  </td>
                  <td className={styles.etp}>{formatETP(collaborateur.etp)}</td>
                  <td className={styles.actions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditCollaborateur(collaborateur)}
                      disabled={actionLoading}
                      title="Modifier"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteCollaborateur(collaborateur.id, collaborateur.prenom)}
                      disabled={actionLoading}
                      title="Supprimer"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CollaborateurModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        collaborateur={editingCollaborateur}
        onSave={handleSaveCollaborateur}
        loading={actionLoading}
      />
    </div>
  );
} 