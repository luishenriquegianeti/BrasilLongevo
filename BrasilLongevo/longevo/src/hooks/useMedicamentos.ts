// src/hooks/useMedicamentos.ts
// Hook que centraliza toda a comunicação com a API de medicamentos.
import { useState, useEffect, useCallback } from "react";
import type { Medication } from "../types/midicantion";
// Converte a linha do banco → tipo Medication usado no frontend

function mapFromApi(row: any): Medication {
  const stock: number = Number(row.Estoque) || 0;
  const status =
    stock === 0 ? "out_of_stock" : stock <= 10 ? "low_stock" : "in_stock";

  return {
    id:           row.idMedicamentos,
    name:         row.Nome,
    subtitle:     row.Descricao,   // ← "500mg - Comprimido" vira subtítulo
    category:     row.Categoria,
    presentation: row.Descricao,   // ← mesma coluna
    stock,
    status,
  };
}

export function useMedicamentos() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

    // Busca todos os medicamentos

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch("/api/");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMedications(data.map(mapFromApi));
    } catch {
      setError("Erro ao carregar medicamentos.");
    } finally {
      setLoading(false);
    }
  }, []);
  // Pesquisa no banco pelo termo

  const search = useCallback(async (term: string) => {
    if (!term.trim()) { fetchAll(); return; }
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`/api/search/${encodeURIComponent(term)}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMedications(data.map(mapFromApi));
    } catch {
      setError("Erro na pesquisa.");
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);
  // Deleta um medicamento

  // deleteMedication agora lança erro se falhar (para o toast funcionar)
  const deleteMedication = useCallback(async (id: number) => {
    const res = await fetch(`/api/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error();
    setMedications((prev) => prev.filter((m) => m.id !== id));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { medications, loading, error, fetchAll, search, deleteMedication };
}