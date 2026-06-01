// src/components/modals/ConfirmModal.tsx
import { Trash2, X } from "lucide-react";

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ message, onConfirm, onCancel }: Props) {
  return (
    <div
      onClick={onCancel}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 420, boxShadow: "0 25px 60px rgba(0,0,0,0.2)", fontFamily: "inherit", overflow: "hidden" }}
      >
        {/* Cabeçalho */}
        <div style={{ background: "linear-gradient(135deg, #1e293b, #ef4444)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff" }}>
            <Trash2 size={18} />
            <span style={{ fontSize: 16, fontWeight: 700 }}>Confirmar Exclusão</span>
          </div>
          <button
            onClick={onCancel}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, color: "#fff", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Corpo */}
        <div style={{ padding: "28px 24px" }}>
          <p style={{ fontSize: 14, color: "#475569", margin: 0, lineHeight: 1.6 }}>
            {message}
          </p>
          <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>
            Esta ação não pode ser desfeita.
          </p>
        </div>

        {/* Rodapé */}
        <div style={{ padding: "0 24px 24px", display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, padding: 12, borderRadius: 12, border: "1.5px solid #cbd5e1", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#64748b" }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1e293b, #ef4444)", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Trash2 size={14} />
            Sim, excluir
          </button>
        </div>
      </div>
    </div>
  );
}