// src/components/Pagination.tsx
// Paginação inteligente: mostra primeira, última, página atual ±2 e reticências.

interface Props {
  page: number;
  totalPages: number;
  total: number;
  itemsPerPage: number;
  label?: string;
  onChange: (p: number) => void;
}

export default function Pagination({ page, totalPages, total, itemsPerPage, label = "itens", onChange }: Props) {
  if (totalPages <= 1) return null;

  // Quais números mostrar
  const getPages = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const delta = 2; // páginas ao redor da atual

    const range: number[] = [];
    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    pages.push(1);
    if (range[0] > 2) pages.push("...");
    pages.push(...range);
    if (range[range.length - 1] < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const btnStyle = (active: boolean, disabled = false): React.CSSProperties => ({
    minWidth: 32,
    height: 32,
    padding: "0 6px",
    borderRadius: 8,
    border: "1.5px solid",
    borderColor: active ? "#3b82f6" : "#e2e8f0",
    background: active ? "#3b82f6" : disabled ? "#f8fafc" : "#fff",
    color: active ? "#fff" : disabled ? "#cbd5e1" : "#64748b",
    cursor: disabled ? "default" : "pointer",
    fontSize: 13,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const from = Math.min((page - 1) * itemsPerPage + 1, total);
  const to   = Math.min(page * itemsPerPage, total);

  return (
    <div style={{ padding: "14px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 13, color: "#94a3b8" }}>
        Mostrando {from}–{to} de {total} {label}
      </span>

      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        {/* Anterior */}
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          style={btnStyle(false, page === 1)}
        >
          ‹
        </button>

        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} style={{ padding: "0 4px", color: "#94a3b8", fontSize: 13 }}>…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              style={btnStyle(p === page)}
            >
              {p}
            </button>
          )
        )}

        {/* Próximo */}
        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          style={btnStyle(false, page === totalPages)}
        >
          ›
        </button>
      </div>
    </div>
  );
}
