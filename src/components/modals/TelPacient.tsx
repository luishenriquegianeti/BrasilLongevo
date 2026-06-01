// src/components/modals/AddPatientModal.tsx

import { useState } from "react";
import {
  X, Plus, User, Phone, MapPin, Calendar,
  Stethoscope, Activity, ClipboardList, Save,
} from "lucide-react";
import type { Patient } from "../../types/Patient";

interface Props {
  onClose: () => void;
  onSave: (patient: Patient) => void;
}

const EMPTY_FORM = {
  name: "",
  age: "",
  phone: "",
  address: "",
  doctor: "",
  conditions: "",
  notes: "",
};

// Estilo compartilhado dos inputs
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1.5px solid #94a3b8",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  background: "#f8fafc",
  color: "#1e293b",
};

export default function AddPatientModal({ onClose, onSave }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const newPatient: Patient = {
      id: Date.now(),
      name: form.name,
      age: parseInt(form.age) || 0,
      phone: form.phone,
      address: form.address,
      doctor: form.doctor,
      conditions: form.conditions.split(",").map((s) => s.trim()).filter(Boolean),
      medications: [],
      nextDose: "—",
      status: "ok",
      missedDoses: 0,
      notes: form.notes,
      lastVisit: new Date().toLocaleDateString("pt-BR"),
    };
    onSave(newPatient);
    onClose();
  };

  const TEXT_FIELDS = [
    { key: "name",       label: "Nome Completo",                    Icon: User,        placeholder: "Ex: Maria Silva",        full: false },
    { key: "age",        label: "Idade",                            Icon: Calendar,    placeholder: "Ex: 72",                 full: false },
    { key: "phone",      label: "Telefone",                         Icon: Phone,       placeholder: "(14) 99000-0000",        full: false },
    { key: "address",    label: "Endereço",                         Icon: MapPin,      placeholder: "Rua, número",            full: false },
    { key: "doctor",     label: "Médico Responsável",               Icon: Stethoscope, placeholder: "Dr. Nome",               full: false },
    { key: "conditions", label: "Condições (separe por vírgula)",   Icon: Activity,    placeholder: "Diabetes, Pressão Alta", full: true  },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.55)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 520,
          boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
          fontFamily: "inherit",
        }}
      >
        {/* Cabeçalho */}
        <div
          style={{
            background: "linear-gradient(135deg, #0b0b0b, #3b82f6)",
            borderRadius: "20px 20px 0 0",
            padding: "22px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff" }}>
            <Plus size={20} />
            <span style={{ fontSize: 18, fontWeight: 700 }}>Novo Paciente</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: 10,
              color: "#fff",
              width: 36,
              height: 36,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Formulário */}
        <div style={{ padding: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            {TEXT_FIELDS.map(({ key, label, Icon, placeholder, full }) => (
              <div key={key} style={{ gridColumn: full ? "1 / -1" : undefined }}>
                <label
                  style={{
                    fontSize: 12,
                    color: "#475569",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 5,
                  }}
                >
                  <Icon size={12} />
                  {label}
                </label>
                <input
                  value={form[key as keyof typeof EMPTY_FORM]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>

          {/* Observações */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                fontSize: 12,
                color: "#475569",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginBottom: 5,
              }}
            >
              <ClipboardList size={12} />
              Observações
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Notas sobre o paciente..."
              rows={3}
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>

          {/* Botões */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: "1.5px solid #cbd5e1",
                background: "#fff",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                color: "#64748b",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              style={{
                flex: 2,
                padding: 12,
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #0e0e0f, #3b82f6)",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Save size={15} />
              Salvar Paciente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}