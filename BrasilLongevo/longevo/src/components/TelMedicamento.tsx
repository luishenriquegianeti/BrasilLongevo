// src/pages/MedicamentosPage.tsx
// Painel de controle de medicamentos.
// Mostra cards de resumo, busca, tabela com paginação e ações.

// src/pages/MedicamentosPage.tsx
// Painel de controle de medicamentos — dados vindos do MySQL via API Express.
// src/pages/MedicamentosPage.tsx
import { useState } from "react";
import { Pill, CheckCircle, AlertTriangle, XCircle, Search, Filter, Edit3, Trash2, Plus } from "lucide-react";
import { useMedicamentos } from "../hooks/useMedicamentos";
import type { Medication, MedicationStatus } from "../types/midicantion";
import Pagination from "../components/Pagination";
import ConfirmModal from "../components/modals/ConfirmModal";
import MedicamentoModal from "../components/modals/MedicamentoModal";
import { toast } from "react-toastify";

// ── Status config
const STATUS_CONFIG: Record<MedicationStatus, { label: string; color: string; bg: string }> = {
  in_stock:     { label: "Em estoque",    color: "#14e617", bg: "#dcfce7" },
  low_stock:    { label: "Estoque baixo", color: "#f59e0b", bg: "#fef3c7" },
  out_of_stock: { label: "Sem estoque",   color: "#ef4444", bg: "#fee2e2" },
};

const ITEMS_PER_PAGE = 5;

export default function MedicamentosPage() {
  const { medications, loading, error, search, deleteMedication, fetchAll } = useMedicamentos();
  const [searchTerm, setSearchTerm]     = useState("");
  const [page, setPage]                 = useState(1);
  const [deletingId, setDeletingId]     = useState<number | null>(null);
  const [editingMed, setEditingMed]     = useState<Medication | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
// Pesquisa no banco ao digitar (debounce simples via onChange)

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
    search(value);
  };
 // Paginação local (sobre o resultado já filtrado pelo backend)

  const handleDeleteConfirm = async () => {
    if (deletingId === null) return;
    try {
      await deleteMedication(deletingId);
      toast.success("Medicamento excluído com sucesso!");
    } catch {
      toast.error("Erro ao excluir. Tente novamente.");
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.ceil(medications.length / ITEMS_PER_PAGE);
  const paginated  = medications.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
// Contadores para os cards

  const stats = {
    total:    medications.length,
    inStock:  medications.filter((m) => m.status === "in_stock").length,
    lowStock: medications.filter((m) => m.status === "low_stock").length,
    outStock: medications.filter((m) => m.status === "out_of_stock").length,
  };

  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Cards de resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Total de Remédios", value: stats.total,    sub: "itens cadastrados", Icon: Pill,          color: "#3b82f6", bg: "#eff6ff" },
          { label: "Em Estoque",        value: stats.inStock,  sub: "itens disponíveis", Icon: CheckCircle,   color: "#22c55e", bg: "#f0fdf4" },
          { label: "Estoque Baixo",     value: stats.lowStock, sub: "itens",             Icon: AlertTriangle, color: "#f59e0b", bg: "#fffbeb" },
          { label: "Sem Estoque",       value: stats.outStock, sub: "itens",             Icon: XCircle,       color: "#ef4444", bg: "#fff1f2" },
        ].map(({ label, value, sub, Icon, color, bg }) => (
          <div key={label} style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
      <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

        {/* Cabeçalho */}
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Lista de Medicamentos</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{medications.length} encontrado(s)</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                       {/* Busca */}

            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar medicamento..."
                style={{ padding: "9px 12px 9px 34px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", background: "#f8fafc", color: "#000", width: 220, fontFamily: "inherit" }}
              />
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#475569" }}>
              <Filter size={13} />
              Filtros
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 10, background: "linear-gradient(135deg, #000000, #3b82f6)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700 }}
            >
              <Plus size={14} />
              Novo Medicamento
            </button>
          </div>
        </div>

        {/* Colunas */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.4fr 1fr 1fr auto", padding: "12px 24px", gap: 12 }}>
          {["Medicamento", "Categoria", "apresentação", "Estoque", "Status", "Ações"].map((h) => (
            <div key={h} style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>{h}</div>
          ))}
        </div>
{/* Estado: carregando */}

        {loading && <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 14 }}>
          Carregando medicamentos...
          </div>}
        {/* Estado: erro */}
        {error && !loading && <div style={{ textAlign: "center", padding: "40px 0", color: "#8d8585", fontSize: 14 }}>
          {error}
          </div>}

      {/* Linhas */}
        {!loading && !error && paginated.map((med, i) => (
          <MedicationRow
            key={med.id}
            med={med}
            isEven={i % 2 === 0}
            onDelete={(id) => setDeletingId(id)}
            onEdit={(med) => setEditingMed(med)}
          />
        ))}

        {!loading && !error && paginated.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 14 }}>Nenhum medicamento encontrado.</div>
        )}
{/* Paginação inteligente */}
        <Pagination
          page={page}
          totalPages={totalPages}
          total={medications.length}
          itemsPerPage={ITEMS_PER_PAGE}
          label="medicamentos"
          onChange={(p) => setPage(p)}
        />
      </div>

      {/* Modal cadastrar */}
      {showAddModal && (
        <MedicamentoModal
          onClose={() => setShowAddModal(false)}
          onSave={() => { fetchAll(); setShowAddModal(false); }}
        />
      )}

      {/* Modal editar */}
      {editingMed && (
        <MedicamentoModal
          item={editingMed}
          onClose={() => setEditingMed(null)}
          onSave={() => { fetchAll(); setEditingMed(null); }}
        />
      )}

      {/* Modal confirmar exclusão */}
      {deletingId !== null && (
        <ConfirmModal
          message="Você realmente deseja excluir este medicamento?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}

// ── Linha individual
function MedicationRow({ med, isEven, onDelete, onEdit }: {
  med: Medication;
  isEven: boolean;
  onDelete: (id: number) => void;
  onEdit: (med: Medication) => void;
}) {
  const base = isEven ? "#fff" : "#fafafa";
  const { label, color, bg } = STATUS_CONFIG[med.status];
  const iconColor = med.status === "out_of_stock" ? "#ef4444" : med.status === "low_stock" ? "#f59e0b" : "#3b82f6";

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.4fr 1fr 1fr auto", padding: "14px 24px", gap: 12, alignItems: "center", borderTop: "1px solid #f8fafc", background: base, transition: "background 0.15s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
      onMouseLeave={(e) => (e.currentTarget.style.background = base)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${iconColor}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Pill size={16} color={iconColor} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{med.name}</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>{med.subtitle}</div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: "#475569" }}>{med.category}</div>
      <div style={{ fontSize: 13, color: "#475569" }}>{med.presentation}</div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: med.stock === 0 ? "#ef4444" : "#1e293b" }}>{med.stock}</div>
        <div style={{ fontSize: 11, color: "#94a3b8" }}>unidades</div>
      </div>
      <span style={{ display: "inline-flex", alignItems: "center", background: bg, color, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, width: "fit-content" }}>
        {label}
      </span>
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={() => onEdit(med)}
          style={{ padding: "7px 9px", borderRadius: 8, border: "1.5px solid #dbeafe", background: "#eff6ff", color: "#3951da", cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <Edit3 size={12} />
        </button>
        <button
          onClick={() => onDelete(med.id)}
          style={{ padding: "7px 9px", borderRadius: 8, border: "1.5px solid #fee2e2", background: "#fff", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}