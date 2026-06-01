// ============================================================
// COMPONENTE — src/components/TabelaPacientes.tsx  (já existia)
// Tabela com a lista de pacientes.
// Cada linha tem 3 botões de ação: Ver, Editar, Excluir.
// Recebe os pacientes filtrados do App.tsx via props.
// ============================================================

// src/components/TabelaPacientes.tsx
// Tabela de controle de pacientes vinda do banco de dados.
// Status calculado automaticamente pelo backend baseado nos horários.

// src/components/TabelaPacientes.tsx

import { useState } from "react";
import { Clock, Trash2, Plus, Search, Pencil } from "lucide-react";
import type { ControleItem } from "../hooks/useControles";
import type { PatientStatus } from "../types/Patient";
import Pagination from "./Pagination";
// ── Config de status ─
const STATUS_CONFIG: Record<PatientStatus, { label: string; color: string; bg: string; dot: string }> = {
  ok:      { label: "Em dia",   color: "#16a34a", bg: "#dcfce7", dot: "#22c55e" },
  partial: { label: "Parcial",  color: "#d97706", bg: "#fef3c7", dot: "#f59e0b" },
  late:    { label: "Atrasado", color: "#dc2626", bg: "#fee2e2", dot: "#ef4444" },
  urgent:  { label: "Urgente",  color: "#7c3aed", bg: "#ede9fe", dot: "#8b5cf6" },
};
// Colunas: Paciente | Medicamento | H1 | T1 | H2 | T2 | H3 | T3 | Status | Ações
const GRID = "1.4fr 1.2fr 0.7fr 0.6fr 0.7fr 0.6fr 0.7fr 0.6fr 0.9fr 90px";
const ITEMS_PER_PAGE = 5;

interface Props {
  controles: ControleItem[];
  loading: boolean;
  onEdit: (c: ControleItem) => void;   
  onDelete: (id: number) => void;
  onAdd: () => void;
  onSearch: (term: string) => void;
}

export default function TabelaPacientes({ controles, loading, onEdit, onDelete, onAdd, onSearch }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(controles.length / ITEMS_PER_PAGE);
  const paginated  = controles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
// Reset para página 1 quando a busca muda o total
  const handleSearch = (term: string) => {
    setPage(1);
    onSearch(term);
  };

  return (
    <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", margin: "0 28px 28px" }}>

      {/* Cabeçalho */}
      <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Controle de Pacientes</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{controles.length} encontrado(s)</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* Busca */}
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar paciente..."
              style={{ padding: "9px 12px 9px 34px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", background: "#f8fafc", color: "#000", width: 200, fontFamily: "inherit" }}
            />
          </div>
          <button
            onClick={onAdd}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", border: "none", borderRadius: 12, background: "linear-gradient(135deg, #000000, #3b82f6)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
          >
            <Plus size={14} />
            Adicionar Paciente
          </button>
        </div>
      </div>

      {/* Títulos das colunas */}
      <div style={{ display: "grid", gridTemplateColumns: GRID, padding: "12px 24px", gap: 8, borderBottom: "1px solid #f1f5f9" }}>
        {["Paciente", "Medicamento", "Horário 1", "Tomou", "Horário 2", "Tomou", "Horário 3", "Tomou", "Status", "Ações"].map((h, i) => (
          <div key={`${h}-${i}`} style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
        ))}
      </div>
{/* Carregando */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 14 }}>
          Carregando pacientes...
        </div>
      )}

      {/* Linhas paginadas — passa onEdit corretamente */}
      {!loading && paginated.map((item, i) => (
        <ControleRow key={item.id} item={item} isEven={i % 2 === 0} onEdit={onEdit} onDelete={onDelete} />
      ))}
{/* Vazio */}
      {!loading && controles.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 14 }}>
          Nenhum paciente encontrado.
        </div>
      )}
{/* Paginação inteligente */}
      <Pagination
        page={page}
        totalPages={totalPages}
        total={controles.length}
        itemsPerPage={ITEMS_PER_PAGE}
        label="pacientes"
        onChange={(p) => setPage(p)}
      />
    </div>
  );
}

// ── Linha individual ─
function ControleRow({ item, isEven, onEdit, onDelete }: {
  item: ControleItem;
  isEven: boolean;
  onEdit: (c: ControleItem) => void;   
  onDelete: (id: number) => void;
}) {
  const base = isEven ? "#fff" : "#fafafa";
  const { label, color, bg, dot } = STATUS_CONFIG[item.status];

  const formatHora = (h: string | null) => h ? h.substring(0, 5) : "—";

  

  const TomouBadge = ({ tomou, horario }: { tomou: boolean; horario: string | null }) => {
    if (!horario) return <span style={{ color: "#cbd5e1", fontSize: 12 }}>—</span>;
    return (
      <span style={{
        fontSize: 11, fontWeight: 700,
        color: tomou ? "#16a34a" : "#dc2626",
        background: tomou ? "#dcfce7" : "#fee2e2",
        padding: "3px 8px", borderRadius: 20,
        whiteSpace: "nowrap",
      }}>        {tomou ? "Sim" : "Não"}
      </span>
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: GRID,
        padding: "12px 24px",
        gap: 8,
        alignItems: "center",
        borderTop: "1px solid #f8fafc",
        background: base,
        transition: "background 0.15s",
      }}      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
      onMouseLeave={(e) => (e.currentTarget.style.background = base)}
    >
      {/* Paciente */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #3b3b3b, #479bfc)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, color: "#fff", fontSize: 13, flexShrink: 0,
        }}>          {item.paciente[0]}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.paciente}
        </span>
      </div>

      {/* Medicamento */}
      <div style={{ fontSize: 13, color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {item.medicamento}
      </div>
{/* Horário 1 */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#475569" }}>
        {item.horario1 && <Clock size={11} color="#94a3b8" />}
        {formatHora(item.horario1)}
      </div>
     {/* Tomou 1 */}
      <TomouBadge tomou={item.tomou1} horario={item.horario1} />
 {/* Horário 2 */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#475569" }}>
        {item.horario2 && <Clock size={11} color="#94a3b8" />}
        {formatHora(item.horario2)}
      </div>
      {/* Tomou 2 */}
      <TomouBadge tomou={item.tomou2} horario={item.horario2} />
 {/* Horário 3 */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#475569" }}>
        {item.horario3 && <Clock size={11} color="#94a3b8" />}
        {formatHora(item.horario3)}
      </div>
      {/* Tomou 3 */}
      <TomouBadge tomou={item.tomou3} horario={item.horario3} />

      {/* Status */}
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        background: bg, color, padding: "4px 10px",
        borderRadius: 20, fontSize: 11, fontWeight: 700,
        whiteSpace: "nowrap", width: "fit-content",
      }}>        <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot, display: "inline-block", flexShrink: 0 }} />
        {label}
      </span>

      {/* Ações */}
      <div style={{ display: "flex", gap: 5 }}>
        <button
          onClick={() => onEdit(item)}   
          style={{ padding: "6px 8px", borderRadius: 8, border: "1.5px solid #dbeafe", background: "#eff6ff", color: "#3951da", cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <Pencil size={11} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          style={{ padding: "6px 8px", borderRadius: 8, border: "1.5px solid #fee2e2", background: "#fff", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}