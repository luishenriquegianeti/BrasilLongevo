// src/pages/MedicamentosPage.tsx
// Painel de controle de medicamentos.
// Mostra cards de resumo, busca, tabela com paginação e ações.

import { useState } from "react";
import { Pill, CheckCircle, AlertTriangle, XCircle, Search, Filter, Edit3, Trash2, Plus } from "lucide-react";
import { MEDICATIONS_DATA } from "../data/medications";
import type { Medication, MedicationStatus } from "../types/midicantion";

// ── Status config ──────────────────────────────────────────
const STATUS_CONFIG: Record<MedicationStatus, { label: string; color: string; bg: string }> = {
  in_stock:     { label: "Em estoque",    color: "#14e617", bg: "#dcfce7" },
  low_stock:    { label: "Estoque baixo", color: "#f59e0b", bg: "#fef3c7" },
  out_of_stock: { label: "Sem estoque",   color: "#ef4444", bg: "#fee2e2" },
};

const ITEMS_PER_PAGE = 5;

export default function MedicamentosPage() {
  const [medications, setMedications] = useState<Medication[]>(MEDICATIONS_DATA);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Filtra pela busca
  const filtered = medications.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  // Paginação
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = (id: number) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  // Contadores para os cards
  const stats = {
    total:     medications.length,
    inStock:   medications.filter((m) => m.status === "in_stock").length,
    lowStock:  medications.filter((m) => m.status === "low_stock").length,
    outStock:  medications.filter((m) => m.status === "out_of_stock").length,
  };

  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Cards de resumo */}
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Total de Remédios",  value: stats.total,    sub: "itens cadastrados",   Icon: Pill,          color: "#3b82f6", bg: "#eff6ff" },
          { label: "Em Estoque",         value: stats.inStock,  sub: "itens disponíveis",   Icon: CheckCircle,   color: "#22c55e", bg: "#f0fdf4" },
          { label: "Estoque Baixo",      value: stats.lowStock, sub: "itens",               Icon: AlertTriangle, color: "#f59e0b", bg: "#fffbeb" },
          { label: "Sem Estoque",        value: stats.outStock, sub: "itens",               Icon: XCircle,       color: "#ef4444", bg: "#fff1f2" },
        ].map(({ label, value, sub, Icon, color, bg }) => (
          <div key={label} 
          style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", boxShadow: "0 1px 4px rgba(255, 251, 251, 0.06)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, 
              height: 44, 
              borderRadius: 12, 
              background: bg, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              flexShrink: 0 }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1.1 }}>{value}</div>
              <div style={{ fontSize: 11, color: "#cbd5e1" }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div style={{ background: "#fff", 
        borderRadius: 18, 
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

        {/* Cabeçalho da tabela */}
        <div style={{ padding: "18px 24px", 
          borderBottom: "1px solid #f1f5f9", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          gap: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Lista de Medicamentos</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{filtered.length} encontrado(s)</div>
          </div>

          <div style={{ display: "flex", 
            gap: 10, 
            alignItems: "center" }}>
            
            {/* Busca */}
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", 
                left: 12, 
                top: "50%", 
                transform: "translateY(-50%)",
                 color: "#94a3b8" }} />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Buscar medicamento..."
                style={{ padding: "9px 12px 9px 34px", 
                  border: "1.5px solid #e2e8f0", 
                  borderRadius: 10, 
                  fontSize: 13, 
                  outline: "none", 
                  background: "#f8fafc",
                  color: "#000000",
                  width: 220, 
                  fontFamily: "inherit" }}
              />
            </div>

            {/* Filtros (visual) */}
            <button style={{ display: "flex",
               alignItems: "center",
                gap: 6, 
                padding: "9px 14px", 
                border: "1.5px solid #e2e8f0",
                 borderRadius: 10, 
                 background: "#fff", 
                 cursor: "pointer", 
                 fontSize: 13, 
                 fontWeight: 600, 
                 color: "#475569" }}>
              <Filter size={13} />
              Filtros
            </button>

            {/* Novo medicamento */}
            <button style={{ display: "flex",
               alignItems: "center",
                gap: 6, padding: "9px 14px",
                border: "none",
                 borderRadius: 10,
                  background: "linear-gradient(135deg, #000000, #3b82f6)", 
                  color: "#fff", 
                  cursor: "pointer", 
                  fontSize: 13, 
                  fontWeight: 700 }}>   
              <Plus size={14} />
              Novo Medicamento
            </button>
          </div>
        </div>

        {/* Colunas */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.4fr 1fr 1fr auto", padding: "12px 24px", gap: 12 }}>
          {["Medicamento", "Categoria", "Apresentação", "Estoque", "Status", "Ações"].map((h) => (
            <div key={h} style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>{h}</div>
          ))}
        </div>

        {/* Linhas */}
        {paginated.map((med, i) => (
          <MedicationRow key={med.id} med={med} isEven={i % 2 === 0} onDelete={handleDelete} />
        ))}

        {paginated.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 14 }}>
            Nenhum medicamento encontrado.
          </div>
        )}

        {/* Paginação */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>
            Mostrando {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length} medicamentos
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: 32, height: 32, borderRadius: 8, border: "1.5px solid",
                  borderColor: p === page ? "#3b82f6" : "#e2e8f0",
                  background: p === page ? "#3b82f6" : "#fff",
                  color: p === page ? "#fff" : "#64748b",
                  cursor: "pointer", fontSize: 13, fontWeight: 600,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Linha individual da tabela ─────────────────────────────
function MedicationRow({ med, isEven, onDelete }: { med: Medication; isEven: boolean; onDelete: (id: number) => void }) {
  const base = isEven ? "#fff" : "#fafafa";
  const { label, color, bg } = STATUS_CONFIG[med.status];

  // Ícone colorido por categoria
  const iconColor = med.status === "out_of_stock" ? "#ef4444" : med.status === "low_stock" ? "#f59e0b" : "#3b82f6";

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.4fr 1fr 1fr auto", padding: "14px 24px", gap: 12, alignItems: "center", borderTop: "1px solid #f8fafc", background: base, transition: "background 0.15s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
      onMouseLeave={(e) => (e.currentTarget.style.background = base)}
    >
      {/* Nome */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${iconColor}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Pill size={16} color={iconColor} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{med.name}</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>{med.subtitle}</div>
        </div>
      </div>

      {/* Categoria */}
      <div style={{ fontSize: 13, color: "#475569" }}>{med.category}</div>

      {/* Apresentação */}
      <div style={{ fontSize: 13, color: "#475569" }}>{med.presentation}</div>

      {/* Estoque */}
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: med.stock === 0 ? "#ef4444" : "#1e293b" }}>{med.stock}</div>
        <div style={{ fontSize: 11, color: "#94a3b8" }}>unidades</div>
      </div>

      {/* Status badge */}
      <span style={{ display: "inline-flex", alignItems: "center", background: bg, color, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, width: "fit-content" }}>
        {label}
      </span>

      {/* Ações */}
      <div style={{ display: "flex", gap: 6 }}>
        <button style={{ padding: "7px 9px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center" }}>
          <Edit3 size={12} />
        </button>
        <button onClick={() => onDelete(med.id)} style={{ padding: "7px 9px", borderRadius: 8, border: "1.5px solid #fee2e2", background: "#fff", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center" }}>
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
