// src/components/modals/MedicamentoModal.tsx
import { useState } from "react";
import { X, Plus, Pill, Save, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import type { Medication } from "../../types/midicantion";

interface Props {
  item?: Medication;
  onClose: () => void;
  onSave: () => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", background: "#f8fafc", color: "#1e293b",
};
const labelStyle: React.CSSProperties = {
  fontSize: 12, color: "#64748b", fontWeight: 600,
  display: "block", marginBottom: 6,
};

export default function MedicamentoModal({ item, onClose, onSave }: Props) {
  const isEdit = !!item;

  // ← apenas os 4 campos que existem no banco
  const [name, setName]           = useState(item?.name ?? "");
  const [category, setCategory]   = useState(item?.category ?? "");
  const [descricao, setDescricao] = useState(item?.subtitle ?? ""); // coluna Descricao
  const [stock, setStock]         = useState<number>(item?.stock ?? 0);
  const [saving, setSaving]       = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.warn("Informe o nome do medicamento.");
      return;
    }
    if (!category.trim()) {
      toast.warn("Informe a categoria.");
      return;
    }

    setSaving(true);
    try {
    
      const url    = isEdit ? `/api/${item!.id}` : "/api/";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Nome:      name.trim(),
          Categoria: category.trim(),
          Descricao: descricao.trim(),
          Estoque:   stock,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success(isEdit ? "Medicamento atualizado com sucesso!" : "Medicamento cadastrado com sucesso!");
      onSave();
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const canSave = name.trim() && category.trim() && !saving;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 520, boxShadow: "0 25px 60px rgba(0,0,0,0.2)", fontFamily: "inherit", display: "flex", flexDirection: "column" }}>

        {/* Cabeçalho */}
        <div style={{ background: "linear-gradient(135deg, #0b0b0b, #3b82f6)", borderRadius: "20px 20px 0 0", padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff" }}>
            {isEdit ? <Pencil size={20} /> : <Plus size={20} />}
            <span style={{ fontSize: 18, fontWeight: 700 }}>
              {isEdit ? "Editar Medicamento" : "Novo Medicamento"}
            </span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, color: "#fff", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} />
          </button>
        </div>

        {/* Corpo */}
        <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Nome */}
          <div>
            <label style={labelStyle}>Nome do Medicamento *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Paracetamol"
              style={inputStyle}
            />
          </div>

          {/* Categoria + Descrição lado a lado */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Categoria *</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Analgésico"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Descrição </label>
              <input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: 500mg - Comprimido"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Estoque */}
          <div>
            <label style={labelStyle}>Quantidade em Estoque</label>
            <input
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              style={inputStyle}
            />
          </div>

          {/* Preview de status */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "#f8fafc", border: "1.5px solid #e2e8f0" }}>
            <Pill size={14} color={stock === 0 ? "#ef4444" : stock <= 10 ? "#f59e0b" : "#22c55e"} />
            <span style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>
              Status:{" "}
              <span style={{ color: stock === 0 ? "#ef4444" : stock <= 10 ? "#f59e0b" : "#22c55e" }}>
                {stock === 0 ? "Sem estoque" : stock <= 10 ? "Estoque baixo" : "Em estoque"}
              </span>
            </span>
          </div>
        </div>

        {/* Rodapé */}
        <div style={{ padding: "16px 28px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10, flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 12, borderRadius: 12, border: "1.5px solid #cbd5e1", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#64748b" }}>
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            style={{ flex: 2, padding: 12, borderRadius: 12, border: "none", background: canSave ? "linear-gradient(135deg, #0e0e0f, #3b82f6)" : "#e2e8f0", cursor: canSave ? "pointer" : "default", fontSize: 14, fontWeight: 700, color: canSave ? "#fff" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}
          >
            <Save size={15} />
            {saving ? "Salvando..." : isEdit ? "Salvar Alterações" : "Cadastrar Medicamento"}
          </button>
        </div>
      </div>
    </div>
  );
}