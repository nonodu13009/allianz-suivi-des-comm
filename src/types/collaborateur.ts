export type StatutCollaborateur = 'agent' | 'cadre' | 'non-cadre' | 'alternant';

export interface Collaborateur {
  id: string;
  prenom: string;
  statut: StatutCollaborateur;
  etp: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollaborateurFormData {
  prenom: string;
  statut: StatutCollaborateur;
  etp: number;
}

export interface KPIData {
  etpTotal: number;
  caParEtp: number;
  caAnnuelExtrapole: number;
  nombreCollaborateurs: number;
} 