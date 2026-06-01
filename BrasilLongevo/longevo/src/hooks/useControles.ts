// src/hooks/useControles.ts
// Busca os controles de pacientes do backend.
// O status (ok/partial/late/urgent) já vem calculado pelo servidor.
// Atualiza automaticamente a cada 60 segundos.

import { useState, useEffect, useCallback } from "react";
import type { ControleRow, PatientStatus } from "../types/Patient";

export interface ControleItem {
  id: number;
  paciente: string;
  medicamento: string;
  horario1: string | null;
  tomou1: boolean;
  horario2: string | null;
  tomou2: boolean;
  horario3: string | null;
  tomou3: boolean;
  status: PatientStatus;
}

function mapFromApi(row: ControleRow): ControleItem {
  return {
    id:          row.idControlePacientes,
    paciente:    row.Pacientes,
    medicamento: row.Medicamentos,
    horario1:    row.Horario1,
    tomou1:      Boolean(row.Tomou1),
    horario2:    row.Horario2,
    tomou2:      Boolean(row.Tomou2),
    horario3:    row.Horario3,
    tomou3:      Boolean(row.Tomou3),
    status:      row.status,
  };
}

export function useControles() {
  const [controles, setControles] = useState<ControleItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setError(null);
    try {
      const res  = await fetch("/api/controle/");
      const data = await res.json();
      setControles(data.map(mapFromApi));
    } catch {
      setError("Erro ao carregar controles.");
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (term: string) => {
    if (!term.trim()) { fetchAll(); return; }
    try {
      const res  = await fetch(`/api/controle/search/${encodeURIComponent(term)}`);
      const data = await res.json();
      setControles(data.map(mapFromApi));
    } catch {
      setError("Erro na pesquisa.");
    }
  }, [fetchAll]);

  const deleteControle = useCallback(async (id: number) => {
    try {
      await fetch(`/api/controle/${id}`, { method: "DELETE" });
      setControles((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("Erro ao deletar.");
    }
  }, []);

  useEffect(() => {
    fetchAll();
    // Atualiza a cada 60 segundos para recalcular os status
    const interval = setInterval(fetchAll, 60_000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  // Contadores para os Cards
  const stats = {
    total:   controles.length,
    onTime:  controles.filter((c) => c.status === "ok" || c.status === "partial").length,
    late:    controles.filter((c) => c.status === "late").length,
    urgent:  controles.filter((c) => c.status === "urgent").length,
  };

  return { controles, loading, error, stats, fetchAll, search, deleteControle };
}
