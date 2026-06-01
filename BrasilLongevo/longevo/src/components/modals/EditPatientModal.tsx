// src/components/modals/EditPatientModal.tsx
import { useState } from "react";
import { X, Pencil, User, Pill, Clock, Save } from "lucide-react";
import type { ControleItem } from "../../hooks/useControles";
import { toast } from "react-toastify";

interface Props {
  item: ControleItem;
  onClose: () => void;
  onSave: () => void;
}

interface MedEntry {
  id: number;
  medicamento: string;
  horario1: string | null;
  horario2: string | null;
  horario3: string | null;
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", background: "#f8fafc", color: "#1e293b",
};
const labelStyle: React.CSSProperties = {
  fontSize: 12, color: "#64748b", fontWeight: 600,
  display: "flex", alignItems: "center", gap: 5, marginBottom: 6,
};

export default function EditPatientModal({ item, onClose, onSave }: Props) {
  const [paciente, setPaciente] = useState(item.paciente);
  const [meds, setMeds] = useState<MedEntry[]>([{
    id: item.id,
    medicamento: item.medicamento,
    horario1: item.horario1,
    horario2: item.horario2,
    horario3: item.horario3,
  }]);
  const [saving, setSaving] = useState(false);

  const updateMed = (id: number, field: keyof MedEntry, value: string | null) =>
    setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));

  const activateHorario = (id: number, field: keyof MedEntry) =>
    setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: "08:00" } : m)));

  const deactivateHorario = (id: number, field: keyof MedEntry) =>
    setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: null } : m)));

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
          fetch(`/api/controle/${m.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Pacientes:    paciente.trim(),
              Medicamentos: m.medicamento.trim(),
              Horario1:     m.horario1,
              Tomou1:       item.tomou1 ? 1 : 0,
              Horario2:     m.horario2,
              Tomou2:       item.tomou2 ? 1 : 0,
              Horario3:     m.horario3,
              Tomou3:       item.tomou3 ? 1 : 0,
            }),
          }).then((res) => { if (!res.ok) throw new Error(); })
        )
      );
      toast.success("Paciente atualizado com sucesso!");
      onSave();
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
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
            <Pencil size={20} />
            <span style={{ fontSize: 18, fontWeight: 700 }}>Editar Paciente</span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, color: "#fff", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} />
          </button>
        </div>

        {/* Corpo */}
        <div style={{ padding: 28, overflowY: "auto", flex: 1 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}><User size={12} /> Nome do Paciente</label>
            <input value={paciente} onChange={(e) => setPaciente(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {meds.map((med) => (
              <div key={med.id} style={{ background: "#f8fafc", borderRadius: 14, padding: 18, border: "1.5px solid #e2e8f0" }}>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}><Pill size={12} /> Medicamento</label>
                  <input value={med.medicamento} onChange={(e) => updateMed(med.id, "medicamento", e.target.value)} style={inputStyle} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  {([1, 2, 3] as const).map((n) => {
                    const key = `horario${n}` as keyof MedEntry;
                    const val = med[key] as string | null;
                    const ativo = val !== null;
                    return (
                      <div key={n}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                          <label style={{ ...labelStyle, marginBottom: 0 }}><Clock size={11} /> Horário {n}</label>
                          <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 11, color: ativo ? "#3b82f6" : "#94a3b8", fontWeight: 600 }}>
                            <input type="checkbox" checked={ativo} onChange={(e) => e.target.checked ? activateHorario(med.id, key) : deactivateHorario(med.id, key)} style={{ accentColor: "#3b82f6", width: 14, height: 14, cursor: "pointer" }} />
                            {ativo ? "Ativo" : "Inativo"}
                          </label>
                        </div>
                        {ativo
                          ? <input type="time" value={val ?? ""} onChange={(e) => updateMed(med.id, key, e.target.value)} style={inputStyle} />
                          : <div style={{ ...inputStyle, color: "#cbd5e1", display: "flex", alignItems: "center", height: 42 }}>— não usar</div>
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé */}
        <div style={{ padding: "16px 28px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10, flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 12, borderRadius: 12, border: "1.5px solid #cbd5e1", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#64748b" }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={!canSave} style={{ flex: 2, padding: 12, borderRadius: 12, border: "none", background: canSave ? "linear-gradient(135deg, #0e0e0f, #3b82f6)" : "#e2e8f0", cursor: canSave ? "pointer" : "default", fontSize: 14, fontWeight: 700, color: canSave ? "#fff" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Save size={15} />
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}