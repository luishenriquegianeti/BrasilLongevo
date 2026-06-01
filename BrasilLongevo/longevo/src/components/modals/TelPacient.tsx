// src/components/modals/TelPacient.tsx
import { useState } from "react";
import { X, Plus, User, Pill, Clock, Save, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

interface Props {
  onClose: () => void;
  onSave: () => void;
}

interface MedEntry {
  id: number;
  medicamento: string;
 // null = não preenchido, string = horário escolhido (incluindo "00:00")
  horario1: string | null;
  horario2: string | null;
  horario3: string | null;
}

let nextId = 1;
const newMed = (): MedEntry => ({
  id: nextId++,
  medicamento: "",
  horario1: null,
  horario2: null,
  horario3: null,
});const ITEMS_PER_PAGE = 5;

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1.5px solid #e2e8f0",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  background: "#f8fafc",
  color: "#1e293b",};
const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: 5,
  marginBottom: 6,
};

export default function AddPatientModal({ onClose, onSave }: Props) {
  const [paciente, setPaciente] = useState("");
  const [meds, setMeds]         = useState<MedEntry[]>([newMed()]);
  const [saving, setSaving]     = useState(false);
  const [page, setPage]         = useState(1);

  const totalPages = Math.ceil(meds.length / ITEMS_PER_PAGE);
  const paginated  = meds.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const updateMed = (id: number, field: keyof MedEntry, value: string | null) =>
    setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));

  
  // Ativa o campo de horário com valor padrão "08:00"
  const activateHorario = (id: number, field: keyof MedEntry) =>
    setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: "00:00" } : m)));

   // Desativa — volta para null
  const deactivateHorario = (id: number, field: keyof MedEntry) =>
    setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: null } : m)));

  const addMed = () => {
    const updated = [...meds, newMed()];
    setMeds(updated);
    setPage(Math.ceil(updated.length / ITEMS_PER_PAGE));
  };

  const removeMed = (id: number) => {
    if (meds.length === 1) return;
    const updated = meds.filter((m) => m.id !== id);
    setMeds(updated);
    const newTotal = Math.ceil(updated.length / ITEMS_PER_PAGE);
    if (page > newTotal) setPage(newTotal);
  };

  // ← apenas UMA handleSave, com toast
  const handleSave = async () => {
    if (!paciente.trim()) {
      toast.warn("Informe o nome do paciente.");
      return;
    }
    const validMeds = meds.filter((m) => m.medicamento.trim());
    if (validMeds.length === 0) {
      toast.warn("Informe ao menos um medicamento.");
      return;
    }
    setSaving(true);
    try {
      await Promise.all(
        validMeds.map((m) =>
          fetch("/api/controle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Pacientes:    paciente.trim(),
              Medicamentos: m.medicamento.trim(),
              Horario1:     m.horario1,
              Tomou1:       0,
              Horario2:     m.horario2,
              Tomou2:       0,
              Horario3:     m.horario3,
              Tomou3:       0,
            }),
          }).then((res) => { if (!res.ok) throw new Error(); })
        )
      );
      toast.success("Paciente cadastrado com sucesso!");
      onSave();
    } catch {
      toast.error("Erro ao cadastrar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const canSave = paciente.trim() && meds.some((m) => m.medicamento.trim()) && !saving;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 580, boxShadow: "0 25px 60px rgba(0,0,0,0.2)", fontFamily: "inherit", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>

        {/* Cabeçalho */}
        <div style={{ background: "linear-gradient(135deg, #0b0b0b, #3b82f6)", borderRadius: "20px 20px 0 0", padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff" }}>
            <Plus size={20} />
            <span style={{ fontSize: 18, fontWeight: 700 }}>Novo Paciente</span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, color: "#fff", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} />
          </button>
        </div>

        {/* Corpo */}
        <div style={{ padding: 28, overflowY: "auto", flex: 1 }}>
{/* Nome do paciente */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}><User size={12} /> Nome do Paciente</label>
            <input value={paciente} onChange={(e) => setPaciente(e.target.value)} placeholder="Ex: Maria Silva" style={inputStyle} />
          </div>
 {/* Título + botão adicionar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
              Medicamentos
              <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, color: "#94a3b8", background: "#f1f5f9", padding: "2px 8px", borderRadius: 20 }}>
                {meds.length}
              </span>            </span>
            <button
              onClick={addMed}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", border: "none", borderRadius: 10, background: "linear-gradient(135deg, #000, #3b82f6)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            >              
            <Plus size={12} /> Adicionar Medicamento
            </button>
          </div>
{/* Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {paginated.map((med) => (
              <div key={med.id} style={{ background: "#f8fafc", borderRadius: 14, padding: 18, border: "1.5px solid #e2e8f0" }}>
               {/* Nome do medicamento */}
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 14 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}><Pill size={12} /> Medicamento</label>
                    <input
                      value={med.medicamento}
                      onChange={(e) => updateMed(med.id, "medicamento", e.target.value)}
                      placeholder="Ex: Paracetamol 500mg"
                      style={inputStyle}
                    />                  </div>
                  {meds.length > 1 && (
                    <button onClick={() => removeMed(med.id)} style={{ padding: "10px 11px", borderRadius: 10, border: "1.5px solid #fee2e2", background: "#fff5f5", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", flexShrink: 0 }}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
{/* Horários — ativados por checkbox */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  {([1, 2, 3] as const).map((n) => {
                    const key = `horario${n}` as keyof MedEntry;
                    const val = med[key] as string | null;
                    const ativo = val !== null;
                    return (
                      <div key={n}>
                      {/* Label com toggle */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                          <label style={{ ...labelStyle, marginBottom: 0 }}><Clock size={11} /> Horário {n}</label>
                          <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 11, color: ativo ? "#3b82f6" : "#94a3b8", fontWeight: 600 }}>
                            <input
                              type="checkbox"
                              checked={ativo}
                              onChange={(e) =>
                                e.target.checked
                                  ? activateHorario(med.id, key)
                                  : deactivateHorario(med.id, key)
                              }
                              style={{ accentColor: "#3b82f6", width: 14, height: 14, cursor: "pointer" }}
                            />                            {ativo ? "Ativo" : "Inativo"}
                          </label>
                        </div>
                        {ativo
                          ? <input type="time" value={val ?? ""} onChange={(e) => updateMed(med.id, key, e.target.value)} style={inputStyle} />
                          : <div style={{ ...inputStyle, color: "#cbd5e1", display: "flex", alignItems: "center", height: 42, cursor: "default" }}>— não usar</div>
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
{/* Paginação */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Página {page} de {totalPages}</span>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ padding: "6px 10px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: page === 1 ? "#f8fafc" : "#fff", color: page === 1 ? "#cbd5e1" : "#475569", cursor: page === 1 ? "default" : "pointer", display: "flex", alignItems: "center" }}
                >                 
                 <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("...");
                    acc.push(p); return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`d${i}`} style={{ fontSize: 13, color: "#94a3b8", padding: "0 2px" }}>…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid", borderColor: p === page ? "#3b82f6" : "#e2e8f0", background: p === page ? "#3b82f6" : "#fff", color: p === page ? "#fff" : "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                      >
                        {p}
                      </button>
                    )                
                      )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{ padding: "6px 10px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: page === totalPages ? "#f8fafc" : "#fff", color: page === totalPages ? "#cbd5e1" : "#475569", cursor: page === totalPages ? "default" : "pointer", display: "flex", alignItems: "center" }}
                >                  
                <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div style={{ padding: "16px 28px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: 12, borderRadius: 12, border: "1.5px solid #cbd5e1", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#64748b" }}
          >           
           Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            style={{ flex: 2, padding: 12, borderRadius: 12, border: "none", background: canSave ? "linear-gradient(135deg, #0e0e0f, #3b82f6)" : "#e2e8f0", cursor: canSave ? "pointer" : "default", fontSize: 14, fontWeight: 700, color: canSave ? "#fff" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}
          >            <Save size={15} />
            {saving ? "Salvando..." : "Salvar Paciente"}
          </button>
        </div>
      </div>
    </div>
  );
}