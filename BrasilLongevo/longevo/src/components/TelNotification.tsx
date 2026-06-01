// ============================================================
// COMPONENTE — src/components/NotificationPanel.tsx  (novo)
// Painel lateral que desliza da direita ao clicar no sino.
// Lista automaticamente os pacientes com status "late" ou "urgent".
// ============================================================

// src/components/TelNotification.tsx

import { Bell, X, CheckCircle, Eye } from "lucide-react";
import type { ControleItem } from "../hooks/useControles";
import StatusBadge, { STATUS_CONFIG } from "./Status";

interface Props {
  patients: ControleItem[];
  onClose: () => void;
  onViewPatient: (item: ControleItem) => void;
}

export default function NotificationPanel({ patients, onClose, onViewPatient }: Props) {
  const alerts = patients.filter(
    (p) => p.status === "late" || p.status === "urgent"
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: 340,
        background: "#fff",
        boxShadow: "-4px 0 30px rgba(0,0,0,0.12)",
        zIndex: 90,
        display: "flex",
        flexDirection: "column",
        fontFamily: "inherit",
      }}
    >
      {/* Cabeçalho */}
      <div
        style={{
          background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
          padding: "22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff" }}>
          <Bell size={18} />
          <span style={{ fontSize: 17, fontWeight: 700 }}>Alertas ({alerts.length})</span>
        </div>
        <button
          onClick={onClose}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, color: "#fff", width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Lista */}
      <div style={{ overflowY: "auto", flex: 1, padding: 16 }}>
        {alerts.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
            <CheckCircle size={32} style={{ marginBottom: 8, color: "#22c55e" }} />
            <div style={{ fontSize: 14 }}>Nenhum alerta pendente</div>
          </div>
        ) : (
          alerts.map((item) => {
            const { bg, color } = STATUS_CONFIG[item.status];
            return (
              <div
                key={item.id}
                style={{ background: bg, border: `1px solid ${color}33`, borderRadius: 14, padding: 14, marginBottom: 12 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{item.paciente}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{item.medicamento}</div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                {/* Horários não tomados */}
                <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.8, marginBottom: 10 }}>
                  {item.horario1 && !item.tomou1 && <div>⏰ {item.horario1.substring(0, 5)} — não tomou</div>}
                  {item.horario2 && !item.tomou2 && <div>⏰ {item.horario2.substring(0, 5)} — não tomou</div>}
                  {item.horario3 && !item.tomou3 && <div>⏰ {item.horario3.substring(0, 5)} — não tomou</div>}
                </div>

                <button
                  onClick={() => { onViewPatient(item); onClose(); }}
                  style={{ width: "100%", padding: "8px", borderRadius: 10, border: `1.5px solid ${color}`, background: "#fff", color, cursor: "pointer", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                >
                  <Eye size={12} />
                  Ver Detalhes
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
