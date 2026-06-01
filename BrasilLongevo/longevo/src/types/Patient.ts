// ============================================================
// TIPOS — src/types/patient.ts
// Define o formato de cada paciente no sistema.
// Se adicionar um campo novo no objeto, adicione aqui também.
// ============================================================

// src/types/Patient.ts

export type PatientStatus = "ok" | "partial" | "late" | "urgent";

export interface Medication {
  name: string;
  schedule: string[];  // horários ex: ["08:00", "14:00"]
  taken: boolean[];    // se cada horário foi tomado
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  phone: string;
  address: string;
  doctor: string;
  conditions: string[];
  medications: Medication[];
  nextDose: string;
  status: PatientStatus;
  missedDoses: number;
  notes: string;
  lastVisit: string;
}

// Formato vindo do banco (controlepacientes)
export interface ControleRow {
  idControlePacientes: number;
  Pacientes: string;
  Medicamentos: string;
  Horario1: string | null;
  Tomou1: number;        // 0 ou 1
  Horario2: string | null;
  Tomou2: number;
  Horario3: string | null;
  Tomou3: number;
  status: PatientStatus; // calculado pelo backend
}
