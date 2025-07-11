import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const MONTHS = [
  "janvier", "fevrier", "mars", "avril", "mai", "juin",
  "juillet", "aout", "septembre", "octobre", "novembre", "decembre"
];

type CommissionMonth = {
  iard?: number;
  vie?: number;
  courtage?: number;
  profits?: number;
  charges?: number;
  prel_julien?: number;
  prel_jeanmichel?: number;
};

type YearData = Record<string, CommissionMonth>;

export const commissionsService = {
  // Récupérer les données de l'année en cours
  async getCurrentYearData(): Promise<YearData | null> {
    try {
      const currentYear = new Date().getFullYear().toString();
      const docRef = doc(collection(db, "commissions"), currentYear);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as YearData;
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération des données de l'année en cours:", error);
      return null;
    }
  },

  // Calculer le CA extrapolé de l'année en cours
  async getCAExtrapole(): Promise<number> {
    try {
      const yearData: YearData | null = await this.getCurrentYearData();
      if (!yearData) return 0;

      // Calculer le total des commissions pour les mois avec des données
      let totalCommissions = 0;
      let moisAvecDonnees = 0;

      MONTHS.forEach((month: string) => {
        const monthData: CommissionMonth = yearData[month] || {};
        if (monthData) {
          const totalMois = (monthData.iard || 0) + (monthData.vie || 0) + (monthData.courtage || 0) + (monthData.profits || 0);
          if (totalMois > 0) {
            totalCommissions += totalMois;
            moisAvecDonnees++;
          }
        }
      });

      // Si aucun mois avec données, retourner 0
      if (moisAvecDonnees === 0) return 0;

      // Calculer la moyenne mensuelle et extrapoler sur 12 mois
      const moyenneMensuelle = totalCommissions / moisAvecDonnees;
      return moyenneMensuelle * 12;
    } catch (error) {
      console.error("Erreur lors du calcul du CA extrapolé:", error);
      return 0;
    }
  }
}; 