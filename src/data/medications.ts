
import type { Medication } from "../types/midicantion";

export const MEDICATIONS_DATA: Medication[] = [
  { id: 1,  name: "Paracetamol",   subtitle: "Analgésico",           category: "Analgésicos",        presentation: "500mg – Comprimido",  stock: 120, status: "in_stock"    },
  { id: 2,  name: "Losartana",     subtitle: "Anti-hipertensivo",    category: "Cardiológicos",       presentation: "50mg – Comprimido",   stock: 35,  status: "in_stock"    },
  { id: 3,  name: "Amoxicilina",   subtitle: "Antibiótico",          category: "Antibióticos",        presentation: "500mg – Cápsula",     stock: 8,   status: "low_stock"   },
  { id: 4,  name: "Dipirona",      subtitle: "Analgésico/Antitérmico", category: "Analgésicos",      presentation: "500mg/mL – Gotas",    stock: 0,   status: "out_of_stock" },
  { id: 5,  name: "Omeprazol",     subtitle: "Protetor gástrico",    category: "Gastrointestinais",   presentation: "20mg – Cápsula",      stock: 42,  status: "in_stock"    },
  { id: 6,  name: "Metformina",    subtitle: "Antidiabético",        category: "Endócrinos",          presentation: "500mg – Comprimido",  stock: 60,  status: "in_stock"    },
  { id: 7,  name: "Enalapril",     subtitle: "Anti-hipertensivo",    category: "Cardiológicos",       presentation: "10mg – Comprimido",   stock: 5,   status: "low_stock"   },
  { id: 8,  name: "Sinvastatina",  subtitle: "Hipolipemiante",       category: "Cardiológicos",       presentation: "20mg – Comprimido",   stock: 30,  status: "in_stock"    },
  { id: 9,  name: "Insulina NPH",  subtitle: "Antidiabético",        category: "Endócrinos",          presentation: "100UI/mL – Frasco",   stock: 0,   status: "out_of_stock" },
  { id: 10, name: "Anlodipino",    subtitle: "Anti-hipertensivo",    category: "Cardiológicos",       presentation: "5mg – Comprimido",    stock: 18,  status: "in_stock"    },
  { id: 11, name: "Glibenclamida", subtitle: "Antidiabético",        category: "Endócrinos",          presentation: "5mg – Comprimido",    stock: 7,   status: "low_stock"   },
  { id: 12, name: "Atorvastatina", subtitle: "Hipolipemiante",       category: "Cardiológicos",       presentation: "40mg – Comprimido",   stock: 22,  status: "in_stock"    },
];