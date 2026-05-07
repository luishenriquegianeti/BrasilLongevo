export type MedicationStatus = "in_stock" | "low_stock" | "out_of_stock";
 
export interface Medication {
  id: number;
  name: string;
  subtitle: string;       // ex: "Analgésico"
  category: string;       // ex: "Analgésicos"
  presentation: string;   // ex: "500mg - Comprimido"
  stock: number;
  status: MedicationStatus;
}