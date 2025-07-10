import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { Collaborateur, CollaborateurFormData } from "@/types/collaborateur";

const COLLECTION_NAME = "collaborateurs";

export const collaborateursService = {
  // Récupérer tous les collaborateurs
  async getAll(): Promise<Collaborateur[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("prenom"));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        prenom: doc.data().prenom,
        statut: doc.data().statut,
        etp: doc.data().etp,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des collaborateurs:", error);
      throw error;
    }
  },

  // Ajouter un nouveau collaborateur
  async add(collaborateur: CollaborateurFormData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...collaborateur,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Erreur lors de l'ajout du collaborateur:", error);
      throw error;
    }
  },

  // Mettre à jour un collaborateur
  async update(id: string, collaborateur: CollaborateurFormData): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...collaborateur,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du collaborateur:", error);
      throw error;
    }
  },

  // Supprimer un collaborateur
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Erreur lors de la suppression du collaborateur:", error);
      throw error;
    }
  },

  // Calculer l'ETP total
  async getEtpTotal(): Promise<number> {
    try {
      const collaborateurs = await this.getAll();
      return collaborateurs.reduce((total, collab) => total + collab.etp, 0);
    } catch (error) {
      console.error("Erreur lors du calcul de l'ETP total:", error);
      return 0;
    }
  },

  // Compter le nombre de collaborateurs
  async getCount(): Promise<number> {
    try {
      const q = query(collection(db, COLLECTION_NAME));
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error("Erreur lors du comptage des collaborateurs:", error);
      return 0;
    }
  }
}; 