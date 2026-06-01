// ============================================================
// COMPONENTE RAIZ — src/App.tsx
// Aqui ficam SOMENTE os estados e a montagem dos componentes.
// Toda a lógica visual está dentro de cada componente separado.
//
// FLUXO DE DADOS:
//   App.tsx (estado) → props → Componentes filhos
//   Componentes filhos → callbacks (onXxx) → App.tsx atualiza estado
// src/App.tsx
import { useState } from "react";
import { useControles } from "./hooks/useControles";
import type { ControleItem } from "./hooks/useControles";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Cards from "./components/Cards";
import TabelaPacientes from "./components/TabelaPacientes";
import AddPatientModal from "./components/modals/TelPacient";
import NotificationPanel from "./components/TelNotification";
import Medicamento from "./components/TelMedicamento";
import EditPatientModal from "./components/modals/EditPatientModal";
import ConfirmModal from "./components/modals/ConfirmModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const { controles, loading, stats, fetchAll, search, deleteControle } = useControles();

  const [showAddModal, setShowAddModal]       = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery]         = useState("");
  const [activeNav, setActiveNav]             = useState("Pacientes");
  const [editingItem, setEditingItem]         = useState<ControleItem | null>(null);
  const [deletingId, setDeletingId]           = useState<number | null>(null);

  const alertCount = controles.filter(
    (c) => c.status === "late" || c.status === "urgent"
  ).length;

  const handleSearchChange = (term: string) => {
    setSearchQuery(term);
    search(term);
  };

  const handleDeleteRequest = (id: number) => {
    setDeletingId(id);
  };

  const handleDeleteConfirm = async () => {
    if (deletingId === null) return;
    try {
      await deleteControle(deletingId);
      toast.success("Paciente excluído com sucesso!");
    } catch {
      toast.error("Erro ao excluir. Tente novamente.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f1f5f9",
        fontFamily: "'DM Sans', sans-serif",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onAddPatient={() => setShowAddModal(true)}
      />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          alertCount={alertCount}
          onToggleNotifications={() => setShowNotifications((prev) => !prev)}
          notificationsOpen={showNotifications}
        />

        <div style={{ flex: 1, overflowY: "auto" }}>
{/* Página: Pacientes */}
          {activeNav === "Pacientes" && (
            <>
              <Cards
                total={stats.total}
                onTime={stats.onTime}
                late={stats.late}
                urgent={stats.urgent}
              />

              <TabelaPacientes
                controles={controles}
                loading={loading}
                onEdit={(item) => setEditingItem(item)}
                onDelete={handleDeleteRequest}        
                onAdd={() => setShowAddModal(true)}
                onSearch={search}
              />
            </>
          )}
{/* Página: Medicamentos */}
          {activeNav === "Medicamentos" && <Medicamento />}
        </div>
      </main>

      {/* Modal adicionar */}
      {showAddModal && (
        <AddPatientModal
          onClose={() => setShowAddModal(false)}
          onSave={() => { fetchAll(); setShowAddModal(false); }}
        />
      )}

      {/* Modal editar */}
      {editingItem && (
        <EditPatientModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={() => { fetchAll(); setEditingItem(null); }}
        />
      )}

      {/* Modal confirmar exclusão */}
      {deletingId !== null && (
        <ConfirmModal
          message="Você realmente deseja excluir este paciente e todos os seus medicamentos?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingId(null)}
        />
      )}

      {/* Painel de notificações */}
      {showNotifications && (
        <NotificationPanel
          patients={controles}
          onClose={() => setShowNotifications(false)}
          onViewPatient={(c) => {
            setEditingItem(c);
            setShowNotifications(false);
          }}
        />
      )}

      <ToastContainer autoClose={3000} position="bottom-left" />
    </div>
  );
}