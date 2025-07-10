// Script de seed Firestore pour l'année 2025
// À exécuter manuellement une seule fois (exemple d'utilisation, ne sera pas importé côté client)
import { db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";

export async function seedCommissions2025() {
  await setDoc(doc(db, "commissions", "2025"), {
    janvier: {
      iard: 83743,
      vie: 5815,
      courtage: 6928,
      profits: 0,
      charges: 54569,
      prel_julien: 18000,
      prel_jeanmichel: 18000
    },
    fevrier: {
      iard: 75088,
      vie: 31813,
      courtage: 4965,
      profits: 0,
      charges: 63488,
      prel_julien: 13000,
      prel_jeanmichel: 13000
    },
    mars: {
      iard: 76902,
      vie: 3461,
      courtage: 4476,
      profits: 0,
      charges: 64301,
      prel_julien: 13000,
      prel_jeanmichel: 13000
    },
    avril: {
      iard: 76694,
      vie: 5565,
      courtage: 4548,
      profits: 0,
      charges: 57140,
      prel_julien: 14400,
      prel_jeanmichel: 14400
    },
    mai: {
      iard: 71661,
      vie: 10027,
      courtage: 5941,
      profits: 0,
      charges: 57209,
      prel_julien: 12000,
      prel_jeanmichel: 12000
    },
    juin: {
      iard: 0,
      vie: 0,
      courtage: 0,
      profits: 0,
      charges: 0,
      prel_julien: 18000,
      prel_jeanmichel: 18000
    },
    juillet: {
      iard: 0,
      vie: 0,
      courtage: 0,
      profits: 0,
      charges: 0,
      prel_julien: 0,
      prel_jeanmichel: 0
    },
    aout: {
      iard: 0,
      vie: 0,
      courtage: 0,
      profits: 0,
      charges: 0,
      prel_julien: 0,
      prel_jeanmichel: 0
    },
    septembre: {
      iard: 0,
      vie: 0,
      courtage: 0,
      profits: 0,
      charges: 0,
      prel_julien: 0,
      prel_jeanmichel: 0
    },
    octobre: {
      iard: 0,
      vie: 0,
      courtage: 0,
      profits: 0,
      charges: 0,
      prel_julien: 0,
      prel_jeanmichel: 0
    },
    novembre: {
      iard: 0,
      vie: 0,
      courtage: 0,
      profits: 0,
      charges: 0,
      prel_julien: 0,
      prel_jeanmichel: 0
    },
    decembre: {
      iard: 0,
      vie: 0,
      courtage: 0,
      profits: 0,
      charges: 0,
      prel_julien: 0,
      prel_jeanmichel: 0
    }
  });
} 